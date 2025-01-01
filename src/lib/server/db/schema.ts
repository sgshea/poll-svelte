import { relations, sql } from 'drizzle-orm';
import { index, integer, sqliteTable, text, uniqueIndex } from 'drizzle-orm/sqlite-core';

export const questions = sqliteTable(
	'questions',
	{
		id: integer('id', { mode: 'number' }).primaryKey({ autoIncrement: true }),
		question: text('question').notNull(),
		createdAt: text('createdAt')
			.notNull()
			.default(sql`(current_timestamp)`),
	},
	(questions) => ({
		questionIdx: uniqueIndex('question_idx').on(questions.question),
	})
);

export const questionRelations = relations(questions, ({ many }) => ({
	choices: many(choices)
}));

export const choices = sqliteTable(
	'choices',
	{
		id: integer('id', { mode: 'number' }).primaryKey({ autoIncrement: true }),
		choice: text('choice').notNull(),
		questionId: text('question_id')
			.notNull()
			.references(() => questions.id)
	},
	(choices) => ({
		choiceQuestionIdIdx: index('choice_questionid_idx').on(
			choices.choice,
			choices.questionId
		)
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
		choiceId: text('choice_id')
			.notNull()
			.references(() => choices.id),
		createdAt: text('createdAt')
			.notNull()
			.default(sql`(current_timestamp)`),
	},
	(votes) => ({
		choiceIdx: index('vote_choice_idx').on(votes.choiceId),
	})
);

export const votesRelations = relations(votes, ({ one }) => ({
	choice: one(choices, {
		fields: [votes.choiceId],
		references: [choices.id]
	})
}));