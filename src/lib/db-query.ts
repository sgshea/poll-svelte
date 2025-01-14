// Utility functions to run database queries

import type { Question } from "./types";

// Adds the choice the user voted on to a questions query
export function getUserChoices(questions: Question[], userId: string | undefined) {
    return questions.map((question) => {
        const userChoice = question.choices.filter((choice) => {
            return choice.votes.some((vote) => vote.userId === userId);
        })[0] || null;

        // Return a new object that includes both the question and the choices the user voted on
        return {
            question: { ...question },
            userChoice,
        };
    });
};

// Single question variant of getUserChoices which also works on ip address based votes
export function getUserChoice(question: Question, userId: string | undefined, anonymousIdentifier: string) {
    return {
        question: { ...question },
        userChoice: question.choices.filter((choice) => {
            if (anonymousIdentifier && !userId) {
                return choice.votes.some((vote) => vote.anonymousIdentifier === anonymousIdentifier);
            } else {
                return choice.votes.some((vote) => vote.userId === userId);
            }
        })[0] || null,
    }
}

// Filters for only questions the user voted on and adds the choice to each
export function filterUserChoices(questions: Question[], userId: string) {
    // Filtering the questions to only include the ones that the user voted on
    return questions.filter((question) => {
        return question.choices.some((choice) => {
            return choice.votes.some((vote) => vote.userId === userId);
        });
    });
};