import { db } from '$lib/server/db';
import { questions, choices, votes } from '$lib/server/db/schema';
import type { PageServerLoad } from './$types';

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
        questions: q
    }
}) satisfies PageServerLoad;