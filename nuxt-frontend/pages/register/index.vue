<script setup lang="ts">
import { ref } from "vue";

const userEmail = ref("");
const password = ref("");
const confirmPassword = ref("");
const passwordCheck = ref(true);
const errorMessage = ref("");

const checkPasswordMatches = () => {
  if (password.value === confirmPassword.value) {
    if (password.value.length === 0 || confirmPassword.value.length === 0) {
      errorMessage.value = "Please fill in both passwords.";
      passwordCheck.value = false;
    } else {
      passwordCheck.value = true;
    }
  } else {
    if (password.value.length === 0 || confirmPassword.value.length === 0) {
      errorMessage.value = "Please fill in both passwords.";
      passwordCheck.value = false;
    } else {
      errorMessage.value = "Passwords do not match.";
      passwordCheck.value = false;
    }
  }
};
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
              <Password
                placeholder="..........."
                v-model="password"
                id="password"
                toggleMask
                fluid
              >
                <template #header>
                  <div class="font-semibold text-xm mb-4">Pick a password</div>
                </template>
                <template #footer>
                  <Divider />
                  <ul class="pl-2 ml-2 my-0 leading-normal">
                    <li>At least one lowercase</li>
                    <li>At least one uppercase</li>
                    <li>At least one numeric</li>
                    <li>Minimum 8 characters</li>
                  </ul>
                </template>
              </Password>
            </div>
            <div class="flex flex-col gap-1 w-full">
              <small class="font-semibold">Confirm Password</small>
              <Password
                placeholder="..........."
                v-model="confirmPassword"
                id="confirm_password"
                :feedback="false"
                toggleMask
                fluid
              />
              <small class="text-red-500" v-if="!passwordCheck.valueOf()">{{
                errorMessage
              }}</small>
            </div>
            <div class="w-full">
              <Button
                label="Sign Up"
                class="w-full"
                @click="checkPasswordMatches"
              />
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
              >Already have an account?
              <NuxtLink class="underline" to="/login">Login</NuxtLink>
            </small>
          </div>
        </template>
      </Card>
    </div>
  </div>
</template>
