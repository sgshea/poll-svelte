import type { PageServerLoad, Actions } from "./$types.js";
import { fail } from "@sveltejs/kit";
import { superValidate } from "sveltekit-superforms";
import { pollQuestionSchema } from "$lib/form-schema.js";
import { zod } from "sveltekit-superforms/adapters";

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
        console.log(form);
        return {
            form,
        };
    },
};