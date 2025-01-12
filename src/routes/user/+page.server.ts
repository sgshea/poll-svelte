import * as auth from '$lib/server/auth';
import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { db } from '$lib/server/db';
import { choices, questions, votes } from '$lib/server/db/schema';
import { eq, sql } from 'drizzle-orm';

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
		// Filtering the questions to only include the ones that the user voted on
		return questions.filter((question) => {
			return question.choices.some((choice) => {
				return choice.votes.some((vote) => vote.userId === event.locals.user?.id);
			});
		}).map((question) => {
			const votedChoice = question.choices.filter((choice) => {
				return choice.votes.some((vote) => vote.userId === event.locals.user?.id);
			})[0];

			// Return a new object that includes both the question and the choices the user voted on
			return {
				...question,
				votedChoice
			};
		});
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