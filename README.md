# ngShell

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 1.0.4.

To setup to work with this project please follow these steps:

-> install node and npm (if not installed) - 
      http://blog.teamtreehouse.com/install-node-js-npm-windows
      https://nodejs.org/en/download/
      
-> install chrome, chrome developer tools and CORS plugin for chrome
        in Chrome developer tools under network check ‘disable cache’
        enable the CORS plugin in the toolpbar
        https://developer.chrome.com/devtools
        https://chrome.google.com/webstore/detail/allow-control-allow-origi/nlfbmbojpeacfghkpbjhddihlkkiljbi?hl=en
    
-> in the terminal go to the project directory and type “npm install”
	      the project will then have a directory called “node_modules”
	
-> I recommend using WEBSTORM as the editor/SDK for front-end dev.
   If using Webstorm open the project in Webstorm.
    answer the ‘compile to typescript’ question “no”
	  Run/edit configurations, add these:
			Javascript Debug 
					Name: Run in Chrome
					URL: http://localhost:4200
			Node.js
					Name: Mock API Server
					Working directory: path to the project 
									/Users/me/WebstormProjects/ngShell
					JavaScript file: mockserver.js
			npm 
					Name: Front End Server
					package.json: path to package.json in project
					Command: run
					Scripts: start
					(… and any other scripts to run)
					
-> If not using webstorm you can use the terminal commands below to start servers and any editor (e.g.visual studio) to view code
 					
## Mock API Server
Run		'node mockserver.js' for a mock API server. This file is a simple node express server to serve canned data to the front-end.
      The server runs at localhost:3500 - that is where the front-end looks for the api. 
      The 'baseUrl' and 'port' for API are set on the front-end in src/app/shared/services/api/api.service.ts

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Code scaffolding (I recommend adding components and services manually)

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `-prod` flag for a production build.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).
Before running the tests make sure you are serving the app via `ng serve`.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).

--> One the API server and the dev server are running the front-end can be seen locally at localhost:4200 in any browser. 
    Use Chrome with the CORS enabled to avoid cross-domain errors accessing the mock API server. 
