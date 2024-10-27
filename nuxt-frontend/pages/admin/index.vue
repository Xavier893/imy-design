<script setup>
import { FilterMatchMode } from "@primevue/core/api";
import { useToast } from "primevue/usetoast";
import { ref, onMounted } from "vue";
import { storeToRefs } from "pinia";
import { useProductStore } from "~/stores/ProductStore";

const store = useProductStore();
const { products } = storeToRefs(store);

const toast = useToast();
const dt = ref();
const productDialog = ref(false);
const deleteProductDialog = ref(false);
const deleteProductsDialog = ref(false);
const product = ref({});
const selectedProducts = ref([]);
const date = ref();
const filters = ref({
  global: { value: null, matchMode: FilterMatchMode.CONTAINS },
});
const submitted = ref(false);
const statuses = ref([
  { label: "INSTOCK", value: "INSTOCK" },
  { label: "LOWSTOCK", value: "LOWSTOCK" },
  { label: "OUTOFSTOCK", value: "OUTOFSTOCK" },
]);

onMounted(async () => {
  if (!store.isInitialized) {
    await store.initializeStore();
  }
});

function formatCurrency(value) {
  return `R${value}`;
}

function getStatusLabel(status) {
  switch (status) {
    case "INSTOCK":
      return "success";
    case "LOWSTOCK":
      return "warn";
    case "OUTOFSTOCK":
      return "danger";
    default:
      return null;
  }
}

function openNew() {
  product.value = {
    name: "",
    description: "",
    price: 0,
    inventoryStatus: null,
    category: null,
    brand: "",
    image: null,
  };
  submitted.value = false;
  productDialog.value = true;
}

function editProduct(prod) {
  product.value = { ...prod };
  date.value = new Date(prod.availabilityDate.split("/").reverse().join("-"));
  productDialog.value = true;
}

function hideDialog() {
  productDialog.value = false;
  submitted.value = false;
}

function saveProduct() {
  submitted.value = true;
  if (product.value.name?.trim()) {
    if (product.value.id) {
      store.updateProduct({
        ...product.value,
        inventoryStatus: product.value.inventoryStatus.value || "INSTOCK",
        availabilityDate: date.value
          ? date.value.toLocaleDateString("en-GB")
          : "",
      });
      toast.add({
        severity: "success",
        summary: "Product Updated",
        detail: "Product details updated.",
        life: 3000,
      });
    } else {
      store.addProduct({
        ...product.value,
        inventoryStatus: product.value.inventoryStatus.value,
        id: Date.now(),
        availabilityDate: date.value
          ? date.value.toLocaleDateString("en-GB")
          : "",
        image: "/prods/placeholder.png",
      });
      toast.add({
        severity: "success",
        summary: "Product Created",
        detail: "New product added.",
        life: 3000,
      });
    }
    productDialog.value = false;
    product.value = {};
    date.value = null;
  }
}

function confirmDeleteProduct(prod) {
  product.value = prod;
  deleteProductDialog.value = true;
}

function deleteProductById(product) {
  store.deleteProduct(product.id);
  deleteProductDialog.value = false;
  toast.add({
    severity: "success",
    summary: "Product Deleted",
    detail: "Product deleted successfully.",
    life: 3000,
  });
}

function confirmDeleteSelected(product) {
  deleteProductsDialog.value = true;
}

function deleteSelectedProducts() {
  selectedProducts.value.forEach((prod) => store.deleteProduct(prod.id));
  deleteProductsDialog.value = false;
  selectedProducts.value = null;
  toast.add({
    severity: "success",
    summary: "Products Deleted",
    detail: "Selected products deleted successfully.",
    life: 3000,
  });
}

function exportCSV() {
  dt.value.exportCSV();
}

definePageMeta({
  layout: "admin",
});
</script>

