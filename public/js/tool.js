module.exports = {
	parser: function (value) {

		let temp = {}
		for (let i = 0; i < value.length; i++) {
			temp[value[i]['id']] = value[i]
		}
		return JSON.parse(JSON.stringify(temp))
	}
}