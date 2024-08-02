<script setup lang="ts">
import { ref } from "vue";

const userEmail = ref("");
const password = ref("");
</script>

<template>
  <div
    class="w-full h-screen flex flex-col justify-center items-center p-4 bg-slate-200"
  >
    <div class="self-center">
      <Card style="width: 23rem">
        <template #title>
          <h1 class="text-center text-2xl">Smart Complex</h1>
        </template>
        <template #content>
          <div class="flex flex-col gap-4 items-center justify-between">
            <div class="flex flex-col gap-1 w-full">
              <small class="font-semibold">Email</small>
              <InputText
                placeholder="user@example.com"
                type="email"
                id="email"
                v-model="userEmail"
                class="w-full"
              />
            </div>
            <div class="flex flex-col gap-1 w-full">
              <small class="font-semibold">Password</small>
              <div class="w-full">
                <Password
                  v-model="password"
                  toggleMask
                  fluid
                  :feedback="false"
                />
              </div>
            </div>
            <div class="w-full">
              <div class="flex flex-col gap-2 items-center justify-between">
                <Button label="Log in" class="w-full" />
                <small>
                  Forgot Password?
                  <NuxtLink to="/forgot-password" class="underline"
                    >Reset</NuxtLink
                  >
                </small>
              </div>
              <Divider align="center" type="solid">
                <b>or</b>
              </Divider>
              <Button
                label="Continue with"
                icon="pi pi-google"
                iconPos="right"
                class="w-full"
              />
            </div>
          </div>
        </template>
        <template #footer>
          <div class="flex flex-row justify-between items-center w-full mt-4">
            <small
              >Don't have an account?
              <NuxtLink class="underline" to="/register"
                >Register</NuxtLink
              ></small
            >
          </div>
        </template>
      </Card>
    </div>
  </div>
</template>
