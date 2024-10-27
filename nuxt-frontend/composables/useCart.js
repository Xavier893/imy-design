export const useCart = () => {
	const cart = useState("cart", () => {
		if (process.client) {
			return JSON.parse(localStorage.getItem("cart")) || [];
		}
		return [];
	});
	const cartItemsCount = useState("cartItemsCount", () => {
		if (process.client) {
			return JSON.parse(localStorage.getItem("cartItemsCount")) || 0;
		}
		return 0;
	});

	const syncCartWithLocalStorage = () => {
		if (process.client) {
			localStorage.setItem("cart", JSON.stringify(cart.value));
			localStorage.setItem("cartItemsCount", JSON.stringify(cartItemsCount.value));
		}
	};

	const addToCart = (product) => {
		const existingItem = cart.value.find((item) => item.id === product.id);
		if (existingItem) {
			existingItem.quantity += 1;
		} else {
			cart.value.push({ ...product, quantity: 1 });
		}
		cartItemsCount.value = cart.value.reduce(
			(sum, item) => sum + item.quantity,
			0
		);
		syncCartWithLocalStorage();
	};

	const removeFromCart = (productId) => {
		cart.value = cart.value.filter((item) => item.id !== productId);
		cartItemsCount.value = cart.value.reduce(
			(sum, item) => sum + item.quantity,
			0
		);
		syncCartWithLocalStorage();
	};

	const checkout = () => {
		cart.value = [];
		cartItemsCount.value = 0;
		syncCartWithLocalStorage();
	};

	const getTotalCost = () => {
		return cart.value.reduce(
			(total, item) => total + item.quantity * item.price,
			0
		);
	};

	const getCartItems = () => cart.value;

	return {
		cart,
		cartItemsCount,
		addToCart,
		removeFromCart,
		checkout,
		getTotalCost,
		getCartItems,
	};
};
