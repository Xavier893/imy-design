// useProductStore.js
import { ref, reactive } from 'vue';
import { defineStore } from 'pinia';
import { getProducts } from '@/services/ProductService';

const useProductStore = () => {
  const products = ref([]);
  const state = reactive({
    initialized: false
  });

  const initializeStore = async () => {
    if (!state.initialized) {
      try {
        const productData = await getProducts();
        products.value = productData || [];
        state.initialized = true;
      } catch (error) {
        console.error('Failed to initialize products:', error);
        products.value = [];
      }
    }
  };

  const addProduct = (newProduct) => {
    console.log('Adding new product:', newProduct);
    // Create a new array reference to ensure reactivity
    products.value = [...products.value, { ...newProduct }];
  };

  const updateProduct = (updatedProduct) => {
    const index = products.value.findIndex(p => p.id === updatedProduct.id);
    if (index !== -1) {
      // Create a new array reference to ensure reactivity
      products.value = [
        ...products.value.slice(0, index),
        { ...updatedProduct },
        ...products.value.slice(index + 1)
      ];
    }
  };

  const deleteProduct = (productId) => {
    products.value = products.value.filter(p => p.id !== productId);
  };

  // Initialize store
  initializeStore();

  return {
    products,
    addProduct,
    updateProduct,
    deleteProduct
  };
};

//export { useProductStore };