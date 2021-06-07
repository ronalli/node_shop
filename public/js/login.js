
function sendLogin() {



	let login = document.querySelector('#input-login').value.trim();
	let pass = document.querySelector('#input-password').value.trim();


	fetch('/login', {
		method: "POST",
		body: JSON.stringify({
			'login': login,
			'password': pass,
		}),
		headers: {
			'Accept': 'application/json',
			'Content-Type': 'application/json'
		}
	})
		.then((response) => {
			return response.text()
		})
		.then((response) => {

		})
}

document.querySelector('#form-login').addEventListener('submit', (e) => {
	e.preventDefault()
	sendLogin()
})