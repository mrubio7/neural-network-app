<script setup lang="ts">
import { ref } from 'vue';
import { useToast } from 'primevue/usetoast';
import FileUpload from 'primevue/fileupload';
import Button from 'primevue/button';
import Badge from 'primevue/badge';
import NewNeuralNetworkState, {Clear, LoadFile} from '../store/state';

//Globals
const toast = useToast()

//Refs
const file = ref<File>();
const uploadedFile = ref(false);

//Methods
const onRemoveTemplatingFile = (removeFileCallback: () => void) => {
    removeFileCallback();
    file.value = undefined
};

const onSelectedFiles = (event: any) => {
    file.value = event.files;
    uploadedFile.value = false
};

const uploadEvent = (file: any): void => {
    Clear()
    LoadFile(file[file.length - 1], toast)
    uploadedFile.value = true
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
                                <Badge v-if="uploadedFile" value="Cargado" severity="success" class="w-full rounded-2xl" />
                                <Badge v-else-if="!uploadedFile" value="Pendiente de cargar" severity="warn" class="w-full rounded-2xl" />
                                <span class="font-semibold text-ellipsis whitespace-nowrap overflow-hidden">{{ files[0].name }}</span>
                                <Button icon="pi pi-times" @click="onRemoveTemplatingFile(removeFileCallback)" outlined rounded size="small" severity="danger" />
                            </div>
                        </div>
                    </div>

                    <Button v-if="!uploadedFile" class="mt-4" @click="uploadEvent(files)" icon="pi pi-cloud-upload" rounded outlined severity="success" label="Cargar" />
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