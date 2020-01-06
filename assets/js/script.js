function initHeader() {
	function headerParallax() {
		const documentHeight = document.documentElement.clientHeight || document.body.clientHeight;
		const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
	
		// Parallax optimization
		if (scrollTop <= documentHeight) {
			meInfo.style.marginTop = `${parseFloat(scrollTop/6)}px`;
			headerBackgroundImage.style.top = `${parseFloat(scrollTop/4)}px`;
		}
	}
	
	const headerBackgroundImage = document.querySelector('header > .image-background');
	const meInfo = document.querySelector('header .me-header');
	const paths = [
		'/images/landing/header_backgrounds/0.jpg',
		'/images/landing/header_backgrounds/1.jpg',
		'/images/landing/header_backgrounds/2.jpg',
	];
	let backgroundCounter = 0;

	document.addEventListener('scroll', () => {
		headerParallax();
	});

	setInterval(() => {
		backgroundCounter = backgroundCounter < paths.length-1
			? backgroundCounter + 1
			: 0;
		headerBackgroundImage.style.backgroundImage = `url(${paths[backgroundCounter]})`;
	}, 10000);

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

function initNavbar() {
	function setNavbarPosition() {
		if (window.pageYOffset >= document.body.clientHeight) {
			navbar.classList.add('fixed-top');
			document.body.querySelectorAll('section').forEach(it => {
				it.style.padding = `calc(2% + 56px * 2) 0`;
			});
		}
		else {
			navbar.classList.remove('fixed-top');
			document.body.querySelectorAll('section').forEach(it => {
				it.style.padding = `calc(2% + 56px) 0`;
			});
		}
	}

	const navbar = document.body.querySelector('nav');

	window.addEventListener('scroll', () => {
		setNavbarPosition();
	});
	window.addEventListener('load', () => {
		setNavbarPosition();
	});
}
initNavbar();
