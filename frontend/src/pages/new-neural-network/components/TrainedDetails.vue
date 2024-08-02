<script setup lang="ts">
import { ref, StyleHTMLAttributes, watchEffect } from 'vue';
import Chart from 'primevue/chart';
import Knob from 'primevue/knob';
import NewNeuralNetworkState from '../store/state';
import Button from 'primevue/button';
import Dialog from 'primevue/dialog';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';

//Globals
const tooltips = {
		precision: "La precisión mide la exactitud del modelo, calculando el porcentaje promedio de error entre los valores predichos y los valores reales en los datos de prueba."
}

//Refs
const chartData = ref({});
const chartOptions = ref({});
const knobRate = ref(0);
const dataDetailDialog = ref(false)
const dataDetails = ref()
const dataHeaders = ref()

//Methods
const setChartData = () => {
	const mseData = NewNeuralNetworkState.nn_mse;
	const labels = Array.from({ length: mseData.length }, (_, index) => `Iteration ${index * 100 + 100}`);

	return {
		labels: labels,
		datasets: [
			{
				label: 'Error cuadrático medio',
				data: Array.from(mseData), // Asegúrate de que mseData sea un array de números
				fill: false,
				borderColor: 'lightgreen', // Color válido en CSS
				tension: 0.2
			}
		]
	};
};

const setChartOptions = () => {
	const documentStyle = getComputedStyle(document.documentElement);
	const textColor = documentStyle.getPropertyValue('--p-text-color');
	const textColorSecondary = documentStyle.getPropertyValue('--p-text-muted-color');
	const surfaceBorder = documentStyle.getPropertyValue('--p-content-border-color');

	return {
		maintainAspectRatio: false,
		aspectRatio: 2,
		animation: false,
		plugins: {
			legend: {
				labels: {
					color: textColor
				}
			}
		},
		scales: {
			x: {
				ticks: {
					color: textColorSecondary
				},
				grid: {
					color: surfaceBorder
				}
			},
			y: {
				ticks: {
					color: textColorSecondary
				},
				grid: {
					color: surfaceBorder
				},
				min: 0,
			}
		}
	};
};

const getKnobColor = () => {
		const rate = NewNeuralNetworkState.test_result
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

const handleShowDataDetail = () => {
	dataHeaders.value = NewNeuralNetworkState.file_headers.concat("Predicción", "Precisión")
  	dataDetails.value = NewNeuralNetworkState.nn_test_data.map((dataRow, index) => {
		const dataObject: { [key: string]: number | string } = {};

		const target_index = NewNeuralNetworkState.file_headers.indexOf(NewNeuralNetworkState.file_target_field)
		NewNeuralNetworkState.file_headers.forEach((header, idx) => {
			dataObject[header] = dataRow[idx];
		});
		dataObject['Predicción'] = (NewNeuralNetworkState.test_predicts[index][0] as number).toFixed(2);
		dataObject['Precisión'] = (100 - Math.abs((dataRow[target_index] - NewNeuralNetworkState.test_predicts[index]) / dataRow[target_index] * 100)).toFixed(2) + " %"

		return dataObject;
	});

  dataDetailDialog.value = true;
};

const getStyleCol = (row:any) => {
	const nb = (row['Precisión'] as string).split(" ")[0]
	if (Number(nb) < 60) {
		return {color: '#991b1b'} as StyleHTMLAttributes //RED
	} else if (Number(nb) >= 60 && Number(nb) < 70) {
		return {color: '#f97316'} as StyleHTMLAttributes //ORANGE
	} else if (Number(nb) >= 70 && Number(nb) < 90) {
		return {color: '#bef264'} as StyleHTMLAttributes //GREEN
	} else if (Number(nb) >= 90) {
		return {color: '#15803d'} as StyleHTMLAttributes //LIGHTGREEN
	}
}

watchEffect(() => {
		chartData.value = {};
		chartData.value = setChartData();
		chartOptions.value = setChartOptions();
		knobRate.value = NewNeuralNetworkState.test_result
})
</script>

<template>
	<div class="flex h-full gap-8 p-4 border border-neutral-700 bg-neutral-900 rounded-md">
			<div class="w-full">
					<Chart type="line" :data="chartData" :options="chartOptions" class="h-80" />
			</div>
			<div class="flex justify-center flex-col gap-1 mr-4">
					<div class="flex items-center">
							<span v-tooltip.top="tooltips.precision" class="pi pi-info-circle mr-2 text-neutral-500"></span>
							<span class="text-left text-nowrap">Precisión</span>
					</div>
					<Knob v-model="knobRate" :strokeWidth="7" valueTemplate="{value}%" readonly :valueColor="getKnobColor()" />
					<Button label="Mostrar" severity="secondary" outlined size="small" @click="handleShowDataDetail" />
			</div>
	</div>
	<Dialog v-model:visible="dataDetailDialog" modal header="Detalles">
		<DataTable :value="dataDetails" size="small" tableStyle="min-width: 50rem" :row-style="getStyleCol" >
			<Column
				v-for="(col, index) in dataHeaders"
				:key="index"
				:field="col"
				:header="col"
			>
			</Column>
		</DataTable>
	</Dialog>
</template>
