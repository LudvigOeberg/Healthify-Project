# Jest test cases using selenium-webdriver

In the frontend directory, run the following command to install selenium webdriver and jest:

####   `npm install selenium-webdriver`

####    `npm install jest`

Chromedriver is need to enable selenium start up chrome. Chromedriver can be downloaded at [selenium-chrome-driver](https://chromedriver.chromium.org/downloads).

Select a version of chromedriver that is the same as the version of google chrome on your computer.

Place the downloaded file in any folder in your computer, and source the file, so that it becomes availabe on all terminals.

In the frontend directory, run the following command to intall the chromedriver package.

####   `npm install chromedriver`

Once all these are setup, then we are ready to run our tests

## Running tests

To run the tests, we need three terminals open, a terminal to run the backend, a terminal to run the frontend, and a terminal to run the tests.

While the backend and frontend terminals are up and running, run the following commands in the frontend directory in your test terminal:

#### `export ehr_user=<username from RO>`
#### `export ehr_user_pass=<password from RO>`
#### `export NODE_ENV=development`

To run a specific test script, run:

#### `npm run jest <name of the script>`

To run all scripts in the test directory, run:
#### `npm run jest`
