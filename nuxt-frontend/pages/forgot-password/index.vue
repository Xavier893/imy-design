<script setup lang="ts">
import { ref } from "vue";
import { useToast } from "primevue/usetoast";

const toast = useToast();
const userEmail = ref("");
const emailExists = ref(true);
const showResetPassword = ref(false);
const showThirdCard = ref(false);
const password = ref("");
const confirmPassword = ref("");
const passwordCheck = ref(true);

const checkPasswordMatches = () => {
  if (password.value === confirmPassword.value) {
    passwordCheck.value = true;
    toast.add({
      severity: "success",
      summary: "Password Reset",
      detail: "Your password has been successfully reset.",
      life: 3000,
    });

    setTimeout(() => {
      showThirdCard.value = true;
      showResetPassword.value = false;
    }, 3000);
  } else {
    passwordCheck.value = false;
  }
};

const showSuccess = () => {
  if (userEmail.value !== "") {
    emailExists.value = true;
    toast.add({
      severity: "secondary",
      summary: "Email Sent",
      detail: `A password reset link has been sent to ${userEmail.value}`,
      life: 3000,
      styleClass: "bg-indigo-500",
    });

    setTimeout(() => {
      showResetPassword.value = true;
    }, 3000);
  } else {
    emailExists.value = false;
  }
};
</script>

<template>
  <div
    class="w-full h-screen flex flex-col justify-center items-center p-4 bg-slate-200"
  >
    <Toast />
    <Card v-if="!showResetPassword && !showThirdCard" style="width: 23rem">
      <template #title>
        <h1 class="text-2xl text-center">Forgot Password?</h1>
      </template>
      <template #subtitle>
        <p class="text-center">
          No worries, we'll send you reset instructions.
        </p>
      </template>
      <template #content>
        <div class="flex flex-col items-center justify-between gap-5 mt-5">
          <div class="flex flex-col gap-1 w-full">
            <small class="font-semibold">Email</small>
            <InputText
              placeholder="user@example.com"
              type="email"
              variant="filled"
              id="email"
              v-model="userEmail"
              class="w-full"
            />
          </div>
          <small v-if="!emailExists.valueOf()" class="text-red-500"
            >Please enter your email address.</small
          >
          <Button label="Reset Password" fluid @click="showSuccess" />
        </div>
      </template>
      <template #footer>
        <div class="flex flex-row justify-center items-center mt-5">
          <NuxtLink to="/login">
            <Button
              icon="pi pi-arrow-left"
              label="Back to log in"
              text
              severity="secondary"
            />
          </NuxtLink>
        </div>
      </template>
    </Card>

    <Card v-if="showResetPassword && !showThirdCard" style="width: 23rem">
      <template #title>
        <h1 class="text-2xl text-center">Set new password</h1>
      </template>
      <template #subtitle>
        <p class="text-center">
          Your new password must be different to previously used passwords.
        </p>
      </template>
      <template #content>
        <div
          class="flex flex-col justify-between items-center w-full gap-4 mt-4"
        >
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
            <small class="text-red-500" v-if="!passwordCheck.valueOf()"
              >Passwords do not match</small
            >
          </div>
          <Button
            label="Reset Password"
            class="w-full"
            @click="checkPasswordMatches"
          />
        </div>
      </template>
      <template #footer>
        <div class="flex flex-row justify-center items-center mt-5">
          <NuxtLink to="/login">
            <Button
              icon="pi pi-arrow-left"
              label="Back to log in"
              text
              severity="secondary"
            />
          </NuxtLink>
        </div>
      </template>
    </Card>

    <Card v-if="showThirdCard" style="width: 23rem">
      <template #title>
        <h1 class="text-2xl text-center">Password reset</h1>
      </template>
      <template #subtitle>
        <p class="text-center">
          Your password has been successfully reset. Click below to log in
          magically.
        </p>
      </template>
      <template #content>
        <div
          class="flex flex-col w-full items-center justify-between gap-5 mt-5"
        >
          <NuxtLink class="w-full" to="/">
            <Button label="Continue" fluid class="w-full" />
          </NuxtLink>
        </div>
      </template>
      <template #footer>
        <div class="flex flex-row justify-center items-center mt-5">
          <NuxtLink to="/login">
            <Button
              icon="pi pi-arrow-left"
              label="Back to log in"
              text
              severity="secondary"
            />
          </NuxtLink>
        </div>
      </template>
    </Card>
  </div>
</template>
