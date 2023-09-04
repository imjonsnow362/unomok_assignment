"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fs = require("fs");
function extractEndpoint(line) {
    // Extract the endpoint from the line
    //This regex will capture one or more uppercase letters enclosed in double quotes,
    //zero or more characters after a forward slash / that are not double quotes, 
    //matches the literal string "HTTP"
    var endpointRegex = /"([A-Z]+) (\/[^"]*) HTTP/;
    var match = line.match(endpointRegex);
    return match ? match[2] : '';
}
function extractMinute(timestamp) {
    // Extract the minute from the timestamp
    //this line extracts the first 16 characters from the
    var minute = timestamp.substring(0, 16);
    return minute;
}
function extractStatusCode(line) {
    // Extract the status code from the line
    //matches the literal string "HTTP" followed by a forward slash, a digit, a dot, and another digit, followed by a double quote.
    //captures exactly three consecutive digits, representing the status code of the HTTP response.
    var statusCodeRegex = /HTTP\/\d\.\d" (\d{3})/;
    var match = line.match(statusCodeRegex);
    return match ? match[1] : '';
}
function processLogFile(filePath) {
    // Read the data from the file
    var data = fs.readFileSync(filePath, 'utf-8');
    // Split the data into lines
    var lines = data.split('\n');
    // Initialize variables to store insights for this log file
    //The endpointCounts object is used to keep track of the number of times each endpoint is called.
    var endpointCounts = {};
    //The statusCodeCounts object is used to store the count of each HTTP status code returned by the API.
    var statusCodeCounts = {};
    //The apiCallsPerMinute object is used to track the number of API calls made per minute.
    var apiCallsPerMinute = {};
    // Process each line of the log file
    for (var _i = 0, lines_1 = lines; _i < lines_1.length; _i++) {
        var line = lines_1[_i];
        //checks if the current line includes the string "HTTP/1.1" or "Running webapp API"
        if (line.includes('HTTP/1.1"') || line.includes('Running webapp API')) {
            var endpoint = extractEndpoint(line);
            endpointCounts[endpoint] = (endpointCounts[endpoint] || 0) + 1;
            //extracts a status code from the log file entries 
            var statusCode = extractStatusCode(line);
            statusCodeCounts[statusCode] = (statusCodeCounts[statusCode] || 0) + 1;
            //substring method is used to extract timestamp and then passed as argument to the function
            var timestamp = line.substring(0, 16);
            apiCallsPerMinute[timestamp] = (apiCallsPerMinute[timestamp] || 0) + 1;
        }
    }
    //Finally printing all the values in console 
    //Display the status code counts
    console.log('API Call Counts for each HTTP Status Code:');
    //console.log(statusCodeCounts);
    var statusCodeTable = Object.entries(statusCodeCounts).map(function (_a) {
        var statusCode = _a[0], count = _a[1];
        return ({
            statusCode: statusCode,
            count: count,
        });
    });
    console.table(statusCodeTable, ['statusCode', 'count']);
    console.log('API Calls per Minute:');
    var apiCallsPerMinuteTable = Object.entries(apiCallsPerMinute).map(function (_a) {
        var minute = _a[0], count = _a[1];
        return ({
            minute: minute,
            count: count,
        });
    });
    console.table(apiCallsPerMinuteTable, ['minute', 'count']);
    // Display the endpoint counts
    console.log('API Call Counts by Endpoint:');
    console.log(endpointCounts);
    var apiCallsTable = Object.entries(statusCodeCounts).map(function (_a) {
        var endpoint = _a[0], count = _a[1];
        return ({
            endpoint: endpoint,
            count: count,
        });
    });
    console.table(apiCallsTable, ['endpoint', 'count']);
    //console.table(Object.values(endpointCounts));
}
var logFiles = ['data.txt', /*'data2.txt',*/ /*'data3.txt'*/];
logFiles.forEach(function (filePath) {
    processLogFile(filePath);
});
