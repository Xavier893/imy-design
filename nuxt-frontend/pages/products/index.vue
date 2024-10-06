<script setup>
import { ref, onMounted } from "vue";
import { getProducts } from "~/services/ProductService";
import { useToast } from "primevue/usetoast";

onMounted(() => {
	products.value = getProducts();
	filteredProducts.value = products.value;
	products.value.forEach((product) => {
		loadingState.value[product.id] = false;
	});
});

const toast = useToast();
const layout = ref("list");
const options = ref(["list", "grid"]);
const products = ref();
const filteredProducts = ref([]);
const searchQuery = ref("");
const categoryFilter = ref(null);
const loadingState = ref({});
const visible = ref(false);
const selectedProduct = ref(null);

const categories = ref([
	{ label: "Scale Cars", value: "Scale Cars" },
	{ label: "Scale Track", value: "Scale Track" },
	{ label: "Scale Parts", value: "Scale Parts" },
	{ label: "Display Cases", value: "Display Cases" },
]);

// Watch for changes in searchQuery and categoryFilter and update filteredProducts
watch([searchQuery, categoryFilter], () => {
	filteredProducts.value = products.value.filter((product) => {
		const matchesQuery = product.name
			.toLowerCase()
			.includes(searchQuery.value.toLowerCase());
		const matchesCategory = categoryFilter.value
			? product.category === categoryFilter.value.value
			: true;
		return matchesQuery && matchesCategory;
	});
});

const getInventoryStatus = (item) => {
	if (item.inventoryStatus === "INSTOCK") return "success";
	if (item.inventoryStatus === "LOWSTOCK") return "warn";
	return "danger";
};

const handleBuyNow = (product) => {
	loadingState.value[product.id] = true;

	setTimeout(() => {
		loadingState.value[product.id] = false;
		toast.add({
			severity: "info",
			summary: "Added to Cart",
			detail: `${product.name} has been added to your cart.`,
			life: 3000,
		});
	}, 1000);
};

const handleProductClick = (product) => {
	visible.value = true;
	selectedProduct.value = product;
};
</script>

