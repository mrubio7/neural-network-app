package models

import (
	"os"
	"path/filepath"

	"github.com/dathoangnd/gonet"
)

type NeuralNetwork struct {
	nn *gonet.NN
}

const path = "./models/"

func NewNeuralNetwork(input int, middle []int, output int, classification bool) *NeuralNetwork {
	n := gonet.New(input, middle, output, classification)

	return &NeuralNetwork{
		nn: &n,
	}
}

func (n *NeuralNetwork) Train(trainData [][]float64, targetData []float64, learningRate, momentumFactor float32, epochs uint16, channel chan float64) {
	var inputs [][][]float64
	for i, data := range trainData {
		inputs = append(inputs, [][]float64{data, {targetData[i]}})
	}
	n.nn.Train(inputs, int(epochs), float64(learningRate), float64(momentumFactor), channel)
}

func (n *NeuralNetwork) Predict(data []float64) []float64 {
	res := n.nn.Predict(data)
	return res
}

func (n *NeuralNetwork) Save(name string) string {
	err := os.MkdirAll(filepath.Dir(path), os.ModePerm)
	if err != nil {
		return err.Error()
	}

	err = n.nn.Save(path + name)
	if err != nil {
		return err.Error()
	}

	return ""
}

func (n *NeuralNetwork) Load(name string) string {
	nn, err := gonet.Load(path + name)
	if err != nil {
		return err.Error()
	}

	n.nn = &nn
	return ""
}
