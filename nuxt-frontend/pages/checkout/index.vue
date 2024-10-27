<template>
  <div>
    <Toast />
    <Dialog
      v-model:visible="confirmDialogVisible"
      header="Confirm Removal"
      :modal="true"
      :style="{ width: '400px' }"
    >
      <p>Are you sure you want to remove this item from your cart?</p>
      <template #footer>
        <Button
          label="No"
          icon="pi pi-times"
          severity="secondary"
          text
          @click="confirmDialogVisible = false"
        />
        <Button
          label="Yes"
          icon="pi pi-check"
          class="p-button-danger"
          @click="confirmRemoveItem"
          outlined
        />
      </template>
    </Dialog>

    <DataView :value="computedCartItems">
      <template #list="slotProps">
        <div class="flex flex-col">
          <div v-for="(item, index) in slotProps.items" :key="index">
            <div
              class="flex flex-col sm:flex-row sm:items-center p-6 gap-4"
              :class="{
                'border-t border-surface-200 dark:border-surface-700':
                  index !== 0,
              }"
            >
              <div class="md:w-40 relative">
                <img
                  class="block xl:block mx-auto rounded w-full"
                  :src="`${item.image}`"
                  :alt="item.name"
                />
              </div>
              <div
                class="flex flex-col md:flex-row justify-between md:items-center flex-1 gap-6"
              >
                <div
                  class="flex flex-row md:flex-col justify-between items-start gap-2"
                >
                  <div>
                    <span
                      class="font-medium text-surface-500 dark:text-surface-400 text-sm"
                    >
                      {{ item.category }}
                    </span>
                    <div class="text-lg font-medium mt-2">{{ item.name }}</div>
                  </div>
                  <div class="bg-surface-100 p-1" style="border-radius: 30px">
                    <div
                      class="bg-surface-0 flex items-center gap-2 justify-center py-1 px-2"
                    >
                      <span class="text-surface-900 font-medium"
                        >x{{ item.quantity }}</span
                      >
                    </div>
                  </div>
                </div>
                <div class="flex flex-col md:items-end gap-8">
                  <span class="text-xl font-semibold"
                    >R{{ item.price * item.quantity }}</span
                  >
                  <div class="flex flex-row-reverse md:flex-row gap-2">
                    <Button
                      icon="pi pi-trash"
                      label="Remove"
                      class="flex-auto md:flex-initial whitespace-nowrap"
                      severity="danger"
                      @click="openConfirmDialog(item.id)"
                    ></Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </template>
      <template #footer>
        <div class="flex w-full justify-between items-center">
          <h3 class="font-semibold text-lg">Your Total Cost</h3>
          <h3 class="font-semibold text-lg">R{{ getTotalCost() }}</h3>
        </div>
        <div class="flex justify-end mt-2">
          <Button
            label="Checkout"
            icon="pi pi-fw pi-check-square"
            :loading="loading"
            style="background-color: #01b0ee; border-width: 0px"
            @click="handleCheckout"
          />
        </div>
      </template>
      <template #empty>
        <p class="text-center text-lg py-4">Your cart is empty.</p>
      </template>
    </DataView>
  </div>
</template>

<script setup>
import { useCart } from "~/composables/useCart";
import { useToast } from "primevue/usetoast";
import { computed, ref } from "vue";

const { getCartItems, getTotalCost, removeFromCart, checkout } = useCart();
const toast = useToast();

const confirmDialogVisible = ref(false); // Control dialog visibility
const itemToRemove = ref(null); // Track item to remove when dialog confirms

const computedCartItems = computed(() => getCartItems());

const openConfirmDialog = (productId) => {
  itemToRemove.value = productId;
  confirmDialogVisible.value = true;
};

const confirmRemoveItem = () => {
  removeFromCart(itemToRemove.value);
  toast.add({
    severity: "success",
    summary: "Removed",
    detail: "Item removed from cart.",
    life: 3000,
  });
  confirmDialogVisible.value = false; // Close dialog after confirming
};

const loading = ref(false);
const handleCheckout = () => {
  if (getCartItems().length === 0) {
    toast.add({
      severity: "error",
      summary: "Error",
      detail: "Your cart is empty.",
      life: 3000,
    });
    return;
  } else {
    loading.value = true;
    setTimeout(() => {
      checkout();
      toast.add({
        severity: "success",
        summary: "Order Placed",
        detail: "You have successfully placed your order.",
        life: 3000,
      });
      loading.value = false;
    }, 3000);
  }
};
</script>
