let express = require('express')
let app = express()
let mysql = require('mysql')
let tools = require('./public/js/tool')
const nodemailer = require('nodemailer')

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
	if (req.body.key.length != 0) {
		// res.send('1')
		let key = Object.keys(req.body.key)
		connect.query(
			'SELECT id, name, cost FROM goods WHERE id IN (' + key.join(',') + ')', (error, result) => {
				if (error) throw error
				// console.log(result);
				sendMailServer(req.body, result).catch(console.error)
				saveOrder(req.body, result)
				res.send('1')
			}
		)
	} else {
		res.send('0')
	}
})

app.get('/admin', (req, res) => {
	res.render('admin', {})
})

app.get('/admin-order', (req, res) => {
	connect.query(
		`SELECT 
		shop_order.id as id, 
			shop_order.user_id as user_id, 
			shop_order.goods_id as goods_id, 
			shop_order.goods_cost as goods_cost, 
			shop_order.goods_amount as goods_amount, 
			shop_order.total as total, 
			from_unixtime(date, "%Y-%m-%d %h:%m") as human_date, 
			user_info.user_name as user, 
			user_info.user_phone as phone,
			user_info.address as address  
	FROM 
		shop_order 
	LEFT JOIN 
		user_info 
	ON shop_order.user_id=user_info.id`, (error, result) => {   //ORDER BY id DESC
		if (error) throw error
		res.render('admin-order', {
			order: JSON.parse(JSON.stringify(result))
		})
	}
	)
})

function saveOrder(data, result) {
	// console.log(data);
	// console.log(result);
	//data - информация о пользователях
	//result - сведения о товаре
	let sql = "INSERT INTO user_info (user_name, user_phone, user_email, address) VALUES ('" + data.username + "', '" + data.phone + "', '" + data.email + "', '" + data.address + "')"
	connect.query(sql, (error, resultQuery) => {
		if (error) throw error
		console.log('1 user info saved')
		let userId = resultQuery.insertId
		date = new Date() / 1000
		for (i = 0; i < result.length; i++) {
			sql = "INSERT INTO shop_order (date, user_id, goods_id, goods_cost, goods_amount, total) VALUES (" + date + "," + userId + "," + result[i]['id'] + "," + result[i]['cost'] + "," + data.key[result[i]['id']] + "," + data.key[result[i]['id']] * result[i]['cost'] + " )"
			connect.query(sql, (error, result) => {
				if (error) throw error
				console.log('1 goods saved');
			})
		}
	})
}


async function sendMailServer(data, result) {
	let total = 0;
	let res = '<h2>Order in lite shop</h2>';
	for (i = 0; i < result.length; i++) {
		res += `<p>${result[i]['name']} - ${data.key[result[i]['id']]} - ${result[i]['cost'] * data.key[result[i]['id']]} uah</p>`
		total += `${result[i]['cost'] * data.key[result[i]['id']]}`
	}
	res += `<hr>`
	res += `Total: ${total} uah`
	res += `<hr>Username: ${data.username}`
	res += `<hr>Phone: ${data.phone}`
	res += `<hr>Email: ${data.email}`
	res += `<hr>Address: ${data.address}`

	// console.log(res);
	// console.log(data);
	// console.log(result);
	let testAccount = await nodemailer.createTestAccount();
	let transporter = nodemailer.createTransport({
		host: "smtp.ethereal.email",
		port: 587,
		secure: false, // true for 465, false for other ports
		auth: {
			user: testAccount.user, // generated ethereal user
			pass: testAccount.pass, // generated ethereal password
		},
	})

	let info = await transporter.sendMail({
		from: '"Fred Foo 👻" <khakimov.nikita.v@gmail.com>', // sender address
		to: `khakimov.nikita.v@gmail.com, ${data.email}`, // list of receivers
		subject: "Hello ✔", // Subject line
		text: "Hello world?", // plain text body
		html: `${res}`, // html body
	})
	console.log("Message sent: %s", info.messageId);
	console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
}