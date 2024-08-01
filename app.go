package main

import (
	"RNApp/internal/models"
	"context"
	"fmt"
	"strconv"

	wails "github.com/wailsapp/wails/v2/pkg/runtime"
)

var c context.Context

// App struct
type App struct {
	nn  *models.NeuralNetwork
	ctx context.Context
}

// NewApp creates a new App application struct
func NewApp() *App {
	return &App{}
}

// startup is called when the app starts. The context is saved
// so we can call the runtime methods
func (a *App) startup(ctx context.Context) {
	a.ctx = ctx
	c = ctx
}

func (a *App) NewNeuralNetwork(
	input int,
	hidden []int,
	output int,
	isRegression bool,
	rawData [][]string,
	targetIndex int,
	learningRate float32,
	momentumFactor float32,
	epochs uint16,
) {
	ch := make(chan float64, epochs)
	defer close(ch)

	nn := models.NewNeuralNetwork(input, hidden, output, isRegression)

	floatData, err := convertToFloat64(rawData)
	if err != nil {
		fmt.Printf("%s", err)
		return
	}

	targetData, trainData := extractTargetData(floatData, targetIndex)
	nn.Train(trainData, targetData, learningRate, momentumFactor, epochs, ch)
	a.nn = nn

	if len(ch) > 0 {
		for e := range ch {
			wails.EventsEmit(c, `training`, e)
		}
	}
	wails.EventsEmit(c, `training`, nil)

}

func (a *App) Predict(inputs []string) []float64 {
	inputFloats, err := convertArrayToFloat64(inputs)
	if err != nil {
		fmt.Println("Error:", err)
		return nil
	}

	res := a.nn.Predict(inputFloats)
	return res
}

func convertArrayToFloat64(inputs []string) ([]float64, error) {
	outputs := make([]float64, len(inputs))

	for i, str := range inputs {
		// Convertimos cada elemento a float64
		val, err := strconv.ParseFloat(str, 64)
		if err != nil {
			return nil, err
		}
		outputs[i] = val
	}

	return outputs, nil
}

func convertToFloat64(data [][]string) ([][]float64, error) {
	var convertedData [][]float64
	for _, row := range data {
		var convertedRow []float64
		for _, val := range row {
			floatVal, err := strconv.ParseFloat(val, 64)
			if err != nil {
				return nil, err
			}
			convertedRow = append(convertedRow, floatVal)
		}
		convertedData = append(convertedData, convertedRow)
	}
	return convertedData, nil
}

func extractTargetData(data [][]float64, targetIndex int) ([]float64, [][]float64) {
	var targetData []float64
	var inputData [][]float64

	for _, row := range data {
		if len(row) > targetIndex {
			targetData = append(targetData, row[targetIndex])
			inputData = append(inputData, append(row[:targetIndex], row[targetIndex+1:]...))
		}
	}

	return targetData, inputData
}
