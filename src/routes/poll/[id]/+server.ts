import { db } from '$lib/server/db';
import type { RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = async ({ params }) => {
    const { id }: { id?: string } = params;

    if (id === undefined) {
        const response = new Response(JSON.stringify({ error: 'No Poll id provided' }), { status: 400 });
        return response;
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
    });

    if (!result) {
        const response = new Response(JSON.stringify({ error: 'Poll not found' }), { status: 404 });
        return response;
    }

    const response = new Response(JSON.stringify(result), { status: 200 });
    return response;
};