export const useCart = () => {
	const cart = useState("cart", () => []); // Create a shared state for the cart
	const cartItemsCount = useState("cartItemsCount", () => 0); // Create a shared state for the cart item count

	const addToCart = (product) => {
		const existingItem = cart.value.find((item) => item.id === product.id);
		if (existingItem) {
			existingItem.quantity += 1; // If the item already exists, increment the quantity
		} else {
			cart.value.push({ ...product, quantity: 1 }); // If it's a new item, add it with quantity 1
		}
		cartItemsCount.value = cart.value.reduce(
			(sum, item) => sum + item.quantity,
			0
		); // Update total items count
	};

	const getTotalCost = () => {
		return cart.value.reduce(
			(total, item) => total + item.quantity * item.price,
			0
		);
	};

	const getCartItems = () => cart.value; // Get all items in the cart

	return {
		cart,
		cartItemsCount,
		addToCart,
		getTotalCost, // Expose the getTotalCost function
		getCartItems,
	};
};
