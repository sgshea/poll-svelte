export interface Question {
    id: number;
    question: string;
    createdAt: Date;
    choices: Choice[];
}

export interface Choice {
    id: number;
    choice: string;
    questionId: string;
    votes?: Vote[];
}

export interface Vote {
    id: number;
    choiceId: string;
    createdAt: Date;
}