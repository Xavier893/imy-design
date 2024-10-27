// stores/CartStore.js
import { defineStore } from "pinia";

export const useCartStore = defineStore("cartStore", {
  state: () => ({
    cartItems: [], // Stores items added to the cart
  }),

  actions: {
    addToCart(product) {
      const existingItem = this.cartItems.find(item => item.id === product.id);

      if (existingItem) {
        existingItem.quantity += 1; // Increment quantity if item already in cart
      } else {
        this.cartItems.push({ ...product, quantity: 1 });
      }
    },

    removeFromCart(productId) {
      this.cartItems = this.cartItems.filter(item => item.id !== productId);
    },

    updateCartItemQuantity(productId, quantity) {
      const item = this.cartItems.find(item => item.id === productId);
      if (item && quantity > 0) {
        item.quantity = quantity;
      } else if (item && quantity <= 0) {
        this.removeFromCart(productId); // Remove item if quantity set to 0
      }
    },

    clearCart() {
      this.cartItems = [];
    },
  },

  getters: {
    cartTotal() {
      return this.cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
    },

    totalItems() {
      return this.cartItems.reduce((total, item) => total + item.quantity, 0);
    },
  },

  persist: process.client
    ? {
        enabled: true,
        strategies: [{ storage: localStorage, paths: ["cartItems"] }],
      }
    : false,
});
