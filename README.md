# Broker
A web application that assimilates broker data from multiple sources.

## Setup
This application requires Node.js to function. To set up the application, input the following command lines
- git clone [This repository]
- cd broker
- npm install 
- node app

This will launch the express server locally. The webpage can be viewed at http:localhost:3000, although the URL and port number can be changed.

## Tests
Tests can be run through the following
- npm run test

## Usage
CSV files can be added to the CSV folder, which the express app will automatically process. To modify the header matching, the regular expressions used to match CSV headers can be altered within csvHeaderConfig.js. Data is stored in memory in a SQLite3 database for demonstration purposes. Any data stored in the database will be lost when the express application closes; however, any CSV files in the CSV folder will be automatically processed once the express application launches.

## Libraries used
- node.js
- express.js
- EJS
- chokidar
- sqlite3
- mime-types
- moment
- Jest
- supertest
- tabulator
