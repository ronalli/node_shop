let express = require('express')
let app = express()
let mysql = require('mysql')

app.use(express.static('public'))

app.set('view engine', 'pug')

let connect = mysql.createConnection({
	host: 'localhost',
	user: 'root',
	password: 'root',
	database: 'shop',
})

app.listen(3000, function () {
	console.log('nodejs express work on 3000')
})

app.get('/', (req, res) => {
	connect.query(
		'SELECT * FROM goods',
		function (err, result) {
			if (err) throw err
			let goods = {};
			for (let i = 0; i < result.length; i++) {
				goods[result[i]['id']] = result[i];
			}
			// console.log(JSON.parse(JSON.stringify(goods)));
			res.render('main', {
				foo: 11,
				bar: 15,
				goods: JSON.parse(JSON.stringify(goods))
			})
		}
	)
})


