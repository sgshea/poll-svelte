import type { PageServerLoad, Actions } from './$types';
import { db } from '$lib/server/db';
import { pollVoteSchema } from '$lib/form-schema';
import { fail } from "@sveltejs/kit";
import { superValidate } from "sveltekit-superforms";
import { zod } from "sveltekit-superforms/adapters";
import { votes } from '$lib/server/db/schema';

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
            return { ok: false, message: "No Poll id provided" };
        }

        const choice = form.data.choice;

        // Find id of the choice based on choice name and question id matching
        const choice_id = await db.query.choices.findFirst({
            where: (choices, { eq }) => eq(choices.choice, choice) && (eq(choices.questionId, +question_id))
        });

        if (!choice_id) {
            return { ok: false, message: "Choice not found" };
        }

        // Insert the vote into the database
        await db.insert(votes).values({
            choiceId: choice_id.id,
        });

        return {
            ok: true,
            message: "Vote added successfully",
        }
    },
};

// Load a single poll from the database based on the route's parameter id
export const load = (async ({ params }) => {
    const { id }: { id?: string } = params;

    if (id === undefined) {
        return { ok: false, message: "No Poll id provided" };
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
        return { ok: false, message: "Poll not found" };
    }

    return {
        question: q,
        formSchema: await superValidate(zod(pollVoteSchema)),
    };
}) satisfies PageServerLoad;