-- =========================================================
-- Link financial expenses to goals
-- Run this script once in Supabase SQL Editor.
--
-- Result:
-- 1) create_expense accepts an optional goal id.
-- 2) The financial transaction stores goal_id.
-- 3) Goal spent/progress are recalculated automatically.
-- 4) Existing linked transactions are used to backfill goals.
-- =========================================================

-- ---------------------------------------------------------
-- Recalculate one goal from its linked expense transactions
-- ---------------------------------------------------------
create or replace function public.recalculate_goal_financials(p_goal_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
    v_spent bigint;
    v_budget bigint;
    v_progress integer;
begin
    if p_goal_id is null then
        return;
    end if;

    select coalesce(sum(amount), 0)
    into v_spent
    from public.financial_transactions
    where goal_id = p_goal_id
      and type = 'expense';

    select budget
    into v_budget
    from public.goals
    where id = p_goal_id;

    if not found then
        return;
    end if;

    if coalesce(v_budget, 0) > 0 then
        v_progress := least(
            100,
            greatest(
                0,
                round((v_spent::numeric * 100) / v_budget)::integer
            )
        );
    else
        v_progress := 0;
    end if;

    update public.goals
    set spent = v_spent,
        progress = v_progress,
        updated_at = now()
    where id = p_goal_id;
end;
$$;

revoke all on function public.recalculate_goal_financials(uuid) from public;
grant execute on function public.recalculate_goal_financials(uuid) to authenticated;

-- ---------------------------------------------------------
-- Keep goal financials synchronized with transactions.
-- Handles insert, update and delete, including moving an
-- expense from one goal to another.
-- ---------------------------------------------------------
create or replace function public.sync_goal_financials_from_transaction()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
    if tg_op = 'DELETE' then
        if old.goal_id is not null and old.type = 'expense' then
            perform public.recalculate_goal_financials(old.goal_id);
        end if;
        return old;
    end if;

    if tg_op = 'UPDATE' then
        if old.goal_id is distinct from new.goal_id
           and old.goal_id is not null
           and old.type = 'expense' then
            perform public.recalculate_goal_financials(old.goal_id);
        end if;
    end if;

    if new.goal_id is not null and new.type = 'expense' then
        perform public.recalculate_goal_financials(new.goal_id);
    end if;

    return new;
end;
$$;

drop trigger if exists financial_transactions_goal_sync
on public.financial_transactions;

create trigger financial_transactions_goal_sync
after insert or update or delete
on public.financial_transactions
for each row
execute function public.sync_goal_financials_from_transaction();

-- ---------------------------------------------------------
-- Rebuild all existing goal totals from current transactions.
-- ---------------------------------------------------------
do $$
declare
    v_goal_id uuid;
begin
    for v_goal_id in select id from public.goals loop
        perform public.recalculate_goal_financials(v_goal_id);
    end loop;
end;
$$;

-- ---------------------------------------------------------
-- Replace create_expense with a goal-aware version.
-- The old four-argument function is removed so Supabase RPC
-- resolves the new signature unambiguously.
-- ---------------------------------------------------------
drop function if exists public.create_expense(text, bigint, text, date);

create or replace function public.create_expense(
    p_category text,
    p_amount bigint,
    p_description text,
    p_date date,
    p_goal_id uuid default null
)
returns public.expenses
language plpgsql
security definer
set search_path = public
as $$
declare
    v_expense public.expenses;
    v_balance bigint;
begin
    -- -----------------------------------------------------
    -- Validate amount
    -- -----------------------------------------------------
    if p_amount is null or p_amount <= 0 then
        raise exception 'مبلغ هزینه باید بیشتر از صفر باشد';
    end if;

    -- -----------------------------------------------------
    -- Validate selected goal, when provided
    -- -----------------------------------------------------
    if p_goal_id is not null
       and not exists (
           select 1
           from public.goals
           where id = p_goal_id
       ) then
        raise exception 'هدف انتخاب‌شده وجود ندارد';
    end if;

    -- -----------------------------------------------------
    -- Calculate current cash balance
    -- -----------------------------------------------------
    select coalesce(
        sum(
            case
                when type = 'income' then amount
                when type = 'expense' then -amount
                else 0
            end
        ),
        0
    )
    into v_balance
    from public.financial_transactions;

    if p_amount > v_balance then
        raise exception
            'موجودی موکب برای ثبت این هزینه کافی نیست. موجودی فعلی: % تومان',
            v_balance;
    end if;

    -- -----------------------------------------------------
    -- Insert expense record
    -- -----------------------------------------------------
    insert into public.expenses (
        category,
        amount,
        description,
        date
    )
    values (
        nullif(trim(p_category), ''),
        p_amount,
        coalesce(p_description, ''),
        coalesce(p_date, current_date)
    )
    returning *
    into v_expense;

    -- -----------------------------------------------------
    -- Insert financial transaction and link it to the goal
    -- -----------------------------------------------------
    insert into public.financial_transactions (
        type,
        category,
        amount,
        description,
        goal_id,
        expense_id,
        date
    )
    values (
        'expense',
        coalesce(nullif(trim(p_category), ''), 'هزینه'),
        p_amount,
        case
            when nullif(trim(p_description), '') is not null
                then p_description
            else
                coalesce(nullif(trim(p_category), ''), 'هزینه')
        end,
        p_goal_id,
        v_expense.id,
        coalesce(p_date, current_date)
    );

    return v_expense;
end;
$$;

revoke all on function public.create_expense(text, bigint, text, date, uuid) from public;
grant execute on function public.create_expense(text, bigint, text, date, uuid) to authenticated;
