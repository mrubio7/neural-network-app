<script setup lang="ts">
    import FormUploadFile from '../../components/FormUploadFile.vue';
    import Stepper from 'primevue/stepper';
    import StepList from 'primevue/steplist';
    import StepPanels from 'primevue/steppanels';
    import StepItem from 'primevue/stepitem';
    import Step from 'primevue/step';
    import StepPanel from 'primevue/steppanel';
    import Button from 'primevue/button';
    import ConfigurateNeuralNetwork from '../../components/ConfigureNeuralNetwork.vue';
    import TrainNeuralNetwork from '../../components/TrainNeuralNetwork.vue';
    import NeuralNetworkState from '../../states/NeuralNetworkState';
    import { ref, watchEffect } from 'vue';

    const isTraining = ref(false)
    const isTrained = ref(false)
    const selectors = ref()

    const handleSetSelectors = (goToNextStep:any) => {
        selectors.value = NeuralNetworkState.raw_data[0]
        goToNextStep()
    }
    
    const handleSetLayers = (goToNextStep:any) => {
        NeuralNetworkState.SetLayers()
        goToNextStep()
    }
    
    const handleTrain = () => {
        const setTrained = () => {
            isTrained.value = true
            isTraining.value = false
        }

        isTraining.value = true
        NeuralNetworkState.Train(setTrained);
    }

    watchEffect(() => {
        if (NeuralNetworkState.training.mse[NeuralNetworkState.training.mse.length - 1] === null) {
            isTraining.value = false
            isTrained.value = true
        }
    })
</script>

<template>
    <Stepper value="1">

        <StepList>
            <Step value="1">Cargar</Step>
            <Step disabled value="2">Configurar</Step>
            <Step disabled value="3">Entrenar</Step>
            <Step disabled value="4">Guardar</Step>
        </StepList>

        <StepPanels>
            <!-- "1" CARGAR -->
            <StepPanel v-slot="{ activateCallback }" value="1">
                <FormUploadFile />
                <div class="flex pt-6 justify-end">
                    <Button label="Siguiente" icon="pi pi-arrow-right" iconPos="right" @click="handleSetSelectors(activateCallback('2'))" />
                </div>
            </StepPanel>

            <!-- "2" CONFIGURAR -->
            <StepPanel v-slot="{ activateCallback }" value="2">
                <ConfigurateNeuralNetwork :selectors="selectors" />
                <div class="flex pt-6 justify-between">
                    <Button label="Atras" icon="pi pi-arrow-left" @click="activateCallback('1')" />
                    <Button label="Siguiente" icon="pi pi-arrow-right" iconPos="right" @click="handleSetLayers(activateCallback('3'))" />
                </div>
            </StepPanel>

            <!-- "3" ENTRENAR -->
            <StepPanel v-slot="{ activateCallback }" value="3">
                <TrainNeuralNetwork :handleTrain="handleTrain" :isTrained="isTrained" :isTraining="isTraining"/>
                <div class="flex pt-6 justify-between">
                    <Button label="Atras" icon="pi pi-arrow-left" @click="activateCallback('2')" />
                    <Button label="Siguiente" icon="pi pi-arrow-right" iconPos="right" @click="activateCallback('4')" :disabled="!isTrained" />
                </div>
            </StepPanel>

            <!-- "3" GUARDAR -->
            <StepPanel v-slot="{ activateCallback }" value="4">
                <div class="flex pt-6 justify-between">
                    <Button label="Atras" icon="pi pi-arrow-left" @click="activateCallback('3')" />
                    <Button label="Siguiente" icon="pi pi-arrow-right" iconPos="right" @click="" />
                </div>
            </StepPanel>
        </StepPanels>

    </Stepper>
</template>

<style>
.p-steppanel {
    background-color: transparent !important;
}
</style>