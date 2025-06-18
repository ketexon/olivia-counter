/**
 * @typedef {import("./types.js").NotificationMessage} NotificationMessage
 */

const notificationsEnabledKey = "notificationsEnabled";
let notificationsEnabled = Notification.permission === "granted" && localStorage.getItem(notificationsEnabledKey) === "true";

let registrationPromise = navigator.serviceWorker.register("/notification-worker.js");

/**
 *
 * @param {NotificationMessage} message
 */
export async function sendMessage(message) {
	const registration = await registrationPromise;
	await navigator.serviceWorker.ready;
	registration.active.postMessage(message);
	console.log("Message sent to service worker:", message);
}

const toneIndicatorInterval = 5 * 1000;

/** @type {HTMLButtonElement} */
const notificationButton = document.querySelector(".header__notification-button");
async function updateNotificationStatus() {
	const registration = await registrationPromise;
	if (notificationsEnabled) {
		notificationButton.innerText = "notifications_active";
		notificationButton.classList.add("header__notification-button--active");
		await sendMessage({
			type: "notificationsEnabled"
		});

		if ("periodicSync" in registration) {
			console.log("Registering periodic sync");
			registration.periodicSync.register("new-tone-indicator", {
				minInterval: toneIndicatorInterval,
			}).then(() => {
				console.log("Periodic sync registered");
			}).catch((error) => {
				console.log("Could not register periodic sync:", error);
			});
		}
	} else {
		notificationButton.innerText = "notifications_off";
		notificationButton.classList.remove("header__notification-button--active");
		await sendMessage({
			type: "notificationsDisabled"
		});
		if ("periodicSync" in registration) {
			registration.periodicSync.unregister("new-tone-indicator");
			console.log("Periodic sync unregistered");
		}
	}
}

export async function requestNotifications(){
	if (Notification.permission === "granted") {
		return;
	}
    const permission = await Notification.requestPermission();
    if(permission !== "granted"){
		throw new Error("Notifications permission not granted");
    }
}

if(Notification.permission === "granted"){
	updateNotificationStatus();
}
notificationButton.addEventListener("click", async () => {
	await requestNotifications();
	if (Notification.permission === "granted") {
		notificationsEnabled = !notificationsEnabled;
		localStorage.setItem(notificationsEnabledKey, notificationsEnabled);
		updateNotificationStatus();
	}
});