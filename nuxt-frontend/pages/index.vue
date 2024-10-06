<script setup>
import { ref, onMounted } from "vue";
import { getProducts } from "~/services/ProductService";
import { useToast } from "primevue/usetoast";
import { useCart } from "~/composables/useCart";

const { addToCart } = useCart();

onMounted(() => {
	products.value = getProducts();
	filteredProducts.value = products.value;
	products.value.forEach((product) => {
		loadingState.value[product.id] = false;
	});
	featuredProducts.value = [
		{
			id: 1,
			name: "'67 Ford Fairlane",
			image: "/prods/ford.jpg",
			price: 789,
			category: "Scale Cars",
			inventoryStatus: "OUTOFSTOCK",
			description: `This collector's item meets the highest standards currently demanded by slot car enthusiasts. It features a finely and authentically printed driver's figure, with each figure individually painted to match the specific vehicle. The car is compatible with all commercial track systems and comes fully assembled. Additionally, it is presented on a removable display base, protected by a clear acrylic dust cover, ensuring both functionality and elegant display.`,
			rating: 4.7,
		},
		{
			id: 3,
			name: "Brush Barrels",
			image: "/prods/barrels.jpg",
			price: 149,
			category: "Scale Parts",
			description: `Tyco chassis use brushes to make contact with the armature to allow it to turn. Though not often, there are times when the brush barrel(s) overheats and hits its melting point. This results in the requirement to replace the barrel that houses the brush.`,
			inventoryStatus: "INSTOCK",
			rating: 4.9,
		},
		{
			id: 7,
			name: "1989 Batmobile",
			image: "/prods/batmobile.jpg",
			price: 1749,
			description: `The 1989 Batmobile is equipped with a range of advanced features, including Spark Plug compatibility and Digital Plug readiness, making it adaptable to various systems. Its high-definition design is enhanced by Magnatraction, providing superior grip on the track. The Batmobile also boasts flashing lights, working rear lights, and functioning headlights, adding to its authenticity. Additionally, it comes with an easy-change guide blade, allowing for quick and effortless maintenance.`,
			category: "Scale Cars",
			inventoryStatus: "LOWSTOCK",
			rating: 4.4,
		},
		{
			id: 9,
			name: "Billet T Boss",
			image: "/prods/tboss.jpg",
			price: 89,
			description: `Billet Delrin T boss for all slot cars. This T boss replaces worn and wobbly stock gear bosses. The precision CNC machined T boss keeps gear mesh true and consistent resulting in faster lap times, Less wear and tear and cooler running temps.`,
			category: "Scale Parts",
			inventoryStatus: "INSTOCK",
			rating: 4.2,
		},
		{
			id: 8,
			name: "Audi R8 HH Police Car",
			image: "/prods/police.jpg",
			price: 999,
			description: `While not your average police car, the Audi R8 is surely something not many criminals would be able to escape from! This Scalextric version comes complete with both a siren and flashing police lights on the roof. Perfect for any aspiring law enforcement officer to test their mettle!`,
			category: "Scale Cars",
			inventoryStatus: "INSTOCK",
			rating: 4.1,
		},
	];
});

const toast = useToast();
const layout = ref("list");
const options = ref(["list", "grid"]);
const products = ref();
const featuredProducts = ref();
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
		addToCart(product);
	}, 1000);
};

const getFeaturedInventoryStatus = (status) => {
	if (status === "INSTOCK") return "success";
	if (status === "LOWSTOCK") return "warn";
	return "danger";
};

const handleProductClick = (product) => {
	visible.value = true;
	selectedProduct.value = product;
};

const responsiveOptions = ref([
	{
		breakpoint: "1400px",
		numVisible: 2,
		numScroll: 1,
	},
	{
		breakpoint: "1199px",
		numVisible: 3,
		numScroll: 1,
	},
	{
		breakpoint: "767px",
		numVisible: 2,
		numScroll: 1,
	},
	{
		breakpoint: "575px",
		numVisible: 1,
		numScroll: 1,
	},
]);