<template>
	<div>
		<Toast />
		<Dialog
			v-model:visible="visible"
			modal
			dismissableMask
			header="Product Information"
			:style="{ width: '35rem' }"
		>
			<div class="flex flex-col gap-4 justify-between items-start">
				<div class="w-full h-[200px]">
					<img
						class="rounded w-full h-full object-contain"
						:src="`${selectedProduct.image}`"
						:alt="selectedProduct.name"
					/>
				</div>

				<div class="flex flex-row w-full justify-between items-start gap-2">
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
		<DataView
			:value="filteredProducts"
			:layout="layout"
			paginator
			:rows="layout === 'grid' ? 8 : 5"
		>
			<template #header>
				<div class="flex flex-col md:flex-row justify-between items-center">
					<div
						class="flex flex-col md:flex-row items-center justify-between gap-2"
					>
						<InputText
							v-model="searchQuery"
							placeholder="Search for a product..."
							class="w-80"
						/>
						<Select
							v-model="categoryFilter"
							showClear
							:options="categories"
							optionLabel="label"
							placeholder="Select a Category"
						/>
					</div>
					<SelectButton v-model="layout" :options="options" :allowEmpty="false">
						<template #option="{ option }">
							<i :class="[option === 'list' ? 'pi pi-bars' : 'pi pi-table']" />
						</template>
					</SelectButton>
				</div>
			</template>

			<template #list="slotProps">
				<div class="flex flex-col">
					<div v-for="(item, index) in slotProps.items" :key="index">
						<div
							class="flex flex-col sm:flex-row sm:items-center p-6 gap-2 cursor-pointer hover:bg-gray-50"
							:class="{
								'border-t border-surface-200 dark:border-surface-700':
									index !== 0,
							}"
							@click="
								handleProductClick(item);
								visible = true;
							"
						>
							<div class="md:w-40 relative h-[150px]">
								<img
									class="block xl:block mx-auto rounded w-full h-full object-contain"
									:src="`${item.image}`"
									:alt="item.name"
								/>
								<Tag
									:value="item.inventoryStatus"
									:severity="getInventoryStatus(item)"
									class="absolute dark:!bg-surface-900"
									style="left: 4px; top: 4px"
								></Tag>
							</div>
							<div
								class="flex flex-col md:flex-row justify-between md:items-center flex-1 gap-6"
							>
								<div
									class="flex flex-row md:flex-col justify-between items-start gap-2"
								>
									<div class="text-lg font-medium mt-2">{{ item.name }}</div>
									<div>
										<span class="font-medium text-gray-500 text-sm">{{
											item.category
										}}</span>
									</div>
									<div class="bg-surface-100 p-1" style="border-radius: 30px">
										<div
											class="bg-surface-0 rounded border-gray-300 border flex items-center gap-2 justify-center py-1 px-2"
										>
											<span class="text-surface-900 font-medium text-sm">{{
												item.rating
											}}</span>
											<i class="pi pi-star-fill text-yellow-500"></i>
										</div>
									</div>
								</div>
								<div class="flex flex-col md:items-end gap-8">
									<span class="text-xl font-semibold">R{{ item.price }}</span>
									<div class="flex flex-row-reverse md:flex-row gap-2">
										<Button
											:loading="loadingState[item.id]"
											@click.stop="handleBuyNow(item)"
											icon="pi pi-cart-plus"
											label="Add to Cart"
											:disabled="item.inventoryStatus === 'OUTOFSTOCK'"
											severity="info"
											class="flex-auto md:flex-initial whitespace-nowrap"
										></Button>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</template>

			<template #grid="slotProps">
				<div class="grid grid-cols-12 gap-2">
					<div
						v-for="(item, index) in slotProps.items"
						:key="index"
						class="col-span-12 sm:col-span-6 md:col-span-3 p-2"
					>
						<div
							class="p-6 border border-surface-200 dark:border-surface-700 bg-surface-0 dark:bg-surface-900 rounded flex flex-col hover:bg-gray-50 cursor-pointer"
							@click="handleProductClick(item)"
						>
							<div
								class="bg-surface-50 w-full h-[180px] flex justify-center rounded"
							>
								<div class="relative mx-auto w-full ow-md overflow-hidden">
									<img
										class="rounded h-full w-full object-contain"
										:src="`${item.image}`"
										:alt="item.name"
									/>

									<Tag
										:value="item.inventoryStatus"
										:severity="getInventoryStatus(item)"
										class="absolute dark:!bg-surface-900"
										style="left: 5px; top: 5px"
									></Tag>
								</div>
							</div>
							<div class="pt-6">
								<div class="flex flex-row justify-between items-start gap-2">
									<div>
										<div class="text-lg font-medium mt-1">{{ item.name }}</div>
										<span class="font-medium text-gray-500 text-sm">{{
											item.category
										}}</span>
									</div>
									<div class="bg-surface-100 p-1" style="border-radius: 30px">
										<div
											class="bg-surface-0 rounded border-gray-300 border flex items-center gap-2 justify-center py-1 px-2"
										>
											<span class="text-surface-900 font-medium text-sm">{{
												item.rating
											}}</span>
											<i class="pi pi-star-fill text-yellow-500"></i>
										</div>
									</div>
								</div>
								<div class="flex flex-col gap-6 mt-4">
									<span class="text-2xl font-semibold">R{{ item.price }}</span>
									<div class="flex gap-2">
										<Button
											icon="pi pi-cart-plus"
											:loading="loadingState[item.id]"
											@click.stop="handleBuyNow(item)"
											label="Add to Cart"
											severity="contrast"
											:disabled="item.inventoryStatus === 'OUTOFSTOCK'"
											class="flex-auto whitespace-nowrap"
										></Button>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</template>
		</DataView>
	</div>
</template>
