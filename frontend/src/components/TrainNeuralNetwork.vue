<script setup lang="ts">
    import FloatLabel from 'primevue/floatlabel';
    import Select from 'primevue/select';
    import Button from 'primevue/button'
    import InputNumber from 'primevue/inputnumber';
    import { isRef, ref, watchEffect, Ref } from 'vue';
    import MeasuredSquaredError from './MeasuredSquaredError.vue';
    import NeuralNetworkState from '../states/NeuralNetworkState';

    const props = defineProps({
        handleTrain: {
            type: Function,
            required: true,
        },
        isTraining: {
            type: Boolean,
            required: true
        },
        isTrained: {
            type: Boolean,
            required: true
        },
    })

    const momFactor = ref(0.01)
    const learningRate = ref(0.1)
    const epochs = ref(1000)
    
    watchEffect(() => {
        NeuralNetworkState.training.momentum_factor = momFactor.value
        NeuralNetworkState.training.learning_rate = learningRate.value
        NeuralNetworkState.training.epochs = epochs.value
    })

    const Tooltip = {
        LearningRate: "Ajuste de cuánto cambia la red neuronal tras cada error.",
        FactorMomentum: "Ayuda a mantener la dirección de los ajustes para evitar quedarse atascado.",
        Iteration: "Número de veces que la red revisa y ajusta usando todos los datos de entrenamiento."     
    }

</script>

<template>
    <section class="p-4 pt-8 bg-neutral-900 rounded-lg flex flex-col gap-8">
        <div class="flex gap-6 mt-2">
            <div class="w-full">
                <FloatLabel>
                    <div class="flex items-center">
                        <InputNumber v-model="learningRate" inputId="minmaxfraction" :minFractionDigits="1" :maxFractionDigits="5" :max="1" fluid />
                        <span v-tooltip.left="Tooltip.LearningRate" class="pi pi-info-circle ml-1 text-neutral-500"></span>
                    </div>
                    <label>Tasa de aprendizaje</label>
                </FloatLabel>
            </div>
            <div class="w-full">
                <FloatLabel>
                    <div class="flex items-center">
                        <InputNumber v-model="momFactor" inputId="minmaxfraction" :minFractionDigits="1" :maxFractionDigits="5" :max="1" fluid />
                        <span v-tooltip.left="Tooltip.FactorMomentum" class="pi pi-info-circle ml-1 text-neutral-500"></span>
                    </div>
                    <label>Factor del momentum</label>
                </FloatLabel>
            </div>
            <div class="w-full">
                <FloatLabel>
                    <div class="flex items-center">
                        <InputNumber v-model="epochs" inputId="withoutgrouping" :useGrouping="false" :min="100" :max="100000" fluid />
                        <span v-tooltip.left="Tooltip.Iteration" class="pi pi-info-circle ml-1 text-neutral-500"></span>
                    </div>
                    <label>Iteraciones</label>
                </FloatLabel>
            </div>
        </div>

        <Button v-if="!isTraining" @click="props.handleTrain" label="Entrenar" outlined severity="warn" icon="pi pi-cog" size="small"/>
        <Button v-if="isTraining" label="Entrenando" outlined severity="warn" icon="pi pi-cog pi-spin" size="small"/>

        <div v-if="isTraining || isTrained">
            <MeasuredSquaredError/>
        </div>
    </section>
</template>