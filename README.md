# inverted-index-api
[![Codacy Badge](https://api.codacy.com/project/badge/Grade/e135572b08d9452c887b38b232cb220f)](https://www.codacy.com/app/tomipaul/inverted-index-api?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=tomipaul/inverted-index-api&amp;utm_campaign=Badge_Grade) [![Coverage Status](https://coveralls.io/repos/github/tomipaul/inverted-index-api/badge.svg?branch=development)](https://coveralls.io/github/tomipaul/inverted-index-api?branch=master) [![Build Status](https://travis-ci.org/tomipaul/inverted-index-api.svg?branch=development)](https://travis-ci.org/tomipaul/inverted-Index-api)

## Introduction
*  **`inverted-index-api`** is an express application that implements an efficient search functionality using inverted index. Rather than map a document object to an array of the terms it contains, inverted index maps a term to an array of the documents that contains it.
*  It has the following features;
  * Allow users to create index from a JSON array of document objects
  * Allow users to search index for terms

## Dependencies
*  **[Node.js](https://nodejs.org/en)** - Node.js® is a JavaScript runtime built on Chrome's V8 JavaScript engine
*  **[Express](https://expressjs.com)** - Express is a minimal and flexible Node.js web application framework that provides a robust set of features for web and mobile applications.
*  **[body-parser](https://github.com/expressjs/body-parser)** - Node.js body parsing middleware.
*  **[dotenv](https://github.com/motdotla/dotenv)** - Dotenv is a zero-dependency module that loads environment variables from a .env file into process.env
*  **[Babel](https://babeljs.io/)** - Babel is a JavaScript compiler.
*  **[Supertest](https://github.com/visionmedia/supertest)** - provide a high-level abstraction for testing HTTP
*  **[eslint](https://github.com/eslint/eslint)** - A fully pluggable tool for identifying and reporting on patterns in JavaScript.
*  **[gulp](https://github.com/gulpjs/gulp)** - gulp is a toolkit that helps you automate painful or time-consuming tasks in your development workflow.
  * Gulp plugins include;
    *  **[gulp-jasmine-node](https://github.com/alex-pollan/gulp-jasmine-node)**
    *  **[gulp-nodemon](https://github.com/JacksonGariety/gulp-nodemon)**
    *  **[gulp-babel](https://github.com/babel/gulp-babel)**
    *  **[gulp-babel-istanbul](https://github.com/cb1kenobi/gulp-babel-istanbul)**
    *  **[gulp-coveralls](https://github.com/markdalgleish/gulp-coveralls)**
    *  **[gulp-cli](https://github.com/gulpjs/gulp-cli)**
    *  **[gulp-inject-modules](https://github.com/cb1kenobi/gulp-inject-modules)**
    *  **[gulp-rename](https://github.com/hparra/gulp-rename)**

## Installation and setup
*  Install **[Node.js](https://nodejs.org/en/download/)**
*  Install gulp-cli globally using `npm install -g gulp-cli`
*  Navigate to a directory of choice on `terminal`.
*  Clone this repository on that directory.
  *  Using SSH;

    >`git clone git@github.com:tomipaul/inverted-index-api.git`

  *  Using HTTP;

    >`https://github.com/tomipaul/inverted-index-api.git`

*  Navigate to the repo's folder on your computer
  *  `cd inverted-index-api/`
*  Install other dependencies using `npm install`
*  Using the .env.example, create a .env file. Set the NODE_ENV to PROD, TEST or DEV and set the ports
*  Run the application using `gulp serve`
*  Running the command above will produce output that's similar to the sample below.

```
  [02:51:55] Requiring external module babel-register
  [02:51:59] Using gulpfile ~\Documents\Andela\Andela21\inverted-index-api\gulpfile.babel.js
  [02:51:59] Starting 'babelifySrcFiles'...
  [02:52:01] Finished 'babelifySrcFiles' after 1.76 s
  [02:52:01] Starting 'serve'...
  [02:52:03] Finished 'serve' after 2.33 s
  [02:52:03] [nodemon] 1.11.0
  [02:52:03] [nodemon] to restart at any time, enter `rs`
  [02:52:03] [nodemon] watching: *.*
  [02:52:03] [nodemon] starting `node dist/app.js`
  App listening on 3000
```

## Tests
*  The tests have been written using Jasmine framework and assertion library
*  Run the test with `gulp run-tests`
*  Running the above command will run the tests and write a coverage report using **[istanbul](https://github.com/cb1kenobi/gulp-babel-istanbul)**
*  If the tests are successful, they will complete without failures or errors.

  ```
  Finished in 0.529 seconds
  37 tests, 88 assertions, 0 failures, 0 skipped
  ```
* This will be followed by the coverage report in tabular format

  ```
  --------------------|----------|----------|----------|----------|----------------|
  File                |  % Stmts | % Branch |  % Funcs |  % Lines |Uncovered Lines |
  --------------------|----------|----------|----------|----------|----------------|
   src\               |    96.08 |    89.71 |       96 |    96.04 |                |
    app.js            |       85 |    33.33 |    66.67 |       85 |        8,12,21 |
    inverted-index.js |    98.46 |    94.64 |      100 |    98.44 |             55 |
    routes.js         |      100 |      100 |      100 |      100 |                |
  --------------------|----------|----------|----------|----------|----------------|
  All files           |    96.08 |    89.71 |       96 |    96.04 |                |
  --------------------|----------|----------|----------|----------|----------------|
  
  
  =============================== Coverage summary ===============================
  Statements   : 96.08% ( 98/102 )
  Branches     : 89.71% ( 61/68 )
  Functions    : 96% ( 24/25 )
  Lines        : 96.04% ( 97/101 )
  ================================================================================
  ```
## Contributions
**Contributions are welcome.** [![contributions welcome](https://img.shields.io/badge/contributions-welcome-brightgreen.svg?style=flat)](https://github.com/tomipaul/inverted-index-api/issues)
1. Fork this repositry.
2. Clone to you local environment: git clone git@github.com:your-username/inverted-index.git
3. Create a branch on a feature you want to work on: git checkout -b proposed-feature
4. Commit your changes: git commit -m "new stuff added"
5. Push to the remote branch: git push origin proposed-feature
6. Open a pull request on here