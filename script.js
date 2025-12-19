'use strict';

// Toggle theme between light and dark

const /** {NodeElement} */ $themeBtn =
		document.querySelector('[data-theme-btn]');

const /** {NodeElement} */ $HTML = document.documentElement;

let /** {String | Boolean} */ isDark = window.matchMedia(
		'(prefers-color-scheme: dark)'
	).matches;

if (sessionStorage.getItem('theme')) {
	$HTML.dataset.theme = sessionStorage.getItem('theme');
} else {
	$HTML.dataset.theme = isDark ? 'dark' : 'light';
	sessionStorage.setItem('theme', $HTML.dataset.theme);
}

const toggleTheme = () => {
	$HTML.dataset.theme =
		sessionStorage.getItem('theme') === 'light' ? 'dark' : 'light';
	sessionStorage.setItem('theme', $HTML.dataset.theme);
};

$themeBtn.addEventListener('click', toggleTheme);
