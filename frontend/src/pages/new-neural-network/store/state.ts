import { ToastServiceMethods } from "primevue/toastservice";
import { EventsOff, EventsOn } from "../../../../wailsjs/runtime/runtime";
import { NewNeuralNetwork, Predict } from "../../../../wailsjs/go/main/App";
import { reactive } from "vue";

const NewNeuralNetworkState = reactive({
	index_target: 0,

	file_name: "",
	file_data: Array(undefined),
	file_headers: Array(undefined),
	file_target_field: "",

	test_result: 0,
	test_file_percent: 80,
	test_predicts: Array(undefined),

	layer_input: 0,
	layer_hidden: [4, 4],
	layer_output: 1,

	nn_is_classification: false,
	nn_learning_rate: 0.1,
	nn_momentum_factor: 0.01,
	nn_epochs: 1000,
	nn_train_data: Array(undefined),
	nn_test_data: Array(undefined),
	nn_to_predict_data: Array(undefined),
	nn_mse: Array(undefined),
})

export default NewNeuralNetworkState

export const Clear = () => {
	NewNeuralNetworkState.file_name = "";
	NewNeuralNetworkState.file_data = [];
	NewNeuralNetworkState.file_headers = [];

	NewNeuralNetworkState.test_result = 0;
	NewNeuralNetworkState.test_file_percent = 80;

	NewNeuralNetworkState.layer_input = 0;
	NewNeuralNetworkState.layer_hidden = [4, 4];
	NewNeuralNetworkState.layer_output = 1;

	NewNeuralNetworkState.nn_learning_rate = 0.1;
	NewNeuralNetworkState.nn_momentum_factor = 0.01;
	NewNeuralNetworkState.nn_epochs = 1000;
	NewNeuralNetworkState.nn_mse = [];
	NewNeuralNetworkState.nn_train_data = [];
	NewNeuralNetworkState.nn_test_data = [];
}

export const LoadFile = (file: File | null, toast: ToastServiceMethods | null) => {
	const reader = new FileReader();

	reader.onload = (event: ProgressEvent<FileReader>) => {
		if (event.target && event.target.result) {
			const contenido = event.target.result as string;
			const lines = contenido.split('\n');
			NewNeuralNetworkState.file_name = file!.name

			lines.forEach((line) => {
				const fields = line.split(',');
				fields[fields.length - 1] = fields[fields.length - 1].trimEnd();
				NewNeuralNetworkState.file_data.push(fields);
			});
			NewNeuralNetworkState.file_headers = NewNeuralNetworkState.file_data[0]
			NewNeuralNetworkState.layer_input = NewNeuralNetworkState.file_headers.length - 1

			toast?.add({
				severity: "success",
				summary: "Archivo cargado",
				detail: NewNeuralNetworkState.file_headers.join(', '),
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
}

export const InitTrain = (isTrained:(isT:boolean) => void) => {
	listenTrainingEvent(isTrained, stopListenTrainingEvent)
	NewNeuralNetworkState.test_result = 0;

	NewNeuralNetworkState.test_predicts = new Array(NewNeuralNetworkState.nn_test_data.length).fill(null);
	NewNeuralNetworkState.nn_mse = new Array(NewNeuralNetworkState.nn_epochs / 100).fill(-1);
	NewNeuralNetworkState.layer_input = NewNeuralNetworkState.file_data[0].length - 1
	const target_index = NewNeuralNetworkState.file_headers.indexOf(NewNeuralNetworkState.file_target_field)
	
	const testPercentage = NewNeuralNetworkState.test_file_percent / 100;
	const totalDataCount = NewNeuralNetworkState.file_data.length;
  	const testDataCount = Math.floor(totalDataCount * testPercentage);

	const shuffledData = [...NewNeuralNetworkState.file_data.slice(1)].sort(() => Math.random() - 0.5);
  
	NewNeuralNetworkState.nn_test_data = shuffledData.slice(0, testDataCount);
	NewNeuralNetworkState.nn_train_data = shuffledData.slice(testDataCount);
	NewNeuralNetworkState.nn_to_predict_data = NewNeuralNetworkState.nn_test_data.map(row => row.filter((data:any, index:number) => index !== target_index));

	NewNeuralNetwork(
		NewNeuralNetworkState.layer_input,
		NewNeuralNetworkState.layer_hidden,
		NewNeuralNetworkState.layer_output,
		!NewNeuralNetworkState.nn_is_classification,
		NewNeuralNetworkState.nn_train_data,
		target_index,
		NewNeuralNetworkState.nn_learning_rate,
		NewNeuralNetworkState.nn_momentum_factor,
		NewNeuralNetworkState.nn_epochs
	);
}

let predicting = false
export const InitTrainPredicts = async () => {
	if (!predicting) {
		predicting = true
		NewNeuralNetworkState.test_predicts = new Array(0);
		for (let i = 0; i < NewNeuralNetworkState.nn_to_predict_data.length; i++) {
			const res = await Predict(NewNeuralNetworkState.nn_to_predict_data[i])
			NewNeuralNetworkState.test_predicts.push(res)
		}
	}
}

export const AnalyzePredicts = () => {
    const targetIndex = NewNeuralNetworkState.file_headers.indexOf(NewNeuralNetworkState.file_target_field);
    if (targetIndex === -1) {
        console.error('Campo objetivo no encontrado en file_headers');
        return;
    }

    const targetValues = NewNeuralNetworkState.nn_test_data.map(row => row[targetIndex]);

    let totalDifference = 0;
    let countValidPredictions = 0;

    NewNeuralNetworkState.test_predicts.forEach((predict, index) => {
        const actual = targetValues[index];
        if (actual === 0) {
            console.warn(`Valor real en el índice ${index} es 0, no se puede calcular la diferencia porcentual.`);
            return;
        }

        const difference = Math.abs((actual - predict) / actual * 100)
        totalDifference += difference;
        countValidPredictions++;
    });

    if (countValidPredictions === 0) {
        console.error('No se pudieron calcular diferencias válidas.');
        return;
    }

    const averageDifference = totalDifference / countValidPredictions;
    let precision = 100 - averageDifference;

    NewNeuralNetworkState.test_result = Number(precision.toFixed(2));
	predicting = false
};


const listenTrainingEvent = (setTrained: (isT:boolean) => void, callbackStopListen: () => void) => {
	EventsOn('training', (progress, index) => {
		if (progress === null) {
			setTrained(false);
			return
		}

		if (index == 0) {
			NewNeuralNetworkState.nn_mse = new Array(NewNeuralNetworkState.nn_epochs / 100);
		}
		
		NewNeuralNetworkState.nn_mse[index] = progress;

		if (index+1 === NewNeuralNetworkState.nn_epochs / 100) {
			setTrained(true);
			//callbackStopListen();
		}
	});
}

const stopListenTrainingEvent = () => {
	EventsOff("training")
}