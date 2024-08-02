<script setup lang="ts">
import Button from 'primevue/button';
import Stepper from 'primevue/stepper';
import StepList from 'primevue/steplist';
import StepPanels from 'primevue/steppanels';
import StepItem from 'primevue/stepitem';
import FloatLabel from 'primevue/floatlabel';
import Step from 'primevue/step';
import StepPanel from 'primevue/steppanel';
import FileUploader from './components/FileUploader.vue';
import InputText from 'primevue/inputtext';
import NewNeuralNetworkState, { InitTrainPredicts, InitTrain, AnalyzePredicts } from './store/state';
import ConfigurationNN from './components/ConfigurationNN.vue';
import ConfigurationTrain from './components/ConfigurationTrain.vue';
import PopupTrained from './components/PopupTrained.vue';
import { ref, watchEffect } from 'vue';
import TrainedDetails from './components/TrainedDetails.vue';
import { useToast } from 'primevue/usetoast';
import { Save } from '../../../wailsjs/go/main/App';
import router from '../../router';

// Global
const toast = useToast()

// Ref
const isTraining = ref(false)
const isTrained = ref(false)
const modelName = ref("")
const modelNamePlaceholder = ref()

// Methods
const setTrained = async (isT:boolean) => {
    isTraining.value = false
    isTrained.value = isT
    if (!isT) {
        toast.add({summary:"Error en el entrenamiento", life:3000, severity:'error', detail:"Ha ocurrido un error en el entrenamiento de la red neuronal."})
    } else {
        await InitTrainPredicts();
        AnalyzePredicts();
    }
}

const handlerTrain = (activateCallback:(nb:string) => void) => {
    isTraining.value = true
    isTrained.value = false
    activateCallback('3')
    InitTrain(setTrained)
}

const handlerSaveModel = async () => {
    NewNeuralNetworkState.file_name = modelName.value
    const target_index = NewNeuralNetworkState.file_headers.indexOf(NewNeuralNetworkState.file_target_field)
    const res = await Save(NewNeuralNetworkState.file_name, NewNeuralNetworkState.file_headers, target_index, NewNeuralNetworkState.test_result)
    if (res != "") {
        toast.add({summary: "Hubo un error", severity:'error', detail:res})
        return
    }
    toast.add({summary: "Modelo guardado", severity:'success', detail:"Modelo guardado correctamente."})
    router.push("/")
}

watchEffect(() => {
    modelNamePlaceholder.value = `${(NewNeuralNetworkState.file_headers[NewNeuralNetworkState.file_headers.indexOf(NewNeuralNetworkState.file_target_field)] as string)?.replaceAll(' ', '_')}_${NewNeuralNetworkState.test_result.toFixed(0)}_${new Date().toLocaleDateString().replaceAll('/', '_')}`
})
</script>

<template>
    <section>
        <Stepper value="1">
            <StepList>
                <Step value="1">Carga de datos</Step>
                <Step value="2" disabled>Configurar y Entrenar</Step>
                <Step value="3" disabled>Revisar y Guardar</Step>
            </StepList>

            <StepPanels>
                <!--1-->
                <StepPanel v-slot="{ activateCallback }" value="1">
                    <FileUploader />
                    <div class="flex pt-6 justify-end">
                        <Button label="Siguiente" icon="pi pi-arrow-right" iconPos="right" @click="activateCallback('2')" :disabled="NewNeuralNetworkState.file_name === ''" />
                    </div>
                </StepPanel>

                <!--2-->
                <StepPanel v-slot="{ activateCallback }" value="2">
                    <div class="grid gap-4">
                        <ConfigurationNN />
                        <ConfigurationTrain />
                    </div>
                    <div class="flex pt-6 justify-between">
                        <Button label="Atras" outlined icon="pi pi-arrow-left" @click="activateCallback('1')" :disabled="NewNeuralNetworkState.file_name === ''" />
                        <Button label="Entrenar" severity="warn" icon="pi pi-cog" iconPos="right" @click="() => handlerTrain(activateCallback)" :disabled="NewNeuralNetworkState.file_target_field === ''" />
                    </div>
                </StepPanel>

                <!--3-->
                <StepPanel v-slot="{ activateCallback }" value="3">
                    <div class="grid gap-8">
                        <TrainedDetails />
                    </div>
                    <div class="mt-4 p-4 border border-neutral-700 bg-neutral-900 rounded-md">
                        <label for="modelName">Nombre de la red neuronal</label>
                        <InputText id="modelName" type="text" v-model="modelName" :placeholder="modelNamePlaceholder" fluid/>
                    </div>
                    <div class="flex pt-6 justify-between">
                        <Button label="Vovler a entrenar" outlined icon="pi pi-arrow-left" @click="activateCallback('2')" :disabled="NewNeuralNetworkState.file_name === ''" />
                        <Button label="Guardar" severity="success" icon="pi pi-save" iconPos="right" @click="handlerSaveModel" :disabled="modelName === ''" />
                    </div>
                </StepPanel>

            </StepPanels>
            
        </Stepper>

        
    </section>
</template>

<style>
.p-steppanel {
    background-color: transparent !important;
}
</style>