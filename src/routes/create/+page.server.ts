import type { PageServerLoad, Actions } from "./$types";
import { fail } from "@sveltejs/kit";
import { superValidate } from "sveltekit-superforms";
import { pollQuestionSchema } from "$lib/form-schema";
import { zod } from "sveltekit-superforms/adapters";
import { db } from '$lib/server/db';
import { questions, choices } from '$lib/server/db/schema';

export const load: PageServerLoad = async () => {
    return {
        form: await superValidate(zod(pollQuestionSchema)),
    };
};

export const actions: Actions = {
    default: async (event) => {
        const form = await superValidate(event, zod(pollQuestionSchema));
        if (!form.valid) {
            return fail(400, {
                form,
            });
        }

        // Insert the form data into the database
        const question_id = await db.insert(questions).values(form.data).returning({ id: questions.id });
        for (const choice of form.data.options) {
            await db.insert(choices).values({
                questionId: question_id[0].id,
                choice,
            });
        };

        return {
            form,
        };
    },
};