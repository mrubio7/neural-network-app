<script setup lang="ts">
import { ref } from 'vue';
import FloatLabel from 'primevue/floatlabel';
import Button from 'primevue/button';
import InputNumber from 'primevue/inputnumber';
import Knob from 'primevue/knob';
import NewNeuralNetworkState from '../../new-neural-network/store/state';
import { Predict } from '../../../../wailsjs/go/main/App';
import InputText from 'primevue/inputtext';
import { useToast } from 'primevue/usetoast';

//Globals
const toast = useToast()
const inputHeaders = ref(NewNeuralNetworkState.file_headers.filter((_:any, index:number) => index !== NewNeuralNetworkState.index_target))
const targetHeader = ref(NewNeuralNetworkState.file_headers[NewNeuralNetworkState.index_target])
const accuracy = ref(NewNeuralNetworkState.test_result)
const name = ref(NewNeuralNetworkState.file_name)

//Refs
const inputs = ref<number[]>([])
const result = ref<number[]>()

//Methods
const handlePredict = async () => {
    if (inputs.value.length === inputHeaders.value.length) {
        const inputStrings = inputs.value.map(num => num.toString())
        const res = await Predict(inputStrings)
        result.value = res
    } else {
        toast.add({summary:"No se puede predecir", detail:"Algún campo de entrada está sin rellenar", life:3000, severity:"warn", closable:true})
    }
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
</script>

<template>
    <section>
        <div class="flex flex-col items-start rounded-lg border border-neutral-700 bg-neutral-900 p-4 gap-4">
            <div class="grid grid-cols-3 w-full m-2">
                <span class="text-neutral-500 text-nowrap text-left">{{ targetHeader }}</span>
                <span class="text-xl text-center font-semibold w-full text-neutral-400">{{ name }}</span>
                <div class="flex justify-end pr-4">
                    <Knob v-model="accuracy" :size="50" label="" disabled :valueColor="getKnobColor(accuracy)" textColor="white" />
                </div>
            </div>
            <span class="mx-2 text-md">Campos de entrada</span>
            <div class="flex justify-between gap-4 w-full">
                <div v-for="(header, index) in inputHeaders" class="flex w-full">
                    <div class="w-full">
                        <div class="flex items-center mb-1">
                            <span class="text-left ml-2">{{ header }}:</span>
                        </div>
                        <InputNumber fluid v-model="inputs[index]" :useGrouping="false" :minFractionDigits="0" :maxFractionDigits="6" :placeholder="(Math.random() * 50).toFixed(2)" />
                    </div>
                </div>
            </div>
            <Button label="Predecir" severity="success" outlined @click="handlePredict" fluid/>
            <div class="flex justify-between gap-4 w-full items-center mt-6">
                <div class="flex flex-col">
                    <span class="mx-2 text-md text-left">Predicción de:</span>
                    <span class="ml-2 text-nowrap text-neutral-400">{{ targetHeader }}</span>
                </div>
                <InputText fluid v-model="result" readonly/>
            </div>
        </div>
    </section>
</template>