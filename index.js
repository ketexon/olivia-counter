const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJvbm1pbGphdG1haGZodXd1a2N5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDkyODQ3MjIsImV4cCI6MjA2NDg2MDcyMn0.ZsOaZkhLOGZQPiDQ8GKPfGUZhZE1KlYrmeoivARuf1M";
const supabaseProject = "ronmiljatmahfhuwukcy";

const supabasePrefix = `https://${supabaseProject}.supabase.co/rest/v1/`;

const table = "badass_count";

/**
 * @param {string} route
 * @param {RequestInit} init
 * @returns {Promise<Response>}
 */
async function callApi(route, init) {
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

/**
 * @param {string} name
 * @returns {Promise<number>}
 */
async function getCount(name) {
	return await callApi(`${table}?name=eq.${name}`, {
		method: "GET",
	})
		.then(res => res.json())
		.then(data => data[0]?.count);
}

/**
 * @param {string} name
 * @returns
 */
async function incrementCount(name) {
	return await callApi(`rpc/increment_counter`, {
		method: "POST",
		body: JSON.stringify({
			name,
		}),
	});
}

/** @type {Map<string, number>} */
const counts = new Map();

document.querySelectorAll(".counter")
	.forEach(
		/**
		* @param {HTMLElement} counter
		*/
		async (counter) => {
			const counterName = counter.dataset.counter;
			if (!counterName) {
				console.warn("Counter name not specified in data-counter attribute.");
				return;
			}
			const count = await getCount(counterName);
			counts.set(counterName, count);
			counter.textContent = count !== undefined ? count : "0";
		}
	);

document.querySelectorAll(".increment")
	.forEach(
		/**
		* @param {HTMLElement} button
		*/
		async (button) => {
			const counterName = button.dataset.counter;
			if (!counterName) {
				console.warn("Counter name not specified in data-counter attribute.");
				return;
			}
			button.addEventListener("click", async () => {
				const counter = document.querySelector(`.counter[data-counter="${counterName}"]`);
				const count = counts.get(counterName) + 1;
				counts.set(counterName, count);
				counter.textContent = count;
				await incrementCount(counterName);
			});
		}
	);