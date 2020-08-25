function initHeader() {
	const headerBackgroundImage = document.querySelector('header > .image-background');
	const meInfo = document.querySelector('header .me-header');
	const paths = [
		'/images/landing/header_backgrounds/0.jpg',
		'/images/landing/header_backgrounds/1.jpg',
		'/images/landing/header_backgrounds/2.jpg',
	];
	const animationTime = 10000;
	let backgroundCounter = 0;

	function headerParallax() {
		const documentHeight = document.documentElement.clientHeight || document.body.clientHeight;
		const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
	
		// Parallax optimization
		if (scrollTop <= documentHeight) {
			meInfo.style.marginTop = `${parseFloat(scrollTop/6)}px`;
			headerBackgroundImage.style.top = `${parseFloat(scrollTop/4)}px`;
		}
	}

	function changeBgImage() {
		backgroundCounter++;
		if (backgroundCounter === paths.length) {
			backgroundCounter = 0;
		}
		headerBackgroundImage.style.backgroundImage = `url(${paths[backgroundCounter]})`;
	}

	headerBackgroundImage.style.animation = `backgroundMovement ${animationTime/1000}s infinite linear`;

	document.addEventListener('scroll', headerParallax);
	headerBackgroundImage.addEventListener('animationiteration', changeBgImage);

	window.addEventListener('beforeunload', () => {
		document.removeEventListener('scroll', headerParallax);
		headerBackgroundImage.removeEventListener('animationiteration', changeBgImage);
	});

	$('header .anim').slick({
		vertical: true,
		autoplay: true,
		autoplaySpeed: 3000,
		speed: 500,
		draggable: false,
		prevArrow: '',
		nextArrow: ''
	});
}
initHeader();
