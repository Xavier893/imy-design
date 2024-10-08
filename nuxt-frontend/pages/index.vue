<script setup lang="ts">
import { ref } from "vue";
import { useToast } from "primevue/usetoast";

const toast = useToast();
const userEmail = ref("");
const password = ref("");
const emailErrorMessage = ref("");
const passwordErrorMessage = ref("");
const formValid = ref(true);

const checkForm = () => {
	formValid.value = true;
	emailErrorMessage.value = "";
	passwordErrorMessage.value = "";

	if (!userEmail.value || !validateEmail(userEmail.value)) {
		formValid.value = false;
		emailErrorMessage.value = "Please provide a valid email.";
	}

	if (!password.value) {
		formValid.value = false;
		passwordErrorMessage.value = "Please provide a password.";
	} else if (password.value.length < 8) {
		formValid.value = false;
		passwordErrorMessage.value = "Please provide a valid password.";
	}

	console.log(formValid.value);

	if (formValid.value === true) {
		toast.add({
			severity: "success",
			summary: "Login Successful",
			detail: "You will be redirected to the Home page shortly...",
			life: 3000,
		});

		setTimeout(() => {
			navigateTo("/products");
		}, 3000);
	}
};

const validateEmail = (email: string) => {
	const re = /\S+@\S+\.\S+/;
	return re.test(email);
};

const loginWithGoogle = () => {
	toast.add({
		severity: "success",
		summary: "Google Login Successful",
		detail: "You will be redirected to the Home page shortly...",
		life: 3000,
	});

	setTimeout(() => {
		navigateTo("/products");
	}, 3000);
};

definePageMeta({
	layout: "auth",
});
</script>

<template>
	<div
		class="w-full min-h-screen flex flex-col justify-center items-center p-4 bg-slate-200 relative"
	>
		<Toast />
		<img
			src="/background.jpg"
			alt=""
			class="z-0 w-full h-full absolute object-cover"
		/>
		<div
			class="self-center z-10 relative flex flex-row items-center justify-center"
		>
			<div
				class="absolute -top-[50px] rounded-full bg-slate-200 w-[100px] h-[100px] overflow-hidden"
			>
				<img src="/newlogo.webp" alt="Logo" class="object-cover" />
			</div>
			<Card style="width: 23rem">
				<template #title>
					<h1 class="text-center text-2xl mt-12">Hustle Hobbies</h1>
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
							<small class="text-red-500" v-if="emailErrorMessage">{{
								emailErrorMessage
							}}</small>
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
							<small class="text-red-500" v-if="passwordErrorMessage">{{
								passwordErrorMessage
							}}</small>
						</div>
						<div class="w-full">
							<div class="flex flex-col gap-2 items-center justify-between">
								<Button
									label="Log in"
									style="background-color: #01b0ee; border-width: 0px"
									class="w-full"
									@click="checkForm"
								/>
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
								style="background-color: #01b0ee; border-width: 0px"
								icon="pi pi-google"
								iconPos="right"
								class="w-full"
								severity="info"
								@click="loginWithGoogle"
							/>
						</div>
					</div>
				</template>
				<template #footer>
					<div class="flex flex-row justify-center items-center w-full mt-4">
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
