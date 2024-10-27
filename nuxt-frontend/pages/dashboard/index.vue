<script setup>
import { onMounted, ref } from "vue";
import { getProducts } from "~/services/ProductService";

const products = ref(null);
const chartData = ref(null);
const chartOptions = ref(null);

const items = ref([
  { label: "Add New", icon: "pi pi-fw pi-plus" },
  { label: "Remove", icon: "pi pi-fw pi-trash" },
]);

onMounted(() => {
  products.value = getProducts();
  chartData.value = setChartData();
  chartOptions.value = setChartOptions();
});

function setChartData() {
  const documentStyle = getComputedStyle(document.documentElement);

  return {
    labels: ["Q1", "Q2", "Q3", "Q4"],
    datasets: [
      {
        type: "bar",
        label: "Scale Cars",
        backgroundColor: documentStyle.getPropertyValue("--p-blue-400"),
        data: [4000, 10000, 15000, 4000],
        barThickness: 32,
      },
      {
        type: "bar",
        label: "Scale Parts",
        backgroundColor: documentStyle.getPropertyValue("--p-orange-400"),
        data: [2100, 8400, 2400, 7500],
        barThickness: 32,
      },
      {
        type: "bar",
        label: "Display Cases",
        backgroundColor: documentStyle.getPropertyValue("--p-cyan-400"),
        data: [4100, 5200, 3400, 7400],
        barThickness: 32,
      },
      {
        type: "bar",
        label: "Scale Track",
        backgroundColor: documentStyle.getPropertyValue("--p-green-400"),
        data: [4100, 5200, 3400, 7400],
        borderRadius: {
          topLeft: 8,
          topRight: 8,
        },
        borderSkipped: true,
        barThickness: 32,
      },
    ],
  };
}

function setChartOptions() {
  const documentStyle = getComputedStyle(document.documentElement);
  const borderColor = "#E5E7EB";
  const textMutedColor = documentStyle.getPropertyValue(
    "--text-color-secondary"
  );

  return {
    maintainAspectRatio: false,
    aspectRatio: 0.8,
    scales: {
      x: {
        stacked: true,
        ticks: {
          color: textMutedColor,
        },
        grid: {
          color: "transparent",
          borderColor: "transparent",
        },
      },
      y: {
        stacked: true,
        ticks: {
          color: textMutedColor,
        },
        grid: {
          color: borderColor,
          borderColor: "transparent",
          drawTicks: false,
        },
      },
    },
  };
}

const formatCurrency = (value) => {
  return `R${value}`;
};

const visible = ref(false);
const selectedProduct = ref(null);
const handleProductClick = (product) => {
  visible.value = true;
  selectedProduct.value = product;
};

definePageMeta({
  layout: "admin",
});
</script>

