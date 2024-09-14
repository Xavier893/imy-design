<script setup>
import { getProducts } from "@/services/ProductService";
import { FilterMatchMode } from "@primevue/core/api";
import { useToast } from "primevue/usetoast";
import { onMounted, ref } from "vue";

onMounted(() => {
  products.value = getProducts();
});

const toast = useToast();
const dt = ref();
const products = ref();
const productDialog = ref(false);
const deleteProductDialog = ref(false);
const deleteProductsDialog = ref(false);
const product = ref({});
const selectedProducts = ref();
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

function formatCurrency(value) {
  return `R${value}`;
}

function openNew() {
  product.value = {};
  submitted.value = false;
  productDialog.value = true;
}

function hideDialog() {
  productDialog.value = false;
  submitted.value = false;
}

const id = ref("");
const link = ref("");

function saveProduct() {
  submitted.value = true;

  if (product?.value.name?.trim()) {
    if (product.value.id) {
      product.value.inventoryStatus = product.value.inventoryStatus.value
        ? product.value.inventoryStatus.value
        : product.value.inventoryStatus;
      product.value.name = product.value.name;
      product.value.link = product.value.link;
      product.value.availabilityDate = date.value.toLocaleDateString("en-GB");
      products.value[findIndexById(product.value.id)] = product.value;
      toast.add({
        severity: "success",
        summary: "Successful",
        detail: "Product Updated",
        life: 3000,
      });
    } else {
      product.value.id = id.value;
      product.value.image = "product-placeholder.svg";
      product.value.inventoryStatus = product.value.inventoryStatus
        ? product.value.inventoryStatus.value
        : "INSTOCK";
      product.value.availabilityDate = date.value.toLocaleDateString("en-GB");
      product.value.brand = product.value.brand;
      product.value.link = product.value.link;
      products.value.push(product.value);
      toast.add({
        severity: "success",
        summary: "Successful",
        detail: "Product Created",
        life: 3000,
      });
    }

    productDialog.value = false;
    product.value = {};
  }

  console.log(date.value.toLocaleDateString("en-GB"));
}

function editProduct(prod) {
  product.value = { ...prod };
  productDialog.value = true;
}

function confirmDeleteProduct(prod) {
  product.value = prod;
  deleteProductDialog.value = true;
}

function deleteProduct() {
  products.value = products.value.filter((val) => val.id !== product.value.id);
  deleteProductDialog.value = false;
  product.value = {};
  toast.add({
    severity: "success",
    summary: "Successful",
    detail: "Product Deleted",
    life: 3000,
  });
}

function findIndexById(id) {
  let index = -1;
  for (let i = 0; i < products.value.length; i++) {
    if (products.value[i].id === id) {
      index = i;
      break;
    }
  }

  return index;
}

function createId() {
  const count = products.value.length;
  return count + 1;
}

function exportCSV() {
  dt.value.exportCSV();
}

function confirmDeleteSelected() {
  deleteProductsDialog.value = true;
}

function deleteSelectedProducts() {
  products.value = products.value.filter(
    (val) => !selectedProducts.value.includes(val),
  );
  deleteProductsDialog.value = false;
  selectedProducts.value = null;
  toast.add({
    severity: "success",
    summary: "Successful",
    detail: "Products Deleted",
    life: 3000,
  });
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

const brand = ref("");

const onAdvancedUpload = () => {
  toast.add({
    severity: "info",
    summary: "Success",
    detail: "File Uploaded",
    life: 3000,
  });
};
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
      :style="{ width: '450px' }"
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
          <label for="id" class="block font-bold mb-3">ID</label>
          <InputText id="id" v-model="id" fluid />
        </div>

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
        <Button label="Cancel" icon="pi pi-times" text @click="hideDialog" />
        <Button label="Save" icon="pi pi-check" @click="saveProduct" />
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
          icon="pi pi-times"
          text
          @click="deleteProductDialog = false"
        />
        <Button label="Yes" icon="pi pi-check" @click="deleteProduct" />
      </template>
    </Dialog>

    <Dialog
      v-model:visible="deleteProductsDialog"
      :style="{ width: '450px' }"
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
          icon="pi pi-times"
          text
          @click="deleteProductsDialog = false"
        />
        <Button
          label="Yes"
          icon="pi pi-check"
          text
          @click="deleteSelectedProducts"
        />
      </template>
    </Dialog>
    <Toast />
  </div>
</template>
