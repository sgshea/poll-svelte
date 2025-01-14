export interface Question {
    id: number;
    question: string;
    createdAt: string;
    choices: Choice[];
}

export interface Choice {
    id: number;
    choice: string;
    questionId: number;
    votes: Vote[];
}

export interface Vote {
    id: number;
    choiceId: number;
    createdAt: string;
    userId: string | null;
    anonymousIdentifier: string | null;
}