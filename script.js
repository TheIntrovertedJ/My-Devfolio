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

// ============================================================================
// Contact Form Handling
// ============================================================================

const contactForm = document.getElementById('contactForm');
const formMessage = document.getElementById('formMessage');
const submitBtn = document.getElementById('submitBtn');

if (contactForm) {
	contactForm.addEventListener('submit', async (e) => {
		e.preventDefault();

		// Get form data
		const formData = new FormData(contactForm);
		const data = {
			name: formData.get('name'),
			email: formData.get('email'),
			subject: formData.get('subject'),
			message: formData.get('message'),
		};

		// Show loading state
		submitBtn.disabled = true;
		submitBtn.innerHTML =
			'<span class="label-large">Sending...</span><div class="state-layer"></div>';
		formMessage.style.display = 'none';

		try {
			// Send form data to backend
			const response = await fetch('/api/contact', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(data),
			});

			const result = await response.json();

			// Show message
			formMessage.style.display = 'block';

			if (response.ok) {
				// Success
				formMessage.className = 'form-message success';
				formMessage.textContent =
					result.message || 'Message sent successfully!';
				contactForm.reset();
			} else {
				// Error
				formMessage.className = 'form-message error';
				formMessage.textContent =
					result.message || 'Failed to send message. Please try again.';
			}
		} catch (error) {
			console.error('Error submitting form:', error);
			formMessage.style.display = 'block';
			formMessage.className = 'form-message error';
			formMessage.textContent = 'An error occurred. Please try again later.';
		} finally {
			// Reset button state
			submitBtn.disabled = false;
			submitBtn.innerHTML =
				'<span class="label-large">Send Message</span><div class="state-layer"></div>';
		}
	});
}
