[...document.getElementsByClassName('modal')].forEach((modal) => {
	[...modal.getElementsByTagName('button')].pop().onclick = (event) => {
		event.preventDefault();
		modal.classList.remove('show');
	}
});

const registrationForm = document.getElementById('registration_form');
const registrationSuccessModal = document.getElementById('registration_success');
const registrationFormButton = registrationForm.querySelector('#submitButton');

registrationForm.onsubmit = async (event) => {
	event.preventDefault();
	registrationSuccessModal.classList.add('show');
}
