<template>
    <div class="card">
      <Chart type="line" :data="chartData" :options="chartOptions" class="h-80"/>
    </div>
  </template>
  
  <script setup lang="ts">
import { ref, onMounted, onUnmounted, watch, watchEffect } from "vue";
import Chart from 'primevue/chart';
import NeuralNetworkState from "../states/NeuralNetworkState";

const chartData = ref({});
const chartOptions = ref({});

const setChartData = () => {
  const mseData = NeuralNetworkState.training.mse;
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
    aspectRatio: 0.6,
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

const updateChartData = () => {
  chartData.value = {}; // Reiniciar los datos para evitar acumulación
  chartData.value = setChartData();
  chartOptions.value = setChartOptions();
};

watchEffect(() => {
  updateChartData();
});
</script>

  
  <style scoped>
  .card {
    padding: 1rem;
    border: solid 1px rgb(83, 83, 83);
    border-radius: 8px;
  }
  </style>
  