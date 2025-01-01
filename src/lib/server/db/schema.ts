import { relations } from 'drizzle-orm';
import { index, integer, sqliteTable, text, uniqueIndex } from 'drizzle-orm/sqlite-core';

export const questions = sqliteTable(
	'questions',
	{
		id: text('id').primaryKey(),
		question: text('question').notNull(),
		createdAt: integer('created_at', { mode: "timestamp" })
			.notNull()
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
		id: text('id').primaryKey(),
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
		id: text('id').primaryKey(),
		choiceId: text('choice_id')
			.notNull()
			.references(() => choices.id),
		createdAt: integer('created_at', { mode: "timestamp" })
			.notNull()
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