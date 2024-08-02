<script setup lang="ts">
    import Menubar from 'primevue/menubar';
    import Button from 'primevue/button';
    import { RouterLink, RouterView } from 'vue-router';

    import { ref } from "vue";
    import { PathRoutes } from '../router';

    const items = ref([
        {
            label: 'Home',
            icon: 'pi pi-home',
            to: PathRoutes.Home,
        },
    ]);
</script>

<template>
    <Menubar :model="items" class="p-menubar-layout">
        <template #start>
            
        </template>
        <template #item="{ item, props, hasSubmenu, root }">
            <RouterLink :to="item.to">
                <Button size="small" text severity="secondary" class="flex">
                    <span :class="item.icon" class=""/>
                </Button>
            </RouterLink>
        </template>
        <template #end>
            <div class="flex items-center gap-2">
                <RouterLink :to="PathRoutes.NewNeuralNetwork">
                    <Button size="small" icon="pi pi-plus" label="Nuevo" outlined></Button>
                </RouterLink>
            </div>
        </template>
    </Menubar>
    <section class="p-10 pb-12 h-max">
        <RouterView />
    </section>
</template>

<style>
.p-menubar-layout {
    border-top: 0px solid transparent !important;
    border-left: 0px solid transparent !important;
    border-right: 0px solid transparent !important;
    border-bottom: 0px solid transparent !important;
    box-shadow: rgba(0, 0, 0, 0.16) 0px 1px 4px !important;
    border-radius: 0 !important;
}
</style>