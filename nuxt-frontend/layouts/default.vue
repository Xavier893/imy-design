<template>
  <div class="w-full bg-slate-100 min-h-screen">
    <Navbar />
    <div class="w-full p-5">
      <slot />
    </div>
  </div>
</template>

<script setup>
import Navbar from "~/components/Navbar.vue";
</script>
