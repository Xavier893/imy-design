<template>
	<div class="w-full bg-slate-100 min-h-screen">
		<Navbar />
		<div class="w-full p-16">
			<slot />
		</div>
		<ScrollTop
			:buttonProps="{ severity: 'contrast', raised: true, rounded: true }"
		/>
	</div>
</template>

<script setup>
import Navbar from "~/components/Navbar.vue";
</script>

<style scoped>
div {
	font-family: "Montserrat", sans-serif;
}
</style>
