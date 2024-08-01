package models

type Dataset struct {
	TrainData  [][]float64
	TargetData []float64
}

func NewDataset(trainingData [][]float64, targetData []float64) *Dataset {
	return &Dataset{
		TrainData:  trainingData,
		TargetData: targetData,
	}
}
