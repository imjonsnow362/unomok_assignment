"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fs = require("fs");
// Function to process log data from a file
function processLogFile(filePath) {
    // Read the data from the file
    var data = fs.readFileSync(filePath, 'utf-8');
    // Initialize variables to store insights for this log file
    var endpointCounts = {};
    var perMinuteCounts = {};
    var statusCounts = {};
    // Split the data into lines
    var lines = data.split('\n');
    // Process each line of the log data
    lines.forEach(function (line) {
        // Split the line into parts
        var parts = line.split(' ');
        // Extract the timestamp and endpoint/status code
        var timestamp = parts.slice(0, 2).join(' ');
        var info = parts.slice(2).join(' ');
        // Count endpoint calls
        if (info.includes('Running webapp API')) {
            var endpointMatch = info.match(/Port (\d+)/);
            if (endpointMatch) {
                var endpoint = endpointMatch[1];
                if (endpointCounts[endpoint]) {
                    endpointCounts[endpoint]++;
                }
                else {
                    endpointCounts[endpoint] = 1;
                }
            }
        }
        // Count per minute API calls
        var minute = timestamp.split(':')[0];
        if (perMinuteCounts[minute]) {
            perMinuteCounts[minute]++;
        }
        else {
            perMinuteCounts[minute] = 1;
        }
        // Count API calls by HTTP status code
        var statusCodeMatch = info.match(/\[3(\d+)m/);
        if (statusCodeMatch) {
            var statusCode = statusCodeMatch[1];
            if (statusCounts[statusCode]) {
                statusCounts[statusCode]++;
            }
            else {
                statusCounts[statusCode] = 1;
            }
        }
    });
    // Display the insights for this log file in a formatted table
    console.log("Insights for ".concat(filePath, ":"));
    console.log('Endpoint Calls:');
    console.table(endpointCounts);
    console.log('\nAPI Calls per Minute:');
    console.table(perMinuteCounts);
    console.log('\nAPI Calls by HTTP Status Code:');
    console.table(statusCounts);
}
// Process each log file
var logFiles = ['data.txt', 'data2.txt', 'data3.txt'];
logFiles.forEach(function (filePath) {
    processLogFile(filePath);
});
