import { z } from "zod";

export const pollQuestionSchema = z.object({
    question: z.string()
        .min(3, "Question must be at least 3 characters")
        .max(40, "Question must be less than 40 characters"),
    options: z.array(
        z.string()
            .min(1, "Option cannot be empty")
            .max(20, "Option must be less than 20 characters")
    )
        .min(2, "Poll must have at least 2 options")
        .max(10, "Poll cannot have more than 10 options"),
});

export type PollQuestionSchema = typeof pollQuestionSchema;

export const pollVoteSchema = z.object({
    choice:
        z.string()
            .min(1, "Option cannot be empty")
            .max(20, "Option must be less than 20 characters")
});

export type PollVoteSchema = typeof pollVoteSchema;

export const userSchema = z.object({
    username: z.string()
        .min(3, "Username must be at least 3 characters")
        .max(31, "Username must be less than 31 characters"),
    password: z.string()
        .min(6, "Password must be at least 6 characters")
        .max(255, "Password must be less than 255 characters"),
});

export type UserSchema = typeof userSchema;