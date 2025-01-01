export interface Question {
    id: string;
    question: string;
    createdAt: number;
    choices: Choice[];
}

export interface Choice {
    id: string;
    choice: string;
    questionId: string;
    votes?: Vote[];
}

export interface Vote {
    id: string;
    choiceId: string;
    createdAt: number;
}