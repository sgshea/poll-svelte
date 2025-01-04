import { z } from "zod";

export const pollQuestionSchema = z.object({
    question: z.string()
        .min(3, "Question must be at least 3 characters")
        .max(50, "Question must be less than 50 characters"),
    options: z.array(
        z.string()
            .min(1, "Option cannot be empty")
            .max(100, "Option must be less than 100 characters")
    )
        .min(2, "Poll must have at least 2 options")
        .max(10, "Poll cannot have more than 10 options"),
});

export type PollQuestionSchema = typeof pollQuestionSchema;

export const pollVoteSchema = z.object({
    choice:
        z.string()
            .min(1, "Option cannot be empty")
            .max(100, "Option must be less than 100 characters")
});

export type PollVoteSchema = typeof pollVoteSchema;