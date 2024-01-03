var delhiNCR = /* color: #d63000 */ee.Geometry.Polygon(
    [[[77.08671678482938, 29.045496966211243],
    [76.04301561295438, 28.486930812729636],
    [76.18583787857938, 27.380437741680847],
    [77.59208787857938, 27.048252928722075],
    [77.96562303482938, 27.867135944057168],
    [78.41606248795438, 28.997462660356984],
    [77.71293748795438, 29.381109913313846]]]);

// Define the time frame
var startDate = '2020-01-01';
var endDate = '2020-12-31';

// Load Sentinel-5P data for nitrogen dioxide (NO2)
var collection = ee.ImageCollection('COPERNICUS/S5P/NRTI/L3_NO2')
    .select('tropospheric_NO2_column_number_density')
    .filterBounds(delhiNCR)
    .filterDate(startDate, endDate);


// Function to mask clouds and aerosols
function maskClouds(image) {
    var cloudMask = image.select('tropospheric_NO2_column_number_density');
    var mask = cloudMask.lte(0.1); // Example threshold for cloud masking
    return image.updateMask(mask);
}

// Apply cloud masking to the collection
var filteredCollection = collection.map(maskClouds);

// Display the map of NO2 concentration
var no2Vis = {
    min: 0,
    max: 0.0002,
    palette: ['black', 'blue', 'purple', 'cyan', 'green', 'yellow', 'red']
};
Map.addLayer(filteredCollection.mean(), no2Vis, 'tropospheric_NO2_column_number_density');

// Function to calculate mean NO2 concentration (tropospheric) per image
function calculateMean(image) {
    var mean = image.reduceRegion({
        reducer: ee.Reducer.mean(),
        geometry: delhiNCR,
        scale: 1000
    });
    return image.set('date', image.date().format('YYYY-MM-dd')).set('mean', mean.get('tropospheric_NO2_column_number_density'));
}

// Map the mean NO2 concentration over time
var timeSeries = filteredCollection.map(calculateMean);

// Chart the time series data
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

// Display the chart
print(chart);
