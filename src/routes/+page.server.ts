import type { PageServerLoad } from './$types';
import { db } from '$lib/server/db';

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