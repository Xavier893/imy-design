// stores/ProductStore.js
import { defineStore } from "pinia";
import { getProducts } from "@/services/ProductService";

export const useProductStore = defineStore("productStore", {
  state: () => ({
    products: [],
    isInitialized: false,
  }),

  actions: {
    async initializeStore() {
      if (!this.isInitialized) {
        try {
          const productData = await getProducts();
          this.products = productData || [];
          this.isInitialized = true;
        } catch (error) {
          console.error("Failed to initialize products:", error);
          this.products = [];
        }
      }
    },

    addProduct(newProduct) {
      this.products.push({ ...newProduct });
    },

    updateProduct(updatedProduct) {
      const index = this.products.findIndex(p => p.id === updatedProduct.id);
      if (index !== -1) {
        this.products.splice(index, 1, { ...updatedProduct });
      }
    },

    deleteProduct(productId) {
      this.products = this.products.filter(p => p.id !== productId);
    },
  },

  persist: process.client
    ? {
        enabled: true,
        strategies: [{ storage: localStorage, paths: ["products", "isInitialized"] }],
      }
    : false,
});
