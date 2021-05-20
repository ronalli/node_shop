let express = require('express')
let app = express()
let mysql = require('mysql')
let tools = require('./public/js/tool')

app.use(express.static('public'))
app.use(express.json())

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
		function (err, rezult) {
			if (err) throw err
			let goods = tools.parser(rezult);
			res.render('main', {
				goods: goods
			})
		}
	)
})


app.get('/cat', (req, res) => {
	// console.log(req.query.id);
	let catId = req.query.id;
	let cat = new Promise((resolve, reject) => {
		connect.query(
			'SELECT * FROM category WHERE id=' + catId,
			function (error, rezult) {
				if (error) reject(error)
				resolve(rezult)
			}
		)
	})

	let goods = new Promise((resolve, reject) => {
		connect.query(
			'SELECT * FROM goods WHERE category=' + catId,
			function (error, rezult) {
				if (error) reject(error)
				resolve(tools.parser(rezult))
			}
		)
	})

	Promise.all([cat, goods]).then((value) => {
		// console.log(value[1]);
		res.render('cat', {
			category: value[0],
			goods: value[1]
		})
	})
})


app.get('/goods', (req, res) => {
	connect.query(
		'SELECT * FROM goods WHERE id=' + req.query.id,
		function (error, rezult) {
			if (error) throw error
			// console.log(JSON.parse(JSON.stringify(rezult)));
			res.render('goods', {
				goods: JSON.parse(JSON.stringify(rezult))
			})
		}
	)
})

app.post('/get-category-list', (req, res) => {
	connect.query(
		'SELECT id, category FROM category', (error, rezult) => {
			if (error) throw error
			// console.log(rezult);
			res.json(rezult)
		}
	)
})


app.post('/get-goods-info', (req, res) => {
	if (req.body.key.length != 0) {
		connect.query(
			'SELECT id, name, cost FROM goods WHERE id IN (' + req.body.key.join(',') + ')', (error, rezult) => {
				if (error) throw error
				console.log(tools.parser(rezult));
				res.json(tools.parser(rezult))
			}
		)
	} else {
		res.send('0')
	}
	// console.log(req.body);
})

