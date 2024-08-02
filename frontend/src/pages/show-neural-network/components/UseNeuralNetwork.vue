<script setup lang="ts">
import { ref } from 'vue';
import FloatLabel from 'primevue/floatlabel';
import Button from 'primevue/button';
import InputNumber from 'primevue/inputnumber';
import NewNeuralNetworkState from '../../new-neural-network/store/state';
import { Predict } from '../../../../wailsjs/go/main/App';
import InputText from 'primevue/inputtext';

//Globals
const inputHeaders = ref(NewNeuralNetworkState.file_headers.filter((_:any, index:number) => index !== NewNeuralNetworkState.index_target))
const targetHeader = ref(NewNeuralNetworkState.file_headers[NewNeuralNetworkState.index_target])
const name = ref(NewNeuralNetworkState.file_name)

//Refs
const inputs = ref<number[]>([])
const result = ref<number[]>()

//Methods
const handlePredict = async () => {
    const inputStrings = inputs.value.map(num => num.toString())
    const res = await Predict(inputStrings)
    result.value = res
}
</script>

<template>
    <section>
        <div class="flex flex-col items-start gap-10 rounded-lg border border-neutral-700 bg-neutral-900 p-4">
            <div class="mx-2 text-xl text-center font-semibold w-full text-neutral-400">{{ name }}</div>
            <span class="mx-2 text-md -mb-4">Campos de entrada</span>
            <div class="flex justify-between gap-4 w-full">
                <div v-for="(header, index) in inputHeaders" class="flex w-full">
                    <FloatLabel class="w-full">
                        <InputNumber fluid v-model="inputs[index]" :useGrouping="false" :minFractionDigits="0" :maxFractionDigits="6"/>
                        <label>{{ header }}</label>
                    </FloatLabel>
                </div>
            </div>
            <Button label="Predecir" severity="success" outlined @click="handlePredict" fluid/>
            <div class="flex justify-between gap-4 w-full items-center">
                <div class="flex">
                    <span class="mx-2 text-md text-left">Predicción</span>
                </div>
                <InputText fluid v-model="result" readonly/>
            </div>
        </div>
    </section>
</template>