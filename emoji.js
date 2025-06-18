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
export function spawnEmoji(type, ev) {
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
