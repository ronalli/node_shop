let cart = {}

document.querySelectorAll('.add-to-cart').forEach(element => {
	element.addEventListener('click', addToCart)
})

function addToCart() {
	let goodsId = this.dataset.goods_id;
	if (cart[goodsId]) {
		cart[goodsId]++
	} else {
		cart[goodsId] = 1
	}
	// console.log(cart);
	ajaxGetGoodsInfo();
}

function ajaxGetGoodsInfo() {
	fetch('/get-goods-info', {
		method: "POST",
		body: JSON.stringify({ key: Object.keys(cart) }),
		headers: {
			'Accept': 'application/json',
			'Content-Type': 'application/json'
		}
	}).then(function (response) {
		// return response.text()
	}).then((body) => {
		console.log(body);
	})
}
