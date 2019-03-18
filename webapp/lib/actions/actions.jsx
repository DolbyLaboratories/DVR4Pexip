export const PAGE_TWO_ACTION = 'PAGE_TWO_ACTION';
export const PAGE_ONE_ACTION = 'PAGE_ONE_ACTION';


export function login() {
	return {
		type: PAGE_ONE_ACTION,
		payload: 'this is page one action'
	}
}
export function register() {
	return {
		type: PAGE_TWO_ACTION,
		payload: 'this is page two action'
	}
}
