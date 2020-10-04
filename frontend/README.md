# Frontend

## Available Scripts

In the project directory, you can run:

#### `npm install`

Installs the app dependencies and creates the folder node_modules. Needed to run `npm start`.

#### `npm start`

Runs the app in the development mode.<br />
If you wan't the backend-server to work you need to set:
```bash
export NODE_ENV=development
```
before you run the server!

Open [http://localhost:4100](http://localhost:4100) to view it in the browser.

The page will reload if you make edits.<br />
You will also see any lint errors in the console.

#### `npm test`

Launches the test runner in the interactive watch mode.<br />
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

## Learn More

To learn React, check out the [React documentation](https://reactjs.org/).

To learn React-Redux, check-out [React-Redux documentation](https://redux.js.org/introduction/getting-started).

## Structure
```
.
├── Dockerfile              =>  Builds the app using docker (keep away!)
├── nginx.conf              =>  Nginx config
├── package-lock.json       =>  Package dependencies (keep away!)
├── package.json            =>  Package dependencies (keep away!)
├── public                  =>  Only for a few images, index.html, etc. No CSS!
└── src                     =>  Main entry-point for all code.