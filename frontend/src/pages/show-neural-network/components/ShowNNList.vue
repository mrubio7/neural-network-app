<script setup lang="ts">
import Button from 'primevue/button';
import DataView from 'primevue/dataview';
import { Load, LoadModels } from '../../../../wailsjs/go/main/App';
import { onMounted, ref } from 'vue';
import Knob from 'primevue/knob';
import Avatar from 'primevue/avatar';
import Divider from 'primevue/divider';
import Tag from 'primevue/tag';
import NewNeuralNetworkState from '../../new-neural-network/store/state';
import router, { PathRoutes } from '../../../router';

//Refs
const models = ref()

// Methods
const handlerLoadModels = async () => {
    const res = await LoadModels()
    models.value = res
}

const handleUseModel = (item:any) => {
    Load(item.name)
    NewNeuralNetworkState.file_headers = item.headers
    NewNeuralNetworkState.index_target = item.indexTarget
    NewNeuralNetworkState.file_name = item.name
    router.push(PathRoutes.Use)
}

const getKnobColor = (rate:number) => {
    if (rate <= 60) {
            return '#991b1b'
    } else if (rate > 60 && rate <= 75) {
            return '#f97316'
    } else if (rate > 75 && rate <= 90) {
            return '#bef264'
    } else if (rate > 90) {
            return '#15803d'
    }
}

onMounted(() => {
    handlerLoadModels()
})
</script>

<template>
    <DataView :value="models" class="overflow-hidden">
        <template #header>
            <div class="flex justify-between">
                <span class="text-lg font-semibold">Modelos disponibles</span>
                <Button icon="pi pi-sync" outlined @click="handlerLoadModels" size="small"/>
            </div>
        </template>
        <template #list="slotProps">
            <div class="flex flex-col p-4">
                <div v-for="(item, index) in slotProps.items" :key="index">
                    <div>
                        <div class="flex justify-between gap-8 items-center p-4 hover:bg-stone-800 transition rounded">
                            <Knob v-model="item.accuracy" :size="50" label="" readonly :valueColor="getKnobColor(item.accuracy)" textColor="white" />
                            <div class="text-left w-3/12">
                                <span class="text-lg">{{ item.name }}</span>
                            </div>
                            <div class="flex gap-8 w-7/12 items-center">
                                <div class="">
                                    <Tag class="mx-2" v-for="input in item.headers.filter((_:any, index:number) => index !== item.indexTarget)" :value="input" />
                                </div>
                                <div class="">
                                    <Tag :value="item.headers[item.indexTarget]" severity="warn"/>
                                </div>
                            </div>
                            <div class="w-1/12">
                                <Button label="Usar" @click="handleUseModel(item)" />
                            </div>
                        </div>
                        <Divider v-if="index !== slotProps.items.length-1" />
                    </div>
                </div>
            </div>
        </template>
    </DataView>
</template>

<style>
.p-dataview {
    border-radius: 10px !important;
    border: solid 1px #404040 !important;
}
</style>