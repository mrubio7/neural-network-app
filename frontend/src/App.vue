<script lang="ts" setup>
import Button from 'primevue/button';
import Layout from './pages/Layout.vue';
import Toast from 'primevue/toast';
import { BrowserOpenURL } from '../wailsjs/runtime/runtime';
import { AppVersion } from './main';

const handleClickCreatedBy = () => {
	BrowserOpenURL("https://www.linkedin.com/in/mrubioa/");
}
</script>


<template>
	<Toast />
	<div class="h-full static">
		<Layout/>
	</div>
	<footer class="bg-neutral-900 fixed bottom-0 w-full flex justify-between p-1 items-center">
		<Button @click="handleClickCreatedBy" size="small" class="text-xs" severity="secondary" text label="Created by" />
		<a @click="handleClickCreatedBy" class="text-sm text-neutral-400 mr-2">Made with <i class="pi pi-heart-fill" style="font-size: 0.8rem"></i></a>
		<span class="text-xs text-neutral-400 mr-2">{{AppVersion}}</span>
	</footer>
</template>

<style>

</style>
