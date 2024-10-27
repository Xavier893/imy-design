<template>
  <nav
    :class="[
      'w-full flex justify-between items-center p-4 transition-colors duration-300 sticky top-0 z-10',
      isScrolled
        ? 'backdrop-blur-lg bg-white/50 border border-white/40 shadow-lg'
        : 'bg-white',
    ]"
    style="height: 80px; padding: 1rem 1rem"
  >
    <div class="flex justify-between items-center gap-2">
      <Button
        v-for="item in items"
        :key="item.label"
        :label="item.label"
        :severity="activeItem === item.label ? 'primary' : 'secondary'"
        text
        @click="router.push(item.to)"
      />
    </div>
    <div>
      <Button
        icon="pi pi-fw pi-user"
        rounded
        outlined
        size="large"
        severity="contrast"
        aria-haspopup="true"
        aria-controls="overlay_menu"
        @click="toggle"
        class="h-full"
      />
      <Menu
        :model="menuItems"
        ref="menu"
        id="overlay_menu"
        :popup="true"
        style="margin-top: 8px"
      />
      <Menu
        :model="cart"
        ref="cartMenu"
        id="cart_menu"
        :popup="true"
        style="margin-top: 8px; padding: 8px"
      >
        <template #start>
          <h1 class="text-2xl font-semibold">Your Cart</h1>
          <div class="border-[1px] my-2"></div>
        </template>

        <template #item="{ item }">
          <div
            class="flex items-center justify-between gap-16 hover:bg-none p-2"
          >
            <div class="flex items-center gap-2">
              <img
                :src="item.image"
                alt=""
                style="width: 80px; height: 80px; object-fit: contain"
              />
              <div>
                <h1 class="text-lg font-normal">{{ item.name }}</h1>
                <p class="text-lg text-gray-500">x{{ item.quantity }}</p>
              </div>
            </div>
            <!-- Display total price for each item based on quantity -->
            <p class="text-lg font-semibold">
              R{{ item.quantity * item.price }}
            </p>
          </div>
        </template>

        <template #end>
          <div class="border-[1px] my-2"></div>
          <!-- Display total cost at the bottom of the cart -->
          <div class="flex justify-between mb-2">
            <h2 class="text-lg font-semibold">Total</h2>
            <p class="text-lg font-semibold">R{{ getTotalCost() }}</p>
          </div>
          <Button
            label="Checkout"
            icon="pi pi-fw pi-check-square"
            style="background-color: #01b0ee; border-width: 0px"
            class="w-full"
          />
        </template>
      </Menu>
    </div>
  </nav>
</template>

<script setup>
import { ref, watch, onMounted, onBeforeUnmount } from "vue";

const router = useRouter();
const route = useRoute();
const activeItem = ref(route.path === "/dashboard" ? "Dashboard" : "Admin");
const menu = ref();
const isScrolled = ref(false);

const handleScroll = () => {
  isScrolled.value = window.scrollY > 0;
};

onMounted(() => {
  window.addEventListener("scroll", handleScroll);
});

onBeforeUnmount(() => {
  window.removeEventListener("scroll", handleScroll);
});

watch(
  () => route.path,
  () => {
    if (route.path === "/dashboard") {
      activeItem.value = "Dashboard";
    } else if (route.path === "/admin") {
      activeItem.value = "Manage Products";
    }
  }
);

const items = ref([
  {
    label: "Dashboard",
    icon: "pi pi-fw pi-home",
    to: "/dashboard",
  },
  {
    label: "Manage Products",
    icon: "pi pi-fw pi-shopping-cart",
    to: "/admin",
  },
]);

const menuItems = ref([
  {
    label: "Logout",
    icon: "pi pi-fw pi-sign-out",
    command: () => router.push("/"),
  },
]);

const toggle = (event) => {
  menu.value.toggle(event);
};
</script>
