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
	NeuralNetwork *models.NeuralNetwork
	ctx           context.Context
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

func (a *App) NewNeuralNetwork(input int, hidden []int, output int, isRegression bool) {
	nn := models.NewNeuralNetwork(input, hidden, output, isRegression)
	a.NeuralNetwork = nn
}

func (a *App) Train(rawData [][]string, targetIndex int, learningRate float32, momentumFactor float32, epochs uint16) {
	ch := make(chan float64, epochs)

	floatData, err := convertToFloat64(rawData[1:])
	if err != nil {
		fmt.Printf("%s", err)
		return
	}

	targetData, trainData := extractTargetData(floatData, targetIndex)
	a.NeuralNetwork.Train(trainData, targetData, learningRate, momentumFactor, epochs, ch)

	if len(ch) > 0 {
		for e := range ch {
			fmt.Println(">>", e)
			wails.EventsEmit(c, `training`, e)
		}
	}
	wails.EventsEmit(c, `training`, nil)
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
