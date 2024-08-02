package main

import (
	"RNApp/internal/models"
	"context"
	"encoding/json"
	"fmt"
	"os"
	"path/filepath"
	"strconv"
	"strings"

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

	nn := models.NewNeuralNetwork(input, hidden, output, isRegression)

	floatData, err := convertToFloat64(rawData)
	if err != nil {
		fmt.Printf("%s", err)
		return
	}

	targetData, trainData := extractTargetData(floatData, targetIndex)
	go nn.Train(trainData, targetData, learningRate, momentumFactor, epochs, ch)
	a.nn = nn

	var i int
	for e := range ch {
		wails.EventsEmit(c, `training`, e, i)
		i++
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

func (a *App) Save(name string, headers []string, indexTarget int, accuracy float64) string {
	return a.nn.Save(name, headers, indexTarget, accuracy)
}

func (a *App) Load(name string) string {
	return a.nn.Load(name)
}

func (a *App) LoadModels() []any {
	path := "./models/"
	var modelsData []any

	// List all files in the directory
	files, err := os.ReadDir(path)
	if err != nil {
		fmt.Println("Error reading directory:", err)
		return nil
	}

	for _, file := range files {
		// Check if the file ends with "__info.json"
		if strings.HasSuffix(file.Name(), "__info") {
			// Construct the full path
			filePath := filepath.Join(path, file.Name())

			// Read the file content
			data, err := os.ReadFile(filePath)
			if err != nil {
				fmt.Println("Error reading file:", err)
				continue
			}

			// Deserialize the JSON content into the Info struct
			var info models.Info
			err = json.Unmarshal(data, &info)
			if err != nil {
				fmt.Println("Error unmarshalling JSON:", err)
				continue
			}

			modelsData = append(modelsData, info)
		}
	}

	return modelsData
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