const featuredVisible = ref(false);
const animationDuration = ref(3000);

watch(visible, () => {
	if (visible.value) {
		animationDuration.value = 0;
		console.log("Animation Duration:", animationDuration.value);
	} else {
		animationDuration.value = 3000;
		console.log("Animation Duration:", animationDuration.value);
	}
});
</script>

<template>
	<div>
		<h1 class="header">Featured Products</h1>
		<!-- Carousel component for featured products -->
		<Carousel
			:value="featuredProducts"
			:numVisible="3"
			:responsiveOptions="responsiveOptions"
			:numScroll="1"
			circular
		>
			<template #item="slotProps">
				<div
					class="border border-surface-200 dark:border-surface-700 bg-white cursor-pointer rounded m-2 p-4 hover:bg-white hover:border-2 hover:border-gray-500 hover:transform hover:scale-[1.03] transition-transform"
					@click="handleProductClick(slotProps.data)"
				>
					<div class="mb-4 w-full">
						<div class="relative mx-auto">
							<img
								:src="slotProps.data.image"
								:alt="slotProps.data.name"
								class="w-full rounded h-[250px]"
								style="object-fit: cover"
							/>
							<Tag
								:value="slotProps.data.inventoryStatus"
								:severity="
									getFeaturedInventoryStatus(slotProps.data.inventoryStatus)
								"
								class="absolute"
								style="left: 5px; top: 5px"
							/>
						</div>
					</div>
					<div class="mb-4 font-medium">{{ slotProps.data.name }}</div>
					<div class="flex justify-between items-center">
						<div class="mt-0 font-semibold text-xl">
							R{{ slotProps.data.price }}
						</div>
						<span>
							<div
								class="bg-surface-0 rounded border-gray-300 border flex items-center gap-2 justify-center py-1 px-2"
							>
								<span class="text-surface-900 font-medium text-sm">{{
									slotProps.data.rating
								}}</span>
								<i class="pi pi-star-fill text-yellow-500"></i>
							</div>
						</span>
					</div>
				</div>

				<Dialog
					v-model:visible="featuredVisible"
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
								:src="`${slotProps.data.image}`"
								:alt="slotProps.data.name"
							/>
						</div>

						<div class="flex flex-row w-full justify-between items-start gap-2">
							<div>
								<div class="text-lg font-medium mt-1">
									{{ slotProps.data.name }}
								</div>
								<span class="font-medium text-gray-500 text-sm">{{
									slotProps.data.category
								}}</span>
							</div>
							<div class="bg-surface-100 p-1" style="border-radius: 30px">
								<div
									class="bg-surface-0 rounded border-gray-300 border flex items-center gap-2 justify-center py-1 px-2"
								>
									<span class="text-surface-900 font-medium text-sm">{{
										slotProps.data.rating
									}}</span>
									<i class="pi pi-star-fill text-yellow-500"></i>
								</div>
							</div>
						</div>

						<div>
							<p>
								{{ slotProps.data.description }}
							</p>
						</div>
					</div>
				</Dialog>
			</template>
		</Carousel>

		<h1 class="header">All Products</h1>
		<Toast />
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
							class="flex flex-col sm:flex-row sm:items-center p-6 gap-2 cursor-pointer hover:bg-white hover:shadow-md hover:border-2 hover:border-gray-500 hover:rounded-md hover:transform hover:scale-[1.03] transition-transform"
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
							class="p-6 border border-surface-200 dark:border-surface-700 bg-surface-0 dark:bg-surface-900 rounded flex flex-col hover:shadow-md hover:border-2 hover:border-gray-500 cursor-pointer hover:transform hover:scale-[1.03] transition-transform"
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
											severity="info"
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

<style scoped>
.header {
	font-size: 64px;
	margin-bottom: 1rem;
	font-family: "Bebas Neue", sans-serif;
}
</style>
