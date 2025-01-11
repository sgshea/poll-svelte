import * as auth from '$lib/server/auth';
import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { db } from '$lib/server/db';

export const load: PageServerLoad = async (event) => {
	if (!event.locals.user) {
		return redirect(302, '/user/login');
	}

	// Getting the poll questions that this user created
	const createdQuestions = await db.query.questions.findMany({
		where: (questions, { eq }) => eq(questions.creatorId, event.locals.user?.id),
		with: {
			choices: {
				with: {
					votes: true
				}
			},
		},
		columns: {
			id: true,
			question: true,
			createdAt: true,
		},
	});

	return {
		createdQuestions,
		user: event.locals.user
	};
};

export const actions: Actions = {
	logout: async (event) => {
		if (!event.locals.session) {
			return fail(401);
		}
		await auth.invalidateSession(event.locals.session.id);
		auth.deleteSessionTokenCookie(event);

		return redirect(302, '/');
	}
};