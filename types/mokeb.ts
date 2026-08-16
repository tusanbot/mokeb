export type GoalStatus = "planning" | "active" | "completed";

export type SubGoal = {
    id: string;
    title: string;
    description?: string;
    budget: number;
    spent: number;
    progress: number;
    completed: boolean;
};

export type Goal = {
    id: string;
    title: string;
    description: string;
    budget: number;
    spent: number;
    progress: number;
    status: GoalStatus;
    subGoals: SubGoal[];
};

export type DonationType = "cash" | "goods" | "service";

export type Donation = {
    id: string;
    donorName?: string;
    type: DonationType;
    amount?: number;
    description: string;
    date: string;
};

export type ProgramStatus = "upcoming" | "active" | "completed";

export type Program = {
    id: string;
    title: string;
    description: string;
    date: string;
    time?: string;
    location?: string;
    status: ProgramStatus;
};