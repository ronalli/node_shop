module.exports = {
	parser: function (value) {

		let temp = {}
		for (let i = 0; i < value.length; i++) {
			temp[value[i]['id']] = value[i]
		}
		return JSON.parse(JSON.stringify(temp))
	},

	formatPrice: function (value) {
		return value.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$& ')
	},

	parserStringify: function (value) {
		return JSON.parse(JSON.stringify(value))
	},

	protectionAdmin: function (req, res, connect, next) {
		// console.log('Cokies: ', req.cookies);
		if (req.cookies.hash == undefined || req.cookies.id == undefined) {
			res.redirect('/login')
			return false;
		}
		connect.query(
			'SELECT * FROM user WHERE id=' + req.cookies.id + ' AND hash="' + req.cookies.hash + '"', (error, result) => {
				if (error) throw error
				if (result.length == 0) {
					console.log('error user not found');
					res.redirect('/login')
				} else {
					next()
					// res.render('admin', {})
				}
			}
		)
	},

	randomHash: function (length) {
		let result = '';
		let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
		let charactersLength = characters.length;
		for (let i = 0; i < length; i++) {
			result += characters.charAt(Math.floor(Math.random() *
				charactersLength));
		}
		return result;
	}
}