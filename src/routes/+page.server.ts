import { db } from '$lib/server/db';
import { questions } from '$lib/server/db/schema';
import type { PageServerLoad } from './$types';

export const load = (async () => {
    const q = await db.select().from(questions).orderBy(questions.createdAt);
    return {
        questions: q
    }
}) satisfies PageServerLoad;