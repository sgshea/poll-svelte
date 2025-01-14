import type { PageServerLoad, Actions } from './$types';
import { db } from '$lib/server/db';
import { fail } from "@sveltejs/kit";
import { getUserChoice } from '$lib/db-query';

// Load a single poll from the database based on the route's parameter id
export const load = (async ({ params, locals, getClientAddress }) => {
    const { id }: { id?: string } = params;

    if (id === undefined) {
        return fail(400, { ok: false, message: "No Poll id provided" });
    }

    const result = await db.query.questions.findFirst({
        where: (questions, { eq }) => eq(questions.id, +id),
        with: {
            choices: {
                with: {
                    votes: true,
                }
            }
        }
    }).then((question) => getUserChoice(question!, locals.user?.id, getClientAddress()));

    if (!result) {
        return fail(404, { ok: false, message: "Poll not found" });
    }

    return result;
}) satisfies PageServerLoad;