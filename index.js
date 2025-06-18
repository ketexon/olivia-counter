import { cachedCounts, getCounts, incrementCount } from "./counts.js";
import { spawnEmoji } from "./emoji.js";
import { getTodaysToneIndicator } from "./tone-indicators.js";
import "./notifications.js";

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
			const counts = await getCounts();
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
			});
		}
	);

const toneIndicator = getTodaysToneIndicator();
document.querySelector(".tone-indicator__name").textContent = `${toneIndicator.indicator} ${toneIndicator.emoji}`;
document.querySelector(".tone-indicator__description").textContent = toneIndicator.description;