<template>
  <div class="grid grid-cols-12 gap-8">
    <div class="col-span-12 lg:col-span-6 xl:col-span-4">
      <div class="card mb-0 rounded-md bg-white p-5">
        <div class="flex justify-between mb-4">
          <div>
            <span class="block text-muted-color font-medium mb-4">Orders</span>
            <div
              class="text-surface-900 dark:text-surface-0 font-medium text-xl"
            >
              152
            </div>
          </div>
          <div
            class="flex items-center justify-center bg-blue-100 dark:bg-blue-400/10 rounded-border"
            style="width: 2.5rem; height: 2.5rem"
          >
            <i class="pi pi-shopping-cart text-blue-500 !text-xl"></i>
          </div>
        </div>
        <span class="text-green-500 font-medium">24 new </span>
        <span class="text-muted-color">since last visit</span>
      </div>
    </div>
    <div class="col-span-12 lg:col-span-6 xl:col-span-4">
      <div class="card mb-0 rounded-md bg-white p-5">
        <div class="flex justify-between mb-4">
          <div>
            <span class="block text-muted-color font-medium mb-4">Revenue</span>
            <div
              class="text-surface-900 dark:text-surface-0 font-medium text-xl"
            >
              R8,499
            </div>
          </div>
          <div
            class="flex items-center justify-center bg-orange-100 dark:bg-orange-400/10 rounded-border"
            style="width: 2.5rem; height: 2.5rem"
          >
            <i class="pi pi-dollar text-orange-500 !text-xl"></i>
          </div>
        </div>
        <span class="text-green-500 font-medium">%52+ </span>
        <span class="text-muted-color">since last week</span>
      </div>
    </div>
    <div class="col-span-12 lg:col-span-6 xl:col-span-4">
      <div class="card mb-0 rounded-md bg-white p-5">
        <div class="flex justify-between mb-4">
          <div>
            <span class="block text-muted-color font-medium mb-4"
              >Customers</span
            >
            <div
              class="text-surface-900 dark:text-surface-0 font-medium text-xl"
            >
              28441
            </div>
          </div>
          <div
            class="flex items-center justify-center bg-cyan-100 dark:bg-cyan-400/10 rounded-border"
            style="width: 2.5rem; height: 2.5rem"
          >
            <i class="pi pi-users text-cyan-500 !text-xl"></i>
          </div>
        </div>
        <span class="text-green-500 font-medium">520 </span>
        <span class="text-muted-color">newly registered</span>
      </div>
    </div>

    <div class="col-span-12 xl:col-span-6">
      <div class="card rounded-md bg-white p-5">
        <div class="font-semibold text-xl mb-4">Recent Sales</div>
        <DataTable
          :value="products"
          :rows="5"
          :paginator="true"
          responsiveLayout="scroll"
        >
          <Column style="width: 15%" header="Image">
            <template #body="slotProps">
              <img
                :src="`${slotProps.data.image}`"
                :alt="slotProps.data.image"
                width="50"
                class="shadow"
              />
            </template>
          </Column>
          <Column
            field="name"
            header="Name"
            :sortable="true"
            style="width: 35%"
          ></Column>
          <Column
            field="price"
            header="Price"
            :sortable="true"
            style="width: 35%"
          >
            <template #body="slotProps">
              {{ formatCurrency(slotProps.data.price) }}
            </template>
          </Column>
          <Column style="width: 15%" header="View">
            <template #body="slotProps">
              <Button
                icon="pi pi-search"
                type="button"
                class="p-button-text"
                @click="handleProductClick(slotProps.data)"
              ></Button>
            </template>
          </Column>
          <Dialog
            v-model:visible="visible"
            modal
            dismissableMask
            header="Product Information"
            class="w-[35rem]"
            :style="{ 'font-family': 'Montserrat' }"
          >
            <div class="flex flex-col gap-4 justify-between items-start">
              <div class="w-full h-[200px]">
                <img
                  class="rounded w-full h-full object-contain"
                  :src="`${selectedProduct.image}`"
                  :alt="selectedProduct.name"
                />
              </div>

              <div
                class="flex flex-row w-full justify-between items-start gap-2"
              >
                <div>
                  <div class="text-lg font-medium mt-1">
                    {{ selectedProduct.name }}
                  </div>
                  <span class="font-medium text-gray-500 text-sm">{{
                    selectedProduct.category
                  }}</span>
                </div>
                <div class="bg-surface-100 p-1" style="border-radius: 30px">
                  <div
                    class="bg-surface-0 rounded border-gray-300 border flex items-center gap-2 justify-center py-1 px-2"
                  >
                    <span class="text-surface-900 font-medium text-sm">{{
                      selectedProduct.rating
                    }}</span>
                    <i class="pi pi-star-fill text-yellow-500"></i>
                  </div>
                </div>
              </div>

              <div>
                <p>
                  {{ selectedProduct.description }}
                </p>
              </div>
            </div>
          </Dialog>
        </DataTable>
      </div>
      <div class="card rounded-md bg-white p-5 mt-8">
        <div class="flex justify-between items-center mb-6">
          <div class="font-semibold text-xl">Best Selling Products</div>
        </div>
        <ul class="list-none p-0 m-0">
          <li
            class="flex flex-col md:flex-row md:items-center md:justify-between mb-6"
          >
            <div>
              <span
                class="text-surface-900 dark:text-surface-0 font-medium mr-2 mb-1 md:mb-0"
                >Aston Martin DB5
              </span>
              <div class="mt-1 text-muted-color">Scale Cars</div>
            </div>
            <div class="mt-2 md:mt-0 flex items-center">
              <div
                class="border-orange-500 rounded-full border-[1px] overflow-hidden w-40 lg:w-24"
                style="height: 8px"
              >
                <div class="bg-orange-500 h-full" style="width: 50%"></div>
              </div>
              <span class="text-orange-500 ml-4 font-medium">%50</span>
            </div>
          </li>
          <li
            class="flex flex-col md:flex-row md:items-center md:justify-between mb-6"
          >
            <div>
              <span
                class="text-surface-900 dark:text-surface-0 font-medium mr-2 mb-1 md:mb-0"
                >Brush Barrels</span
              >
              <div class="mt-1 text-muted-color">Scale Parts</div>
            </div>
            <div class="mt-2 md:mt-0 ml-0 md:ml-20 flex items-center">
              <div
                class="border-cyan-500 rounded-full border-[1px] overflow-hidden w-40 lg:w-24"
                style="height: 8px"
              >
                <div class="bg-cyan-500 h-full" style="width: 84%"></div>
              </div>
              <span class="text-cyan-500 ml-4 font-medium">%84</span>
            </div>
          </li>
          <li
            class="flex flex-col md:flex-row md:items-center md:justify-between mb-6"
          >
            <div>
              <span
                class="text-surface-900 dark:text-surface-0 font-medium mr-2 mb-1 md:mb-0"
                >Oversized Crystal Case</span
              >
              <div class="mt-1 text-muted-color">Display Cases</div>
            </div>
            <div class="mt-2 md:mt-0 ml-0 md:ml-20 flex items-center">
              <div
                class="border-pink-500 rounded-full border-[1px] overflow-hidden w-40 lg:w-24"
                style="height: 8px"
              >
                <div class="bg-pink-500 h-full" style="width: 67%"></div>
              </div>
              <span class="text-pink-500 ml-4 font-medium">%67</span>
            </div>
          </li>
          <li
            class="flex flex-col md:flex-row md:items-center md:justify-between mb-6"
          >
            <div>
              <span
                class="text-surface-900 dark:text-surface-0 font-medium mr-2 mb-1 md:mb-0"
                >9" CrossOver Straight Track</span
              >
              <div class="mt-1 text-muted-color">Scale Track</div>
            </div>
            <div class="mt-2 md:mt-0 ml-0 md:ml-20 flex items-center">
              <div
                class="border-green-500 rounded-full border-[1px] overflow-hidden w-40 lg:w-24"
                style="height: 8px"
              >
                <div class="bg-green-500 h-full" style="width: 35%"></div>
              </div>
              <span class="text-green-500 ml-4 font-medium">%35</span>
            </div>
          </li>
        </ul>
      </div>
    </div>
    <div class="col-span-12 xl:col-span-6">
      <div class="card bg-white p-5 rounded-md mb-8">
        <div class="font-semibold text-xl mb-4">Revenue Stream</div>
        <Chart
          type="bar"
          :data="chartData"
          :options="chartOptions"
          class="h-80"
        />
      </div>
      <div class="card bg-white p-5 rounded-md">
        <div class="flex items-center justify-between mb-6">
          <div class="font-semibold text-xl">Notifications</div>
        </div>

        <span class="block text-muted-color font-medium mb-4">TODAY</span>
        <ul class="p-0 mx-0 mt-0 mb-6 list-none">
          <li class="flex items-center py-2 border-b border-surface">
            <div
              class="w-12 h-12 flex items-center justify-center bg-blue-100 dark:bg-blue-400/10 rounded-full mr-4 shrink-0"
            >
              <i class="pi pi-dollar !text-xl text-blue-500"></i>
            </div>
            <span class="text-surface-900 dark:text-surface-0 leading-normal"
              >Richard Jones
              <span class="text-surface-700 dark:text-surface-100"
                >has purchased a Billet T Boss for
                <span class="text-green-500 font-bold">R89.00</span></span
              >
            </span>
          </li>
        </ul>

        <span class="block text-muted-color font-medium mb-4">YESTERDAY</span>
        <ul class="p-0 m-0 list-none mb-6">
          <li class="flex items-center py-2 border-b border-surface">
            <div
              class="w-12 h-12 flex items-center justify-center bg-blue-100 dark:bg-blue-400/10 rounded-full mr-4 shrink-0"
            >
              <i class="pi pi-dollar !text-xl text-blue-500"></i>
            </div>
            <span class="text-surface-900 dark:text-surface-0 leading-normal"
              >John Doe
              <span class="text-surface-700 dark:text-surface-100"
                >has purchased an Aston Martin DB5 for
                <span class="text-green-500 font-bold">R1149.00</span></span
              >
            </span>
          </li>
          <li class="flex items-center py-2 border-b border-surface">
            <div
              class="w-12 h-12 flex items-center justify-center bg-pink-100 dark:bg-pink-400/10 rounded-full mr-4 shrink-0"
            >
              <i class="pi pi-question !text-xl text-pink-500"></i>
            </div>
            <span class="text-surface-900 dark:text-surface-0 leading-normal"
              >Jane Davis
              <span class="text-surface-700 dark:text-surface-100"
                >has posted a new questions about your product.</span
              >
            </span>
          </li>
        </ul>
        <span class="block text-muted-color font-medium mb-4">LAST WEEK</span>
        <ul class="p-0 m-0 list-none">
          <li class="flex items-center py-2 border-b border-surface">
            <div
              class="w-12 h-12 flex items-center justify-center bg-green-100 dark:bg-green-400/10 rounded-full mr-4 shrink-0"
            >
              <i class="pi pi-arrow-up !text-xl text-green-500"></i>
            </div>
            <span class="text-surface-900 dark:text-surface-0 leading-normal"
              >Your revenue has increased by
              <span class="text-green-500 font-bold">%25</span>.</span
            >
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>
