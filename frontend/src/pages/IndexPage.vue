<script setup lang="ts">
import Button from 'primevue/button';
import { LoadModels } from '../../wailsjs/go/main/App';
import { ref } from 'vue';

//Refs
const models = ref()

// Methods
const handlerLoadModels = async () => {
    const res = await LoadModels()
    models.value = res
}

</script>

<template>
    <div>
        <Button icon="pi pi-sync" @click="handlerLoadModels"/>
        <span v-for="model in models">
            {{ model }}
        </span>
    </div>
</template>