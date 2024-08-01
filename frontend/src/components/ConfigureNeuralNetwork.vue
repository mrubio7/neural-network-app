<script setup lang="ts">
    import { onActivated, onMounted, reactive, ref, watch, watchEffect } from 'vue';
    import InputNumber from 'primevue/inputnumber';
    import Button from 'primevue/button';
    import Select from 'primevue/select';
    import NeuralNetworkState from '../states/NeuralNetworkState';

    const props = defineProps(['selectors'])

    const selected = ref()

    const layers = reactive([
      { nodes: 4 },
      { nodes: 4 }
    ]);

    // Función para añadir una capa
    const addLayer = () => {
      layers.push({ nodes: 0 });
    };

    // Función para eliminar una capa
    const removeLayer = (index:number) => {
      layers.splice(index, 1);
    };

    // Función para actualizar el número de nodos
    const updateNodes = (index:number, value:number) => {
      layers[index].nodes = value;
    };

    watchEffect(() => {
        NeuralNetworkState.layers.input = NeuralNetworkState.raw_data[0]?.length - 1;
        NeuralNetworkState.layers.hidden = layers.map(l => l.nodes)
        NeuralNetworkState.layers.output = 1
        NeuralNetworkState.predict_field = selected.value
    }, {flush: 'post'})
</script>

<template>
    <div class="bg-neutral-900 rounded-lg p-6">

        <div class="flex items-center">
            <label class="w-44">Campo a predecir:</label>
            <div class="flex items-center w-full">
                <Select v-model="selected" :options="props.selectors" optionLabel="" class="w-full" />
                <span v-tooltip.left="'Seleccione el campo que desea que la red neuronal prediga'" class="pi pi-question-circle mx-4 text-neutral-400"></span>
            </div>
        </div>

        <div v-for="(layer, index) in layers" :key="index" class="layer">
            <div class="flex items-center flex justify-between my-4">
                <div class="w-1/12">
                    <span>Capa {{ index + 1 }}</span>
                </div>
                <div class="w-7/12">
                    <InputNumber class="w-full" v-model.number="layer.nodes" :min="1" prefix="Nodos: " inputId="withoutgrouping" @input="updateNodes(index, layer.nodes)" :useGrouping="false" fluid  showButtons buttonLayout="horizontal">
                        <template #incrementbuttonicon>
                            <span class="pi pi-plus" />
                        </template>
                        <template #decrementbuttonicon>
                            <span class="pi pi-minus" />
                        </template>
                    </InputNumber>
                </div>

                <div class="ml-4 w-3/12">
                    <Button @click="removeLayer(index)" class="w-full" size="small" icon="pi pi-minus" label="Eliminar capa" severity="danger" />
                </div>
            </div>
        </div>
        <Button @click="addLayer" class="mt-2" size="small" icon="pi pi-plus" label="Añadir capa"/>
    </div>
</template>