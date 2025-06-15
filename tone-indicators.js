/**
 * @type {Array<{indicator: string, description: string, emoji: string}>}
 */
const toneIndicators = [
    {
        indicator: "/j",
        description: "joking",
        emoji: "\u{1F913}", // nerd face
    },
    {
        indicator: "/hj",
        description: "half-joking",
        emoji: "\u{1F609}", // winking face
    },
    {
        indicator: "/s",
        description: "sarcastic",
        emoji: "\u{1F63C}", // grinning cat with smiling eyes
    },
    {
        indicator: "/gen",
        description: "genuine",
        emoji: "\u{1F60A}", // smiling face with smiling eyes
    },
    {
        indicator: "/srs",
        description: "serious",
        emoji: "\u{1F926}", // woman standing emoji
    },
    {
        indicator: "/nsrs",
        description: "non-serious",
        emoji: "\u{1F61B}", // stuck-out tongue
    },
    {
        indicator: "/pos",
        description: "positive connotation",
        emoji: "\u{1F44D}", // thumbs up
    },
    {
        indicator: "/neu",
        description: "neutral connotation",
        emoji: "\u{1F610}", // neutral face
    },
    {
        indicator: "/neg",
        description: "negative connotation",
        emoji: "\u{1F44E}", // thumbs down
    },
    {
        indicator: "/p",
        description: "platonic",
        emoji: "\u{1F91D}", // handshake
    },
    {
        indicator: "/r",
        description: "romantic",
        emoji: "\u{1F63D}", // cat kissing
    },
    {
        indicator: "/c",
        description: "copypasta",
        emoji: "\u{1F35D}", // spaghetti
    },
    {
        indicator: "/l",
        description: "lyrics",
        emoji: "\u{1F3B5}", // musical note
    },
    {
        indicator: "/lh",
        description: "light-hearted",
        emoji: "\u{1F607}", // smiling face with halo
    },
	{
        indicator: "/hh",
        description: "heavy-hearted",
        emoji: "\u{1F614}", // pensive face
    },
    {
        indicator: "/nm",
        description: "not mad",
        emoji: "\u{1F615}", // confused face
    },
    {
        indicator: "/lu",
        description: "a little upset",
        emoji: "\u{1F61E}", // disappointed face
    },
    {
        indicator: "/nbh",
        description: "vagueposting or venting, but directed at nobody here (none of your followers)",
        emoji: "\u{1F4EE}", // postbox
    },
    {
        indicator: "/nsb",
        description: "not subtweeting",
        emoji: "\u{1FAF5}", // pointing at you
    },
    {
        indicator: "/sx",
        description: "sexual intent",
        emoji: "\u{1F69C}", // tractor
    },
    {
        indicator: "/nsx",
        description: "non-sexual intent",
        emoji: "\u{1F431}", // cat face
    },
    {
        indicator: "/rh",
        description: "rhetorical question",
        emoji: "\u{1F914}", // thinking face
    },
    {
        indicator: "/t",
        description: "teasing",
        emoji: "\u{1F60B}", // face savoring food
    },
    {
        indicator: "/ij",
        description: "inside joke",
        emoji: "\u{1F92D}", // face with hand over mouth
    },
    {
        indicator: "/m",
        description: "metaphorically",
        emoji: "\u{1F4D6}", // open book
    },
    {
        indicator: "/li",
        description: "literally",
        emoji: "\u{1F9D1}", // person
    },
    {
        indicator: "/hyp",
        description: "hyperbole",
        emoji: "\u{1F92C}", // face with symbols on mouth
    },
    {
        indicator: "/f",
        description: "fake",
        emoji: "\u{1F92F}", // exploding head
    },
    {
        indicator: "/th",
        description: "threat",
        emoji: "\u{1F374}", // fork and knife
    },
    {
        indicator: "/cb",
        description: "clickbait",
        emoji: "\u{1F4C8}", // chart with upwards trend
    },
	{
		indicator: "/sus",
		description: "suspicious",
		emoji: "\u{1F928}", // face with raised eyebrow
	}
];

export function getTodaysToneIndicator() {
	const today = Date.now() / (1000 * 60 * 60 * 24);
	const idx = Math.floor(today) % toneIndicators.length;
	return toneIndicators[idx];
}