import type { LayoutServerLoad } from './$types';

// Simply exists to allow the layout access to user, if it exists
export const load: LayoutServerLoad = async (event) => {
	return {
        user: event.locals.user,
    };
};