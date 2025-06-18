import { sendMessage } from "./notifications.js";

import { callApi, table } from "./api.js";

const cachedCountsKey = "cached_counts";
const cachedCountsString = localStorage.getItem(cachedCountsKey);
/** @type {Map<string, number>} */
let cachedCounts = null;
if (cachedCountsString) {
	const cachedData = JSON.parse(cachedCountsString);
	cachedCounts = new Map(Object.entries(cachedData));
}

export { cachedCounts };

/** @type {Promise<Map<string, number>>} */
const countsPromise = (async function() {
	return await callApi(`${table}`, {
		method: "GET",
	})
		.then(res => /** @type {Promise<{ count: number, name: string }[]>} */ (res.json()))
		.then(data => {
			return new Map(data.map(({ count, name }) => {
				return [name, count];
			}));
		})
		.then(counts => {
			cacheCounts(counts);
			return counts;
		})
})()

export function getCounts() {
	return countsPromise;
}

/**
 * @param {Map<string, number>} counts
 */
function cacheCounts(counts) {
	localStorage.setItem(cachedCountsKey, JSON.stringify(Object.fromEntries(counts.entries())));
}

/**
 * @param {string} name
 */
export async function incrementCount(name) {
	await callApi(`rpc/increment_counter`, {
		method: "POST",
		body: JSON.stringify({
			name,
		}),
	});
	const counts = await getCounts();
	cacheCounts(counts);
	sendMessage({
		type: "countsChanged",
		counts,
	});
}