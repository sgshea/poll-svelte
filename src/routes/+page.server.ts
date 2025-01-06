import type { PageServerLoad, Actions } from './$types';
import { db } from '$lib/server/db';
import { pollVoteSchema } from '$lib/form-schema';
import { superValidate } from "sveltekit-superforms";
import { zod } from "sveltekit-superforms/adapters";

export const load = (async () => {
    const q = await db.query.questions.findMany({
        with: {
            choices: {
                with: {
                    votes: true
                }
            }
        }
    });
    return {
        questions: q,
        form: await superValidate(zod(pollVoteSchema)),
    }
}) satisfies PageServerLoad;