<template>
  <div>
    <div class="card">
      <Toolbar class="mb-6">
        <template #start>
          <Button
            label="New"
            icon="pi pi-plus"
            severity="secondary"
            class="mr-2"
            @click="openNew"
          />
          <Button
            label="Delete"
            icon="pi pi-trash"
            severity="secondary"
            @click="confirmDeleteSelected"
            :disabled="!selectedProducts || !selectedProducts.length"
          />
        </template>

        <template #end>
          <Button
            label="Export"
            icon="pi pi-upload"
            severity="secondary"
            @click="exportCSV($event)"
          />
        </template>
      </Toolbar>

      <DataTable
        ref="dt"
        v-model:selection="selectedProducts"
        :value="products"
        dataKey="id"
        :paginator="true"
        :rows="10"
        :filters="filters"
        stripedRows
        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
        :rowsPerPageOptions="[5, 10, 25]"
        currentPageReportTemplate="Showing {first} to {last} of {totalRecords} products"
      >
        <template #header>
          <div class="flex flex-wrap gap-2 items-center justify-between">
            <h4 class="m-0">Manage Products</h4>
            <IconField>
              <InputIcon>
                <i class="pi pi-search" />
              </InputIcon>
              <InputText
                v-model="filters['global'].value"
                placeholder="Search..."
              />
            </IconField>
          </div>
        </template>

        <Column
          selectionMode="multiple"
          style="width: 1rem"
          :exportable="false"
        ></Column>
        <Column
          field="id"
          header="ID"
          sortable
          style="min-width: 9rem"
        ></Column>
        <Column
          field="name"
          header="Name"
          sortable
          style="min-width: 12rem"
        ></Column>
        <Column
          style="min-width: 12rem"
          field="brand"
          header="Brand"
          sortable
        ></Column>
        <Column
          style="min-width: 12rem"
          field="link"
          header="Link"
          sortable
        ></Column>
        <Column header="Image">
          <template #body="slotProps">
            <img
              :src="`${slotProps.data.image}`"
              :alt="slotProps.data.image"
              class="rounded"
              style="width: 64px; height: 64px; object-fit: contain"
            />
          </template>
        </Column>
        <Column field="price" header="Price" sortable style="min-width: 8rem">
          <template #body="slotProps">
            {{ formatCurrency(slotProps.data.price) }}
          </template>
        </Column>
        <Column
          field="category"
          header="Category"
          sortable
          style="min-width: 10rem"
        ></Column>
        <Column
          field="inventoryStatus"
          header="Availability"
          sortable
          style="min-width: 12rem"
        >
          <template #body="slotProps">
            <Tag
              :value="slotProps.data.inventoryStatus"
              :severity="getStatusLabel(slotProps.data.inventoryStatus)"
            />
          </template>
        </Column>
        <Column
          field="availabilityDate"
          header="Availability Date"
          sortable
          style="min-width: 10rem"
        ></Column>
        <Column :exportable="false" style="min-width: 12rem">
          <template #body="slotProps">
            <Button
              icon="pi pi-pencil"
              style="border-color: #01b0ee; color: #01b0ee"
              outlined
              rounded
              class="mr-2"
              @click="editProduct(slotProps.data)"
            />
            <Button
              icon="pi pi-trash"
              outlined
              rounded
              severity="danger"
              @click="confirmDeleteProduct(slotProps.data)"
            />
          </template>
        </Column>
      </DataTable>
    </div>

    <Dialog
      v-model:visible="productDialog"
      class="w-[450px]"
      :style="{ 'font-family': 'Montserrat' }"
      header="Product Details"
      :modal="true"
    >
      <div class="flex flex-col gap-6">
        <img
          v-if="product.image"
          :src="`${product.image}`"
          :alt="product.image"
          class="block m-auto pb-4"
        />

        <div>
          <label for="name" class="block font-bold mb-3">Name</label>
          <InputText
            id="name"
            v-model.trim="product.name"
            required="true"
            :invalid="submitted && !product.name"
            fluid
          />
          <small v-if="submitted && !product.name" class="text-red-500"
            >Name is required.</small
          >
        </div>
        <div>
          <label for="description" class="block font-bold mb-3"
            >Description</label
          >
          <Textarea
            id="description"
            v-model="product.description"
            required="true"
            rows="3"
            cols="20"
            fluid
          />
        </div>
        <div>
          <label for="link" class="block font-bold mb-3">Link</label>
          <InputText id="link" v-model="product.link" fluid />
        </div>
        <div class="card">
          <Toast />
          <label for="upload" class="block font-bold mb-3"> Image </label>
          <FileUpload
            id="upload"
            name="demo"
            @upload="onAdvancedUpload($event)"
            accept="image/*"
            :maxFileSize="1000000"
            fileLimit="1"
          >
            <template #empty>
              <div class="p-4">
                <span>Drag and drop files to here to upload your image.</span>
              </div>
            </template>
          </FileUpload>
        </div>
        <div>
          <label for="inventoryStatus" class="block font-bold mb-3">
            Availability
          </label>
          <Select
            id="inventoryStatus"
            v-model="product.inventoryStatus"
            :options="statuses"
            optionLabel="label"
            placeholder="Select a Status"
            fluid
          ></Select>
        </div>

        <div>
          <label for="availabilityDate" class="block font-bold mb-3">
            Availability Date
          </label>
          <DatePicker
            id="availabilityDate"
            v-model="date"
            showButtonBar
            fluid
            dateFormat="dd/mm/yy"
          />
        </div>

        <div>
          <span class="block font-bold mb-4">Category</span>
          <div class="grid grid-cols-12 gap-4">
            <div class="flex items-center gap-2 col-span-6">
              <RadioButton
                id="category1"
                v-model="product.category"
                name="category"
                value="Scale Cars"
              />
              <label for="category1">Scale Cars</label>
            </div>
            <div class="flex items-center gap-2 col-span-6">
              <RadioButton
                id="category2"
                v-model="product.category"
                name="category"
                value="Scale Parts"
              />
              <label for="category2">Scale Parts</label>
            </div>
            <div class="flex items-center gap-2 col-span-6">
              <RadioButton
                id="category3"
                v-model="product.category"
                name="category"
                value="Scale Track"
              />
              <label for="category3">Scale Track</label>
            </div>
            <div class="flex items-center gap-2 col-span-6">
              <RadioButton
                id="category4"
                v-model="product.category"
                name="category"
                value="Display Cases"
              />
              <label for="category4">Display Cases</label>
            </div>
          </div>
        </div>

        <div class="grid grid-cols-12 gap-4">
          <div class="col-span-12">
            <label for="price" class="block font-bold mb-3">Price</label>
            <InputNumber
              id="price"
              v-model="product.price"
              mode="currency"
              currency="ZAR"
              locale="en-ZA"
              fluid
            />
          </div>
        </div>

        <div>
          <label for="brand" class="block font-bold mb-3"> Brand </label>
          <InputText id="brand" v-model="product.brand" fluid />
        </div>
      </div>

      <template #footer>
        <Button
          label="Cancel"
          severity="secondary"
          icon="pi pi-times"
          text
          @click="hideDialog"
        />
        <Button
          label="Save"
          style="background-color: #01b0ee; border-width: 0px"
          icon="pi pi-check"
          @click="saveProduct"
        />
      </template>
    </Dialog>

    <Dialog
      v-model:visible="deleteProductDialog"
      :style="{ width: '450px' }"
      header="Confirm"
      :modal="true"
    >
      <div class="flex items-center gap-4">
        <i class="pi pi-exclamation-triangle !text-3xl" />
        <span v-if="product"
          >Are you sure you want to delete <b>{{ product.name }}</b
          >?</span
        >
      </div>
      <template #footer>
        <Button
          label="No"
          severity="secondary"
          icon="pi pi-times"
          outlined
          @click="deleteProductDialog = false"
        />
        <Button
          label="Yes"
          icon="pi pi-check"
          severity="danger"
          @click="deleteProductById(product)"
        />
      </template>
    </Dialog>

    <Dialog
      v-model:visible="deleteProductsDialog"
      class="w-[450px]"
      :style="{ 'font-family': 'Montserrat' }"
      header="Confirm"
      :modal="true"
    >
      <div class="flex items-center gap-4">
        <i class="pi pi-exclamation-triangle !text-3xl" />
        <span v-if="product"
          >Are you sure you want to delete the selected products?</span
        >
      </div>
      <template #footer>
        <Button
          label="No"
          severity="secondary"
          icon="pi pi-times"
          outlined
          @click="deleteProductsDialog = false"
        />
        <Button
          label="Yes"
          icon="pi pi-check"
          severity="danger"
          @click="deleteSelectedProducts"
        />
      </template>
    </Dialog>
    <Toast />
  </div>
</template>
