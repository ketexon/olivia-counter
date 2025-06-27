const dates = [
	{ month: 7 - 1, day: 7 }, // July 7
	{ month: 8 - 1, day: 1 }, // August 1
	{ month: 9 - 1, day: 12 }, // September 12
];

const template = document.querySelector(
	".date-countdown-template"
);

const container = document.querySelector(
	".date-countdown-container"
);

dates.forEach(
	({ month, day }) => {
		const today = new Date();
		const date = new Date(
			today.getFullYear(),
			month,
			day
		)

		if (date < today) {
			date.setFullYear(today.getFullYear() + 1);
		}

		const options = {
			month: "long",
			day: "numeric",
		};

		const el = template.content.cloneNode(true);
		el.querySelector(".date-countdown__date").textContent = date.toLocaleDateString(
			"en-US",
			options
		);
		const daysLeftContainer = el.querySelector(".date-countdown__days");
		function updateDaysLeft(){
			const now = new Date();
			const daysLeft = Math.ceil((date - now) / (1000 * 60 * 60 * 24));
			daysLeftContainer.textContent = daysLeft;
		}
		setInterval(updateDaysLeft, 1000 * 60); // Update every minute
		updateDaysLeft();
		container.appendChild(el);
	}
)