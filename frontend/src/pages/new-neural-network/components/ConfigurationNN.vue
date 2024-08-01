<script setup lang="ts">
import Panel from 'primevue/panel';
import InputNumber from 'primevue/inputnumber';
import Button from 'primevue/button';
import Select from 'primevue/select';
import { ref, watchEffect } from 'vue';
import NewNeuralNetworkState from '../store/state';
import { useToast } from 'primevue/usetoast';
import ToggleSwitch from 'primevue/toggleswitch';

// Globals
const maxNodes = 60;
const maxLayers = 5;
const toast = useToast()
const target_selectors = ref()

// Refs
const target_selected = ref("")
const file_percentage = ref(10)
const isClassification = ref(false)
const layers_hidden = ref([{ nodes: 4 }, { nodes: 4 }]);
const tooltips = {
    columnPredict: "Columna que la red neuronal intentará predecir.",
    filePercent: "Porcentaje de datos reservados para validar predicciones con resultados conocidos, no utilizados en el entrenamiento.",
    layers: "Cantidad de capas y nodos; más capas pueden mejorar el aprendizaje pero aumentan el riesgo de sobreajuste.",
    isClassification: "Indica si el modelo debe clasificar datos en Si/No (1/0) o predecir valores numéricos."
}

watchEffect(() => {
    target_selectors.value = NewNeuralNetworkState.file_headers
})

// Methods
const addLayer = () => {
    if (layers_hidden.value.length === maxLayers) {
        toast.add({closable: true, severity:'warn', summary:"Maximo de capas alcanzado", detail:`El maximo de capas intermedias son ${maxLayers} ya que con mas capas, el entrenamiento tardaría demasiado.`, life: 3000})
        return
    }
    layers_hidden.value.push({ nodes: 1 });
};

const removeLayer = (index:number) => {
    layers_hidden.value.splice(index, 1);
};

const updateNodes = (index:number, value:number) => {
    if (value > maxNodes) {
        toast.add({closable: true, severity:'warn', summary:"Maximo de nodos alcanzado", detail:`El maximo de nodos en una capa son ${maxNodes} ya que con mas nodos, el entrenamiento tardaría demasiado.`, life: 3000})
        layers_hidden.value[index].nodes = value-1;
        return
    }
    layers_hidden.value[index].nodes = value;
};

// Setters to store
watchEffect(() => {
    NewNeuralNetworkState.file_target_field = target_selected.value
    NewNeuralNetworkState.test_file_percent = file_percentage.value
    NewNeuralNetworkState.layer_hidden = layers_hidden.value.map(layer => layer.nodes)
    NewNeuralNetworkState.nn_is_classification = isClassification.value
})

</script>

<template>
    <Panel header="Configuración de red neuronal">
        <div class="flex items-center">
            <div class="flex items-center">
                <span v-tooltip="tooltips.columnPredict" class="pi pi-info-circle mr-4 text-neutral-500"></span>
                <span class="text-left text-nowrap mr-2 ">¿Cual es la columna que deseas predecir?</span>
            </div>
            <Select placeholder="Seleccione un campo"class="w-full" v-model="target_selected" :options="target_selectors"></Select>
        </div>
        
        <div class="flex items-center gap-8 my-2">
            <div class="flex w-full">
                <div class="flex items-center">
                    <span v-tooltip="tooltips.filePercent" class="pi pi-info-circle mr-4 text-neutral-500"></span>
                    <span class="text-left text-nowrap mr-2">¿Que porcentaje deseas utilizar para test?</span>
                </div>
                <InputNumber fluid showButtons v-model="file_percentage" suffix=" %" :max="50" :min="5" />
            </div>
            <div  class="flex w-56">
                <div class="flex items-center w-full">
                    <span v-tooltip="tooltips.isClassification" class="pi pi-info-circle mr-4 text-neutral-500"></span>
                    <span class="text-left text-nowrap mr-2">¿Es clasificación?</span>
                </div>
                <div class="w-full flex items-center justify-end mr-2">
                    <ToggleSwitch v-model="isClassification" />
                </div>

            </div>
        </div>
        <div class="flex items-start flex-col my-2">
            <div class="flex items-center w-full mt-2">
                <span v-tooltip="tooltips.layers" class="pi pi-info-circle mr-4 text-neutral-500"></span>
                <span class="text-left">Capas</span>
            </div>
            <div class="flex gap-2 mt-2 w-full">
                <InputNumber v-model="NewNeuralNetworkState.layer_input" disabled fluid />
                <div class="flex gap-1">
                    <Button icon="pi pi-minus" severity="danger" @click="removeLayer"></Button>
                </div>
                <InputNumber v-for="(layer, index) in layers_hidden" v-model="layer.nodes" fluid  showButtons buttonLayout="horizontal" @input="updateNodes(index, layer.nodes)" :min="1" :max="maxNodes" suffix="">
                    <template #incrementbuttonicon>
                        <span class="pi pi-plus" />
                    </template>
                    <template #decrementbuttonicon>
                        <span class="pi pi-minus" />
                    </template>
                </InputNumber>
                <div class="flex gap-1">
                    <Button icon="pi pi-plus" severity="success" @click="addLayer"></Button>
                </div>
                <InputNumber v-model="NewNeuralNetworkState.layer_output" disabled fluid  />
            </div>
        </div>
    </Panel>
</template>