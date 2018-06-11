# Scheduler

Scheduler is an on-demand shift allocation platform that enables employers and event planners to match shifts with available workers in real-time for immediate fulfilment.

### Prerequisites

This document focuses on running the web app and that you have NPM and Git experience/knowledge.

## Installation

This section assumes you are running a local web server (E.g WAMP or MAMP) or planning on using the Hot Module Replacement (HMR) web server.

Clone the `master` branch from Git repo to your local machine. 

Navigation to where you have cloned the project files.

Install NPM modules:

`npm install`

Build and watch assets (JS, Sass, Fonts, Images etc):

## Development

This will compile and watch files for changes with development rules applied, outputting everything to the `public` folder.

`npm run dev`

You should be able to visit the web app at [http://localhost](http://localhost) in your browser, manually refreshing to see changes.

## Development using Hot Module Replacement (HMR)

This will compile and watch files for changes with development rules applied. 

You do not need to have a local web server (E.g WAMP or MAMP) for HMR as HMR will create a development web server for you and serve the files for you.

Your default browser will be opened and automatically reloaded when changes are made to the files.

`npm run hot`

You should be able to visit the web app in your browser, if it hasn't opened automatically.

## Testing

`npm run test`

This will test all files and generate a coverage report.

## Linting

`npm run lint`

This will test all files against code standards.

## Production

`npm run prod`

This will compile all files with production rules applied, outputting everything to the `public` folder.
