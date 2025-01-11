import type { PageServerLoad, Actions } from "./$types";
import { fail, redirect } from "@sveltejs/kit";
import { superValidate } from "sveltekit-superforms";
import { pollQuestionSchema } from "$lib/form-schema";
import { zod } from "sveltekit-superforms/adapters";
import { db } from '$lib/server/db';
import { questions, choices } from '$lib/server/db/schema';

export const load: PageServerLoad = async (event) => {
    // User must be logged in to create a poll
    if (!event.locals.user) {
        return redirect(302, '/user/login');
    }

    return {
        form: await superValidate(zod(pollQuestionSchema)),
    };
};

export const actions: Actions = {
    default: async (event) => {
        // Make sure user is logged in
		if (!event.locals.session) {
			return fail(401);
		}

        const form = await superValidate(event, zod(pollQuestionSchema));
        if (!form.valid) {
            return fail(400, {
                form,
            });
        }

        // Add user id to the form data
        const creatorId = event.locals.user?.id!;
        const formData = { ...form.data, creatorId };

        // Insert the form data into the database
        const question_id = await db.insert(questions).values(formData).returning({ id: questions.id });
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