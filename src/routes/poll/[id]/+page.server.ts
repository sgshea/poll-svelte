import type { PageServerLoad, Actions } from './$types';
import { db } from '$lib/server/db';
import { pollVoteSchema } from '$lib/form-schema';
import { fail } from "@sveltejs/kit";
import { superValidate } from "sveltekit-superforms";
import { zod } from "sveltekit-superforms/adapters";
import { votes } from '$lib/server/db/schema';
import { and } from 'drizzle-orm/sqlite-core/expressions';
import { getAnonymousIdentifier } from '$lib/server/auth';

export const actions: Actions = {
    default: async (event) => {
        const form = await superValidate(event, zod(pollVoteSchema));
        if (!form.valid) {
            return fail(400, {
                form,
            });
        }

        const question_id = event.params.id;
        if (question_id === undefined) {
            return fail(400, { ok: false, message: "No Poll id provided" });
        }

        const choice = form.data.choice;

        // Find id of the choice based on choice name and question id matching
        const choice_id = await db.query.choices.findFirst({
            where: (choices, { eq }) => and(eq(choices.choice, choice), (eq(choices.questionId, +question_id)))
        });

        if (!choice_id) {
            return fail(404, { ok: false, message: "Choice not found" });
        }

        // If the user is not logged in we will use the user's address as a unique identifier
        if (!event.locals.user) {
            const ip = getAnonymousIdentifier(event);
            // Check if the user has already voted
            const question = await db.query.questions.findFirst({
                // Get this question
                where: (questions, { eq }) => eq(questions.id, +question_id),
                // Get this question's choices
                with: {
                    choices: {
                        // Get this choice's votes
                        with: {
                            votes: {
                                // Get the user's vote
                                where: (votes, { eq }) => eq(votes.anonymousIdentifier, ip)
                            }
                        }
                    }
                }
            });

            if (question?.choices.some(c => c.votes.length > 0)) {
                return fail(409, { ok: false, message: "You have already voted on this poll" });
            }

            // Insert using ip address
            await db.insert(votes).values({
                choiceId: choice_id.id,
                anonymousIdentifier: ip
            });
        } else {
            // Check if the user has already voted for this question
            const question = await db.query.questions.findFirst({
                // Get this question
                where: (questions, { eq }) => eq(questions.id, +question_id),
                // Get this question's choices
                with: {
                    choices: {
                        // Get this choice's votes
                        with: {
                            votes: {
                                // Get the user's vote
                                where: (votes, { eq }) => eq(votes.userId, event.locals.user!.id)
                            }
                        }
                    }
                }
            });

            if (question?.choices.some(c => c.votes.length > 0)) {
                return fail(409, { ok: false, message: "You have already voted on this poll" });
            }

            // Insert using user id
            await db.insert(votes).values({
                choiceId: choice_id.id,
                userId: event.locals.user!.id
            });
        }

        return {
            form
        }
    },
};

// Load a single poll from the database based on the route's parameter id
export const load = (async ({ params }) => {
    const { id }: { id?: string } = params;

    if (id === undefined) {
        return fail(400, { ok: false, message: "No Poll id provided" });
    }

    const q = await db.query.questions.findFirst({
        where: (questions, { eq }) => eq(questions.id, +id),
        with: {
            choices: {
                with: {
                    votes: true,
                }
            }
        }
    });

    if (!q) {
        return fail(404, { ok: false, message: "Poll not found" });
    }

    return {
        question: q,
        formSchema: await superValidate(zod(pollVoteSchema)),
    };
}) satisfies PageServerLoad;