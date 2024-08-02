<script setup lang="ts">
import { ref } from 'vue';

const userEmail = ref('');
const password = ref('');
const showPassword = ref(false);

const togglePasswordVisibility = () => {
  showPassword.value = !showPassword.value;
};
</script>

<template>
  <div class="w-full h-screen flex flex-col justify-center items-center p-4 bg-slate-100">
    <div class="self-center">
      <Card style="width: 23rem;">
        <template #title>
          <h1 class="text-center text-2xl">Smart Complex</h1>
        </template>
        <template #content>
          <div class="flex flex-col gap-6 items-center justify-between">
            <div class="flex flex-col gap-2 w-full">
              <label for="email">Email</label>
              <InputText placeholder="user@example.com" type="email" id="email" v-model="userEmail" class="w-full" />
            </div>
            <div class="flex flex-col gap-2 w-full">
              <label for="password">Password</label>
              <div class="w-full relative">
                <InputText placeholder="Password" id="password" :type="showPassword ? 'text' : 'password'"
                  v-model="password" :feedback="false" class="w-full pr-10" />
                <i :class="showPassword ? 'pi pi-eye-slash' : 'pi pi-eye'" class="absolute right-3 top-3 cursor-pointer"
                  @click="togglePasswordVisibility"></i>
              </div>
            </div>
            <div class="w-full">
              <Button label="Log in" class="w-full" />
              <Divider align="center" type="solid">
                <b>or</b>
              </Divider>
              <Button label="Continue with" icon="pi pi-google" iconPos="right" class="w-full" />
            </div>
          </div>
        </template>
        <template #footer>
          <div class="text-center">
            <p>
              Forgot Password? <span class="underline cursor-pointer">Reset</span>
            </p>
          </div>
        </template>
      </Card>
    </div>
  </div>
</template>