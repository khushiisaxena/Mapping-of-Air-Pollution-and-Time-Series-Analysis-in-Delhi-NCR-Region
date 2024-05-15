# NO2 Concentration Analysis Over Delhi NCR Using Sentinel-5P Data

This repository contains a script to analyze the nitrogen dioxide (NO2) concentration over the Delhi NCR region using Sentinel-5P data. The script filters, processes, and visualizes the NO2 data for the year 2020.

## Description

The script performs the following steps:

1. **Define the Delhi NCR Region**: A polygon is defined to represent the geographic boundaries of the Delhi NCR region.
2. **Set the Time Frame**: The analysis is set to cover the period from January 1, 2020, to December 31, 2020.
3. **Load Sentinel-5P Data**: The script loads the Sentinel-5P NO2 data and filters it for the defined region and time frame.
4. **Cloud and Aerosol Masking**: A function is defined to mask out clouds and aerosols based on a threshold value.
5. **Apply Masking**: The cloud masking function is applied to the NO2 data collection.
6. **Visualize NO2 Concentration**: The mean NO2 concentration is calculated and visualized on a map.
7. **Calculate Mean NO2 Concentration**: A function is defined to calculate the mean NO2 concentration for each image in the collection.
8. **Generate Time Series**: The mean NO2 concentration is mapped over time and a time series chart is generated.
9. **Display Chart**: The time series chart is printed, showing the mean NO2 concentration over the specified time period.

## Installation

To run this script, you need access to Google Earth Engine. Follow these steps:

1. Sign up for a Google Earth Engine account at [Google Earth Engine](https://earthengine.google.com/).
2. Create a new repository in the [Google Earth Engine Code Editor](https://code.earthengine.google.com/).
3. Copy and paste the provided script into the Code Editor.

## Usage

```javascript
var delhiNCR = /* color: #d63000 */ee.Geometry.Polygon(
    [[[77.08671678482938, 29.045496966211243],
    [76.04301561295438, 28.486930812729636],
    [76.18583787857938, 27.380437741680847],
    [77.59208787857938, 27.048252928722075],
    [77.96562303482938, 27.867135944057168],
    [78.41606248795438, 28.997462660356984],
    [77.71293748795438, 29.381109913313846]]]);

var startDate = '2020-01-01';
var endDate = '2020-12-31';

var collection = ee.ImageCollection('COPERNICUS/S5P/NRTI/L3_NO2')
    .select('tropospheric_NO2_column_number_density')
    .filterBounds(delhiNCR)
    .filterDate(startDate, endDate);

function maskClouds(image) {
    var cloudMask = image.select('tropospheric_NO2_column_number_density');
    var mask = cloudMask.lte(0.1);
    return image.updateMask(mask);
}

var filteredCollection = collection.map(maskClouds);

var no2Vis = {
    min: 0,
    max: 0.0002,
    palette: ['black', 'blue', 'purple', 'cyan', 'green', 'yellow', 'red']
};
Map.addLayer(filteredCollection.mean(), no2Vis, 'tropospheric_NO2_column_number_density');

function calculateMean(image) {
    var mean = image.reduceRegion({
        reducer: ee.Reducer.mean(),
        geometry: delhiNCR,
        scale: 1000
    });
    return image.set('date', image.date().format('YYYY-MM-dd')).set('mean', mean.get('tropospheric_NO2_column_number_density'));
}

var timeSeries = filteredCollection.map(calculateMean);

var chart = ui.Chart.image.seriesByRegion({
    imageCollection: timeSeries,
    regions: delhiNCR,
    reducer: ee.Reducer.mean(),
    scale: 1000,
    xProperty: 'date',
    seriesProperty: 'mean'
}).setOptions({
    title: 'Mean NO2 Concentration Over Time',
    hAxis: { title: 'Date' },
    vAxis: { title: 'NO2 Concentration (mol/m²)' }
});

print(chart);
```

## Results

The script will generate a time series chart displaying the mean NO2 concentration over Delhi NCR for the year 2020. The visualization uses a color palette to indicate varying concentrations of NO2, with the chart providing a detailed temporal analysis of NO2 levels.

## Contributing

If you would like to contribute to this project, please open an issue or submit a pull request.

## License

This project is licensed under the MIT License.

---

Feel free to use and modify this script to suit your needs. For any questions or support, please contact the repository maintainer.
