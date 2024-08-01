<script setup lang="ts">
import Panel from 'primevue/panel';
import InputNumber from 'primevue/inputnumber';
import { ref, watchEffect } from 'vue';
import NewNeuralNetworkState from '../store/state';

// Globals
const maxEpochs = 100000 //100k
const tooltips = {
    momFactor: "Factor de momentum utilizado para acelerar el aprendizaje y ayudar a evitar mínimos locales.",
    lrnRate: "Tasa de aprendizaje que determina el tamaño de los pasos en el ajuste de los pesos de la red neuronal.",
    epochs: "Número de veces que el conjunto de datos de entrenamiento pasa completamente por la red neuronal."
}

// Refs
const momFactor = ref(0.01)
const learningRate = ref(0.1)
const epochs = ref(1000)

// Setters to store
watchEffect(() => {
    NewNeuralNetworkState.nn_epochs = epochs.value
    NewNeuralNetworkState.nn_learning_rate = learningRate.value
    NewNeuralNetworkState.nn_momentum_factor = momFactor.value
})

</script>

<template>
    <Panel header="Configuración de entrenamiento">
        <div class="grid grid-cols-3 gap-4">
            <div class="flex flex-col my-2">
                <div class="flex items-center mb-1">
                    <span v-tooltip="tooltips.lrnRate" class="pi pi-info-circle mx-2 text-neutral-500"></span>
                    <span class="text-left">Tasa de apredizaje</span>
                </div>
                <InputNumber fluid showButtons v-model="learningRate" :step="0.01" :min="0" :max="1" :minFractionDigits="1" :maxFractionDigits="6" />
            </div>
            <div class="flex flex-col my-2">
                <div class="flex items-center mb-1">
                    <span v-tooltip="tooltips.momFactor" class="pi pi-info-circle mx-2 text-neutral-500"></span>
                    <span class="text-left">Factor momentum</span>
                </div>
                <InputNumber fluid showButtons v-model="momFactor" :step="0.001" :min="0" :max="1" :minFractionDigits="1" :maxFractionDigits="6" />
            </div>
            <div class="flex flex-col my-2">
                <div class="flex items-center mb-1">
                    <span v-tooltip="tooltips.epochs" class="pi pi-info-circle mx-2 text-neutral-500"></span>
                    <span class="text-left">Epochs / Iteraciones</span>
                </div>
                <InputNumber fluid showButtons v-model="epochs" mode="decimal" :step="100" :max="maxEpochs" :min="100"/>
            </div>
        </div>
    </Panel>
</template>