<script setup lang="ts">
import FileUpload from 'primevue/fileupload';
import { ref } from 'vue';
import { usePrimeVue } from 'primevue/config';
import { useToast } from 'primevue/usetoast';
import Button from 'primevue/button';
import Badge from 'primevue/badge';
import NeuralNetworkState from '../states/NeuralNetworkState';

const $primevue = usePrimeVue();
const toast = useToast();

const file = ref<File>();
const uploadedFile = ref();

const onRemoveTemplatingFile = (removeFileCallback: () => void) => {
    removeFileCallback();
    file.value = undefined
};

const onSelectedFiles = (event: any) => {
    file.value = event.files;
    uploadedFile.value = false
};

const uploadEvent = (file: any): void => {
    NeuralNetworkState.Clear()
    NeuralNetworkState.SetData(file[file.length - 1], toast)
    uploadedFile.value = true
};

const formatSize = (bytes: number): string => {
    const k = 1024;
    const dm = 3;
    const sizes = $primevue.config.locale!.fileSizeTypes;

    if (bytes === 0) {
        return `0 ${sizes[0]}`;
    }

    const i = Math.floor(Math.log(bytes) / Math.log(k));
    const formattedSize = parseFloat((bytes / Math.pow(k, i)).toFixed(dm));

    return `${formattedSize} ${sizes[i]}`;
};
</script>

<template>
    <div class="card">
        <FileUpload name="demo[]" url="/api/upload" :multiple="false" accept=".csv" :maxFileSize="1000000" @select="onSelectedFiles">
            <template #header="{ chooseCallback, uploadCallback, clearCallback, files }">
                <div class="flex flex-wrap justify-between items-center flex-1 gap-4">
                    <div class="flex gap-2 w-full">
                        <Button @click="chooseCallback()" class="w-full" icon="pi pi-file" label="Seleccionar archivo" outlined severity="secondary" />
                    </div>
                </div>
            </template>

            <!--FILES-->
            <template #content="{ files, removeFileCallback }">
                <div v-if="file !== undefined">
                    <div class="flex flex-col">
                        <!--SELECTED-->
                        <div class="mt-4 w-full">
                            <div class="px-4 pt-4 pb-6 rounded-xl flex flex-col border border-surface items-center gap-4">
                                <Badge v-if="uploadedFile" value="OK" severity="success" class="w-full rounded-2xl" />
                                <span class="font-semibold text-ellipsis whitespace-nowrap overflow-hidden">{{ files[0].name }}</span>
                                <div>{{ formatSize(files[0].size) }}</div>
                                <Button icon="pi pi-times" @click="onRemoveTemplatingFile(removeFileCallback)" outlined rounded size="small" severity="danger" />
                            </div>
                        </div>
                    </div>

                    <Button class="mt-4" @click="uploadEvent(files)" icon="pi pi-cloud-upload" rounded outlined severity="success" label="Cargar" />
                </div>
            </template>

            <!--EMPTY-->
            <template #empty>
                <div class="flex items-center justify-center flex-col py-6 text-neutral-600">
                    <i class="pi pi-cloud-upload border-neutral-600 !border-2 !rounded-full !p-8 !text-4xl !text-muted-color"/>
                    <p class="mt-6 mb-2">Arrastre y suelte los archivos aquí para subirlos.</p>
                </div>
            </template>
        </FileUpload>
    </div>
</template>
