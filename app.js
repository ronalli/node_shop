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
	let goods = new Promise((resolve, reject) => {
		connect.query(
			'SELECT id, name, cost, image, category FROM (SELECT id, name, cost, image, category, if(if(@curr_category != category, @curr_category := category, "") != "", @k := 0, @k := @k + 1) as ind  FROM goods, ( select @curr_category := "" ) v ) goods WHERE ind < 3',
			function (error, result) {
				if (error) return reject(error)
				resolve(result)
			}
		)
	})

	let categoryDescription = new Promise((resolve, reject) => {
		connect.query(
			'SELECT * FROM category',
			function (error, result) {
				if (error) return reject(error)
				resolve(result)
			}
		)
	})

	Promise.all([goods, categoryDescription]).then((value) => {
		// console.log(tools.parserStringify(value[0]));
		res.render('index', {
			goods: tools.parserStringify(value[0]),
			categoryDescription: tools.parserStringify(value[1])
		})
	})

})


app.get('/cat', (req, res) => {
	// console.log(req.query.id);
	let catId = req.query.id;
	let cat = new Promise((resolve, reject) => {
		connect.query(
			'SELECT * FROM category WHERE id=' + catId,
			function (error, result) {
				if (error) reject(error)
				resolve(result)
			}
		)
	})

	let goods = new Promise((resolve, reject) => {
		connect.query(
			'SELECT * FROM goods WHERE category=' + catId,
			function (error, result) {
				if (error) reject(error)
				resolve(tools.parser(result))
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
		function (error, result) {
			if (error) throw error
			// console.log(JSON.parse(JSON.stringify(rezult)));
			res.render('goods', {
				goods: JSON.parse(JSON.stringify(result))
			})
		}
	)
})


app.get('/order', (req, res) => {
	res.render('order')
})

app.post('/get-category-list', (req, res) => {
	connect.query(
		'SELECT id, category FROM category', (error, result) => {
			if (error) throw error
			// console.log(rezult);
			res.json(result)
		}
	)
})


app.post('/get-goods-info', (req, res) => {
	if (req.body.key.length != 0) {
		connect.query(
			'SELECT id, name, cost FROM goods WHERE id IN (' + req.body.key.join(',') + ')', (error, result) => {
				if (error) throw error
				// console.log(tools.parser(rezult));
				res.json(tools.parser(result))
			}
		)
	} else {
		res.send('0')
	}
	// console.log(req.body);
})


app.post('/finish-order', (req, res) => {
	if (req.body.key.length !== 0) {
		// res.send('1')
		let key = Object.keys(req.body.key)
		connect.query(
			'SELECT id, name, cost FROM goods WHERE id IN (' + key.join(',') + ')', (error, result) => {
				if (error) throw error
				console.log(result);
				sendMail(req.body, result).catch(console.error)
				res.send('1')
			}
		)
	} else {
		res.send('0')
	}

})


function sendMail(data, result) {
	
}