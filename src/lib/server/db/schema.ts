import { relations, sql } from 'drizzle-orm';
import { index, integer, sqliteTable, text, uniqueIndex } from 'drizzle-orm/sqlite-core';

//
// POLLING
//

export const questions = sqliteTable(
	'questions',
	{
		id: integer('id', { mode: 'number' }).primaryKey({ autoIncrement: true }),
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

export const choices = sqliteTable(
	'choices',
	{
		id: integer('id', { mode: 'number' }).primaryKey({ autoIncrement: true }),
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

export const votes = sqliteTable(
	'votes',
	{
		id: integer('id', { mode: 'number' }).primaryKey({ autoIncrement: true }),
		choiceId: integer('choice_id')
			.notNull()
			.references(() => choices.id),
		createdAt: text('createdAt')
			.notNull()
			.default(sql`(current_timestamp)`)
	},
	(votes) => ({
		choiceIdx: index('vote_choice_idx').on(votes.choiceId)
	})
);

export const votesRelations = relations(votes, ({ one }) => ({
	choice: one(choices, {
		fields: [votes.choiceId],
		references: [choices.id]
	})
}));

//
// AUTHENTICATION
//

export const user = sqliteTable('user', {
    id: text('id').primaryKey(),
	username: text('username').notNull().unique(),
	passwordHash: text('password_hash').notNull()
});

export const session = sqliteTable('session', {
    id: text('id').primaryKey(),
	userId: text('user_id')
		.notNull()
		.references(() => user.id),
	expiresAt: integer('expires_at', { mode: 'timestamp' }).notNull()
});

export type Session = typeof session.$inferSelect;

export type User = typeof user.$inferSelect;
