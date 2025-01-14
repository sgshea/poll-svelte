import * as auth from '$lib/server/auth';
import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { db } from '$lib/server/db';
import { choices, questions, votes } from '$lib/server/db/schema';
import { eq, sql } from 'drizzle-orm';
import { filterUserChoices, getUserChoices } from '$lib/db-query';

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
	}).then((questions) => getUserChoices(questions, event.locals.user!.id));

	// Getting the poll questions that this user voted on
	const votedQuestions = await db.query.questions.findMany({
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
	}).then((questions) => {
		return getUserChoices(filterUserChoices(questions, event.locals.user!.id), event.locals.user!.id);
	});

	return {
		createdQuestions,
		votedQuestions,
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