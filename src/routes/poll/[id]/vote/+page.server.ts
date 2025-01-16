import type { PageServerLoad, Actions } from './$types';
import { db } from '$lib/server/db';
import { pollVoteSchema } from '$lib/form-schema';
import { fail, redirect } from "@sveltejs/kit";
import { superValidate } from "sveltekit-superforms";
import { zod } from "sveltekit-superforms/adapters";
import { votes } from '$lib/server/db/schema';
import { and } from 'drizzle-orm';

// Checks to see if current user has voted in the current question
async function checkUserVotes(question_id: number, userId: string | undefined, ip: string) {
    // If the user is not logged in we will use the user's address as a unique identifier
    if (!userId) {
        // Check if the user has already voted
        const question = await db.query.questions.findFirst({
            // Get this question
            where: (questions, { eq }) => eq(questions.id, question_id),
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
            return true;
        }
    } else {
        // Check if the user has already voted for this question
        const question = await db.query.questions.findFirst({
            // Get this question
            where: (questions, { eq }) => eq(questions.id, question_id),
            // Get this question's choices
            with: {
                choices: {
                    // Get this choice's votes
                    with: {
                        votes: {
                            // Get the user's vote
                            where: (votes, { eq }) => eq(votes.userId, userId)
                        }
                    }
                }
            }
        });

        if (question?.choices.some(c => c.votes.length > 0)) {
            return true;
        }
    }
    return false;
}

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

        const hasVoted = await checkUserVotes(+question_id, event.locals.user?.id, event.getClientAddress());
        if (!hasVoted) {
            // Insert vote into db
            if (event.locals.user) {
                // Using user id
                await db.insert(votes).values({
                    choiceId: choice_id.id,
                    userId: event.locals.user.id
                });
            } else {
                // Using ip
                await db.insert(votes).values({
                    choiceId: choice_id.id,
                    anonymousIdentifier: event.getClientAddress()
                });
            }
            // Redirect to poll page
            redirect(303, `/poll/${question_id}`);
        }

        return {
            form
        }
    },
};

// Load a single poll from the database based on the route's parameter id
export const load = (async ({ params, locals, getClientAddress }) => {
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

    // Check if the user has voted on this question before
    const hasVoted = await checkUserVotes(+params.id, locals.user?.id, getClientAddress.call({}));
    if (hasVoted) {
        // Redirect to the poll page with a 303 status code
        redirect(303, `/poll/${id}`);
    }

    return {
        question: q,
        hasVoted,
        formSchema: await superValidate(zod(pollVoteSchema)),
    };
}) satisfies PageServerLoad;