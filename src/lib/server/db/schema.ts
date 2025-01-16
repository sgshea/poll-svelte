import { relations, sql } from 'drizzle-orm';
import { index, integer, pgTable, serial, text, timestamp, uniqueIndex } from 'drizzle-orm/pg-core';

//
// POLLING
//

export const questions = pgTable(
	'questions',
	{
		id: serial('id').primaryKey(),
		// Question text
		question: text('question').notNull(),
		// Id of user which created this question (must have a creator)
		creatorId: text('creator_id').notNull(),
		// Timestamp of creation
		createdAt: text('created_at')
			.notNull()
			.default(sql`(current_timestamp)`),
	},
	(questions) => ({
		questionIdx: uniqueIndex('question_idx').on(questions.question)
	})
);

export const questionRelations = relations(questions, ({ many, one }) => ({
	choices: many(choices),
	creator: one(user, {
		fields: [questions.creatorId],
		references: [user.id]
	})
}));

export const choices = pgTable(
	'choices',
	{
		id: serial('id').primaryKey(),
		choice: text('choice').notNull(),
		questionId: integer('question_id')
			.notNull()
			.references(() => questions.id)
	},
	(choices) => ({
		choiceQuestionIdIdx: index('choice_questionid_idx').on(choices.choice, choices.questionId)
	})
);

export const choicesRelations = relations(choices, ({ one, many }) => ({
	question: one(questions, {
		fields: [choices.questionId],
		references: [questions.id]
	}),
	votes: many(votes)
}));

export const votes = pgTable(
	'votes',
	{
		id: serial('id').primaryKey(),
		choiceId: integer('choice_id')
			.notNull()
			.references(() => choices.id),
		userId: text('user_id').references(() => user.id),  // Nullable to support anonymous votes
		anonymousIdentifier: text('anonymous_identifier'), // Identifier for anonymous users
		createdAt: text('createdAt')
			.notNull()
			.default(sql`(current_timestamp)`)
	},
	(votes) => ({
		choiceIdx: index('vote_choice_idx').on(votes.choiceId),
		userOrAnonymousIdx: index('user_or_anonymous_idx').on(
			votes.userId,
			votes.anonymousIdentifier
		)
	})
);

export const votesRelations = relations(votes, ({ one }) => ({
	choice: one(choices, {
		fields: [votes.choiceId],
		references: [choices.id]
	}),
	user: one(user, {
		fields: [votes.userId],
		references: [user.id]
	})
}));

//
// AUTHENTICATION
//

export const user = pgTable('user', {
	id: text('id').primaryKey(),
	username: text('username').notNull().unique(),
	passwordHash: text('password_hash').notNull()
});

export const session = pgTable('session', {
	id: text('id').primaryKey(),
	userId: text('user_id')
		.notNull()
		.references(() => user.id),
	expiresAt: timestamp('expires_at').notNull(),
});

export type Session = typeof session.$inferSelect;

export type User = typeof user.$inferSelect;
