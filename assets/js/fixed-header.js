const headerLinks = document.querySelectorAll('nav.navbar > #navbarSupportedContent > ul > li');
const sections = document.querySelectorAll('section');

function setActiveLinkInLanding() {
    sections.forEach(it => {
        const top = it.offsetTop - parseInt(getComputedStyle(it).paddingTop.replace('px', ''));
        if (top <= window.scrollY) {
            headerLinks.forEach(link => {
                if (link.dataset.id === it.id) {
                    link.classList.add('active');
                }
                else {
                    link.classList.remove('active')
                }
            });
        }
    });
}

switch (window.location.pathname) {
    case '/':
        setActiveLinkInLanding();
        document.addEventListener('scroll', setActiveLinkInLanding);
        break;

    default:
        const currentLink = window.location.pathname.split('/')[1];
        headerLinks.forEach(link => {
            if (link.dataset.id === currentLink) {
                link.classList.add('active');
            }
        });
        break;
}
