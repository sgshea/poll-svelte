import type { PageServerLoad, Actions } from "./$types.js";
import { fail } from "@sveltejs/kit";
import { superValidate } from "sveltekit-superforms";
import { pollQuestionSchema } from "$lib/form-schema.js";
import { zod } from "sveltekit-superforms/adapters";
import { db } from '$lib/server/db';
import { questions } from '$lib/server/db/schema.js';

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
        await db.insert(questions).values(form.data);

        return {
            form,
        };
    },
};