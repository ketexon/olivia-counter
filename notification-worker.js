/**
 * @typedef {import("./types").NotificationMessage} NotificationMessage
 */

const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJvbm1pbGphdG1haGZodXd1a2N5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDkyODQ3MjIsImV4cCI6MjA2NDg2MDcyMn0.ZsOaZkhLOGZQPiDQ8GKPfGUZhZE1KlYrmeoivARuf1M";
const supabaseProject = "ronmiljatmahfhuwukcy";
const supabasePrefix = `https://${supabaseProject}.supabase.co/rest/v1/`;
const table = "badass_count";

importScripts("/tone-indicators-commonjs.js");

/**
 * @param {string} route
 * @param {RequestInit} init
 * @returns {Promise<Map<string, number>>}
 */
async function getCounts() {
	return await fetch(`${supabasePrefix}${table}`, {
		method: "GET",
		headers: {
			"Content-Type": "application/json",
			"ApiKey": `${supabaseAnonKey}`,
		},
	})
		.then(response => {
			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`);
			}
			return response;
		})
		.then(res => /** @type {Promise<{ count: number, name: string }[]>} */(res.json()))
		.then(data => {
			return new Map(data.map(({ count, name }) => {
				return [name, count];
			}));
		})
		.catch(error => {
			console.error("Error fetching data:", error);
		});;
}

/** @type {ServiceWorkerRegistration} */
const registration = self.registration;
let notificationsEnabled = false;

const pollInterval = 5 * 1000; // 1 minute

/**
 * @param {string} message
 * @param {string | null} title
 */
async function notify(message, title = null) {
	if (!notificationsEnabled) {
		return;
	}

	await registration.showNotification(
		title ?? "Olivia Counter!!!",
		{
			body: message,
			icon: "/icon.png",
		}
	);
}

/** @type {number | null} */
let pollIntervalId = null;

/**
 * @type {Map<string, number>}
 */
let lastCounts = null;

const countMessages = {
	"bust": "Somebody busted \u{1F62B}",
	"badass": "Olivia did something badass \u{1F4AA}",
}

async function checkCountChanged() {
	console.log("Checking for count changes...");
	const counts = await getCounts();
	console.log("Updating counts from", lastCounts, " to ", counts);
	const changedKeys = new Set();
	if (lastCounts) {
		for (const [key, value] of counts.entries()) {
			if (lastCounts.has(key) && lastCounts.get(key) !== value) {
				changedKeys.add(key);
			}
		}
	}
	lastCounts = counts;

	for (const key of changedKeys.values()) {
		let message = countMessages[key]
			? `${countMessages[key]} (count: ${counts.get(key)})`
			: `Counts changed for ${key}: ${counts.get(key)}`;

		notify(message);
	}
}

function onNotificationsEnabled() {
	notificationsEnabled = true;
	console.log("Notifications enabled");
	notify("Notifications have been enabled.");

	if (pollIntervalId) {
		clearInterval(pollIntervalId);
	}
	pollIntervalId = setInterval(async () => {
		await checkCountChanged();
	}, pollInterval);
}

function onNotificationsDisabled() {
	notificationsEnabled = false;
	console.log("Notifications disabled");

	if (pollIntervalId) {
		clearInterval(pollIntervalId);
		pollIntervalId = null;
	}
}

self.addEventListener("message",
	/**
	 * @param {MessageEvent<NotificationMessage>} event
	 */
	(event) => {
		console.log("Message received from client:", event.data);
		if (event.data.type === "notificationsEnabled") {
			if (notificationsEnabled) {
				return;
			}
			onNotificationsEnabled();
		} else if (event.data.type === "notificationsDisabled") {
			if (!notificationsEnabled) {
				return;
			}
			onNotificationsDisabled();
		} else if (event.data.type === "countsChanged") {
			lastCounts = event.data.counts;
		}
	});

const newToneIndicatorTag = "new-tone-indicator";

function notifyNewToneIndicator() {
	const todaysToneIndicator = getTodaysToneIndicator();
	return notify(todaysToneIndicator.description, `Today's tone indicator: ${todaysToneIndicator.indicator} ${todaysToneIndicator.emoji}`);
}

self.addEventListener("periodicsync",
	/**
	 * @param {ExtendableEvent} event
	 */
	(event) => {
		if (event.tag === newToneIndicatorTag) {
			event.waitUntil(notifyNewToneIndicator());
		}
	}
)