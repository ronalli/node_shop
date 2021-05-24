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
	}
}