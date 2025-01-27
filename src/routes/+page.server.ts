import type { PageServerLoad, Actions } from './$types';
import { db } from '$lib/server/db';
import { pollVoteSchema } from '$lib/form-schema';
import { superValidate } from "sveltekit-superforms";
import { zod } from "sveltekit-superforms/adapters";
import { getUserChoices } from '$lib/db-query';

export const load: PageServerLoad = (async (event) => {
    const q = await db.query.questions.findMany({
        with: {
            choices: {
                with: {
                    votes: true
                }
            },
            // Making sure to remove password hash from the user
            creator: {
                columns: {
                    id: true,
                    username: true
                }
            }
        },
        columns: {
            id: true,
            question: true,
            createdAt: true,
        },
    }).then((questions) => getUserChoices(questions, event.locals.user?.id));

    return {
        questions: q,
        form: await superValidate(zod(pollVoteSchema)),
    }
});