import * as fs from 'fs';

// Function to process log data from a file
function processLogFile(filePath: string) {
  // Read the data from the file
  const data = fs.readFileSync(filePath, 'utf-8');

  // Initialize variables to store insights for this log file
  const endpointCounts: { [key: string]: number } = {};
  const perMinuteCounts: { [key: string]: number } = {};
  const statusCounts: { [key: string]: number } = {};

  // Split the data into lines
  const lines = data.split('\n');

  // Process each line of the log data
  lines.forEach((line) => {
    // Split the line into parts
    const parts = line.split(' ');

    // Extract the timestamp and endpoint/status code
    const timestamp = parts.slice(0, 2).join(' ');
    const info = parts.slice(2).join(' ');

    // Count endpoint calls
    if (info.includes('Running webapp API')) {
      const endpointMatch = info.match(/Port (\d+)/);
      if (endpointMatch) {
        const endpoint = endpointMatch[1];
        if (endpointCounts[endpoint]) {
          endpointCounts[endpoint]++;
        } else {
          endpointCounts[endpoint] = 1;
        }
      }
    }

    // Count per minute API calls
    const minute = timestamp.split(':')[0];
    if (perMinuteCounts[minute]) {
      perMinuteCounts[minute]++;
    } else {
      perMinuteCounts[minute] = 1;
    }

    // Count API calls by HTTP status code
    const statusCodeMatch = info.match(/\[3(\d+)m/);
    if (statusCodeMatch) {
      const statusCode = statusCodeMatch[1];
      if (statusCounts[statusCode]) {
        statusCounts[statusCode]++;
      } else {
        statusCounts[statusCode] = 1;
      }
    }
  });

  // Display the insights for this log file in a formatted table
  console.log(`Insights for ${filePath}:`);
  console.log('Endpoint Calls:');
  console.table(endpointCounts);

  console.log('\nAPI Calls per Minute:');
  console.table(perMinuteCounts);

  console.log('\nAPI Calls by HTTP Status Code:');
  console.table(statusCounts);
}

// Process each log file
const logFiles: string[] = ['data.txt', 'data2.txt', 'data3.txt'];
logFiles.forEach((filePath) => {
  processLogFile(filePath);
});
