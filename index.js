import { getTodaysToneIndicator } from "./tone-indicators.js";

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
 * @returns {Promise<Map<string, number>>}>}
 */
async function getCounts() {
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
}

const cachedCountsKey = "cached_counts";
const cachedCountsString = localStorage.getItem(cachedCountsKey);
/** @type {Map<string, number>} */
let cachedCounts = null;
if (cachedCountsString) {
	const cachedData = JSON.parse(cachedCountsString);
	cachedCounts = new Map(Object.entries(cachedData));
}

/** @type {Promise<Map<string, number>>} */
const countsPromise = getCounts();

/**
 * @param {Map<string, number>} counts
 */
function cacheCounts(counts) {
	localStorage.setItem(cachedCountsKey, JSON.stringify(Object.fromEntries(counts.entries())));
}

/**
 * @param {string} name
 */
async function incrementCount(name) {
	await callApi(`rpc/increment_counter`, {
		method: "POST",
		body: JSON.stringify({
			name,
		}),
	});
}

document.querySelectorAll(".counter")
	.forEach(
		/**
		* @param {HTMLElement} counter
		*/
		async (counter) => {
			const counterName = counter.dataset.counterName;
			if (!counterName) {
				console.warn("Counter name not specified attribute.");
				return;
			}

			/** @type {HTMLElement} */
			const text = counter.querySelector(".counter__text");
			// populate counts from cache if available
			if (cachedCounts) {
				const count = cachedCounts.get(counterName);
				if (count !== undefined) {
					text.textContent = count;
				}
			}

			// populate initial count
			const counts = await countsPromise;
			const count = counts.get(counterName);
			text.textContent = count !== undefined ? count : "0";

			// update count on click
			/** @type {HTMLButtonElement} */
			const incrementButton = counter.querySelector(".counter__increment-button");
			incrementButton.addEventListener("click", async (ev) => {
				const newCount = counts.get(counterName) + 1;
				counts.set(counterName, newCount);
				text.textContent = newCount;
				spawnEmoji(counterName, ev);
				await incrementCount(counterName);
				cacheCounts(counts);
			});
		}
	);

const emojiMap = Object.freeze({
	"badass": [
		"\u{1F525}", // fire
		"\u{1F528}", // hammer
		"\u{1F60E}", // sunglasses
		"\u{1F4AA}", // flexed biceps
		"\u{1F4AF}", // hundred points
	],
	"bust": [
		"\u{1F633}", // flushed face
		"\u{1F4A6}", // sweat droplets
		"\u{1F608}", // smiling face with horns
		"\u{1F62B}", // tired face
		"\u{1F60F}", // smirking face
		"\u{1F63C}", // grinning cat with smiling eyes
	],
});

const emojiContainer = document.querySelector(".emoji-container");
/** @type {HTMLTemplateElement} */
const emojiTemplate = document.querySelector(".emoji-template");
const emojiRandomOffset = 25;

/**
 * @param {keyof typeof emojiMap} type
 * @param {MouseEvent} ev
 */
function spawnEmoji(type, ev) {
	const emojis = emojiMap[type] || ["\u2764"]; // default to heart emoji if not found
	const emojiFragment = emojiTemplate.content.cloneNode(true);
	/** @type {HTMLSpanElement} */
	const emoji = emojiFragment.querySelector(".emoji");
	emoji.textContent = emojis[Math.floor(Math.random() * emojis.length)];

	const left = ev.clientX + (Math.random() - 0.5) * emojiRandomOffset;
	const top = ev.clientY + (Math.random() - 0.5) * emojiRandomOffset;
	emoji.style.setProperty("--left", `${left}px`);
	emoji.style.setProperty("--top", `${top}px`);
	emojiContainer.appendChild(emojiFragment);

	emoji.addEventListener("animationend", () => {
		emoji.remove();
	});
}

const toneIndicator = getTodaysToneIndicator();

document.querySelector(".tone-indicator__name").textContent = `${toneIndicator.indicator} ${toneIndicator.emoji}`;

document.querySelector(".tone-indicator__description").textContent = toneIndicator.description;