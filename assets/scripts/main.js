// Navigation bar
const navbarBlock = document.querySelector('nav');
const navbarButton = navbarBlock.querySelector('button');
const navbarContent = navbarBlock.querySelector('.nav-content');

navbarButton.addEventListener('click', (event) => {
	event.preventDefault();
	navbarContent.classList.toggle('show');
});

// SVG animation in "About Me" section
function shake(e, distance, time) {
	let start = (new Date()).getTime();

	function animate() {
		let now = (new Date()).getTime();

		// Get current time
		let elapsed = now - start;

		// How long since we started
		let fraction = elapsed / time;

		let x = distance * Math.sin(fraction * 4 * Math.PI);
		let y = distance * Math.cos(fraction * 3 * Math.PI);
		e.setAttribute('transform', `translate(${x},${y})`);

		requestAnimationFrame(animate);
	}

	requestAnimationFrame(animate);
}

const randomNumber = (min, max) => Math.floor((Math.random() * (max - min + 1)) + min);

window.onload = () => {
	const programsIUseSvg = document.getElementById('programsIUse').contentDocument;
	programsIUseSvg.querySelectorAll('svg > g').forEach((it) => {
		it.style.position = 'relative';
		shake(it, randomNumber(1, 3), randomNumber(2000, 5000));
	});
}
