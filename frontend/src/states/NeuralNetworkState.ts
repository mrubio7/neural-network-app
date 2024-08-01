import { reactive, ref, Ref } from "vue";
import { ToastServiceMethods } from "primevue/toastservice";
import { EventsOff, EventsOn } from "../../wailsjs/runtime/runtime";
import { NewNeuralNetwork, Train } from "../../wailsjs/go/main/App";

interface Layers {
  input: number;
  hidden: number[];
  output: number;
}

interface Training {
  epochs: number;
  learning_rate: number;
  momentum_factor: number;
  mse: number[];
}

const NeuralNetwork = reactive({
  name: "",
  predict_field: "",
  raw_data: [] as string[][],
  is_classification: true,
  layers: {
    input: 0,
    hidden: [0],
    output: 0,
  } as Layers,
  training: {
    epochs: 1000,
    learning_rate: 0.1,
    momentum_factor: 0.01,
    mse: [],
  } as Training,

  Clear() {
    NeuralNetwork.name = "";
    NeuralNetwork.predict_field = "";
    NeuralNetwork.raw_data = [];
    NeuralNetwork.is_classification = true;
    NeuralNetwork.layers = { input: 0, hidden: [0], output: 0 };
    NeuralNetwork.training = { epochs: 1000, learning_rate: 0.1, momentum_factor: 0.01, mse: [] };
  },

  SetData(file: File | null, toast: ToastServiceMethods | null) {
    const reader = new FileReader();

    reader.onload = (event: ProgressEvent<FileReader>) => {
      if (event.target && event.target.result) {
        const contenido = event.target.result as string;
        const lines = contenido.split('\n');
        lines.forEach((line) => {
          const fields = line.split(',');
          fields[fields.length - 1] = fields[fields.length - 1].trimEnd();
          NeuralNetwork.raw_data.push(fields);
        });
        toast?.add({
          severity: "success",
          summary: "Archivo cargado",
          detail: `${NeuralNetwork.raw_data[0]}... `,
          life: 2000,
        });
      }
    };

    reader.onerror = () => {
      toast?.add({
        severity: "error",
        summary: "Error al cargar archivo",
        life: 2000,
      });
    };

    if (file != null) {
      reader.readAsText(file);
    }
  },

  SetLayers() {
    NewNeuralNetwork(NeuralNetwork.layers.input, NeuralNetwork.layers.hidden, NeuralNetwork.layers.output, NeuralNetwork.is_classification);
  },

  Train(callback: () => void) {
    // Inicializar mse con ceros para la cantidad de epochs / 100
    NeuralNetwork.training.mse = new Array(NeuralNetwork.training.epochs / 100).fill(0);
    let temp: number[] = []; // Especificar que temp es un array de números
    let n = 0;
  
    // Evento para capturar el progreso del entrenamiento
    EventsOn('training', (progress) => {
      n += 1;
      if (progress === null) {
        callback();
        return
      }
      
      temp.push(progress);
      
  
      // Cada vez que se completen 100 iteraciones, actualizar mse
      if (n === NeuralNetwork.training.epochs / 100) {
        n = 0;
        // Actualizar mse con los valores temporales y reiniciar temp
        NeuralNetwork.training.mse = [...temp];
        temp = [];
        // Ejecutar el callback para actualizar el gráfico
        callback();
      }
    });
  
    // Obtener el índice del campo objetivo para la predicción
    const getTargetIndex = () => {
      const headers = NeuralNetwork.raw_data[0];
      return headers.indexOf(NeuralNetwork.predict_field);
    };
  
    // Llamada a la función Train con los parámetros adecuados
    Train(NeuralNetwork.raw_data, getTargetIndex(), NeuralNetwork.training.learning_rate, NeuralNetwork.training.momentum_factor, NeuralNetwork.training.epochs);
  },
})

export default NeuralNetwork;
