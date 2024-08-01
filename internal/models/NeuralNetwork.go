package models

import "github.com/dathoangnd/gonet"

type NeuralNetwork struct {
	nn gonet.NN
}

func NewNeuralNetwork(input int, middle []int, output int, classification bool) *NeuralNetwork {
	n := gonet.New(input, middle, output, classification)

	return &NeuralNetwork{
		nn: n,
	}
}

func (n *NeuralNetwork) Train(trainData [][]float64, targetData []float64, learningRate, momentumFactor float32, epochs uint16, channel chan float64) {
	var inputs [][][]float64
	for i, data := range trainData {
		inputs = append(inputs, [][]float64{data, {targetData[i]}})
	}
	n.nn.Train(inputs, int(epochs), float64(learningRate), float64(momentumFactor), channel)
}
