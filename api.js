import { table, supabaseAnonKey, supabasePrefix, supabaseProject } from "./db.js";
export { table };

/**
 * @param {string} route
 * @param {RequestInit} init
 * @returns {Promise<Response>}
 */
export async function callApi(route, init) {
	init ??= {};
	return await fetch(`${supabasePrefix}${route}`, {
		method: "GET",
		...init,
		headers: {
			"Content-Type": "application/json",
			"ApiKey": `${supabaseAnonKey}`,
			...init?.headers || {}
		},
	}).then(response => {
		if (!response.ok) {
			throw new Error(`HTTP error! status: ${response.status}`);
		}
		return response;
	}).catch(error => {
		console.error("Error fetching data:", error);
	});
}