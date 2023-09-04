import * as fs from 'fs';

function extractEndpoint(line: string): string {
  // Extract the endpoint from the line
  //This regex will capture one or more uppercase letters enclosed in double quotes,
  //zero or more characters after a forward slash / that are not double quotes, 
  //matches the literal string "HTTP"
  const endpointRegex = /"([A-Z]+) (\/[^"]*) HTTP/;
  const match = line.match(endpointRegex);
  return match ? match[2] : '';
}

function extractMinute(timestamp: string): string {
  // Extract the minute from the timestamp
  //this line extracts the first 16 characters from the
  const minute = timestamp.substring(0, 16);
  return minute;
}

function extractStatusCode(line: string): string {
  // Extract the status code from the line
  //matches the literal string "HTTP" followed by a forward slash, a digit, a dot, and another digit, followed by a double quote.
  //captures exactly three consecutive digits, representing the status code of the HTTP response.
  const statusCodeRegex = /HTTP\/\d\.\d" (\d{3})/;
  const match = line.match(statusCodeRegex);
  return match ? match[1] : '';
}

function processLogFile(filePath: string) {
  // Read the data from the file
  const data = fs.readFileSync(filePath, 'utf-8');

  // Split the data into lines
  const lines = data.split('\n');

  // Initialize variables to store insights for this log file
  //The endpointCounts object is used to keep track of the number of times each endpoint is called.
  const endpointCounts: { [endpoint: string]: number } = {};
  //The statusCodeCounts object is used to store the count of each HTTP status code returned by the API.
  const statusCodeCounts: { [statusCode: string]: number } = {};
  //The apiCallsPerMinute object is used to track the number of API calls made per minute.
  const apiCallsPerMinute: { [minute: string]: number } = {};

  // Process each line of the log file
  for (const line of lines) {
    //checks if the current line includes the string "HTTP/1.1" or "Running webapp API"
    if (line.includes('HTTP/1.1"') || line.includes('Running webapp API')) {
      const endpoint = extractEndpoint(line);
      endpointCounts[endpoint] = (endpointCounts[endpoint] || 0) + 1;

      //extracts a status code from the log file entries 
      const statusCode = extractStatusCode(line);
      statusCodeCounts[statusCode] = (statusCodeCounts[statusCode] || 0) + 1;

      //substring method is used to extract timestamp and then passed as argument to the function
      const timestamp = line.substring(0, 16);
      apiCallsPerMinute[timestamp] = (apiCallsPerMinute[timestamp] || 0) + 1;
    }
  }

  //Finally printing all the values in console 

  //Display the status code counts
  console.log('API Call Counts for each HTTP Status Code:');
  //console.log(statusCodeCounts);
  const statusCodeTable = Object.entries(statusCodeCounts).map(([statusCode, count]) => ({
    statusCode,
    count,
  }));
  console.table(statusCodeTable, ['statusCode', 'count']);

  console.log('API Calls per Minute:');
  const apiCallsPerMinuteTable = Object.entries(apiCallsPerMinute).map(([minute, count]) => ({
    minute,
    count,
  }));
  console.table(apiCallsPerMinuteTable, ['minute', 'count']);

  // Display the endpoint counts
  console.log('API Call Counts by Endpoint:');
  console.log(endpointCounts);
  const apiCallsTable = Object.entries(statusCodeCounts).map(([endpoint, count]) => ({
    endpoint,
    count,
  }));
  console.table(apiCallsTable, ['endpoint', 'count']);
  //console.table(Object.values(endpointCounts));
}

const logFiles: string[] = ['data.txt', 'data2.txt', 'data3.txt'];
logFiles.forEach((filePath) => {
  processLogFile(filePath);
});
