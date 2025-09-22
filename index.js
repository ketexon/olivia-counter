import { spawnEmoji } from "./emoji.js";
import { getTodaysToneIndicator } from "./tone-indicators.js";
import "./dates.js";

const toneIndicator = getTodaysToneIndicator();
document.querySelector(".tone-indicator__name").textContent = `${toneIndicator.indicator} ${toneIndicator.emoji}`;
document.querySelector(".tone-indicator__description").textContent = toneIndicator.description;