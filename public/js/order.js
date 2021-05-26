
document.querySelector('#lite-shop-order').addEventListener('submit', submitForm)

function submitForm(event) {
	event.preventDefault()

	let userName = document.querySelector('#username').value.trim()
	let phone = document.querySelector('#phone').value.trim()
	let email = document.querySelector('#email').value.trim()
	let address = document.querySelector('#address').value.trim()
	let rule = document.querySelector('#rule')

	if (userName === '' || phone === '' || email === '' || address === '') {
		// Swal.fire({
		// 	title: 'Error!',
		// 	text: 'Do you want to continue',
		// 	icon: 'error',
		// 	confirmButtonText: 'Cool'
		// })
	}

	if (rule.checked) {

	}

	fetch('/finish-order', {
		method: 'POST',
		body: JSON.stringify({
			'username': userName,
			'phone': phone,
			'email': email,
			'address': address,
			'key': JSON.parse(localStorage.getItem('cart'))
		}),
		headers: {
			'Accept': 'application/json',
			'Content-Type': 'application/json'
		}
	}).then(response => {
		return response.text()
	}).then(body => {
		if (body == 1) {
			console.log('super');
		} else {

		}
	})

}