document.querySelector('#lite-shop-order').addEventListener('submit', submitForm)

function submitForm(event) {
	event.preventDefault()

	let username = document.querySelector('#username').value.trim()
	let phone = document.querySelector('#phone').value.trim()
	let email = document.querySelector('#email').value.trim()
	let address = document.querySelector('#address').value.trim()
	let rule = document.querySelector('#rule')

	if (username === '' || phone === '' || email === '' || address === '') {
		Swal.fire({
			title: 'Ошибка',
			text: 'Вы не заполнили поля',
			icon: 'error',
			confirmButtonText: 'Хорошо'
		})
		return false
	}

	if (!rule.checked) {
		Swal.fire({
			title: 'Ошибка',
			text: 'Вы не согласились с правилами',
			icon: 'error',
			confirmButtonText: 'Хорошо'
		})
		return false
	}

	fetch('/finish-order', {
		method: 'POST',
		body: JSON.stringify({
			'username': username,
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
			Swal.fire({
				title: 'Информация',
				text: 'Заказ успешно отправлен',
				icon: 'info',
				confirmButtonText: 'Хорошо'
			})
		} else {
			Swal.fire({
				title: 'Произошла ощибка',
				text: 'Что-то пошло не так',
				icon: 'info',
				confirmButtonText: 'Повторить'
			})
		}
	})

}