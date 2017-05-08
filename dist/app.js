'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _bodyParser = require('body-parser');

var _bodyParser2 = _interopRequireDefault(_bodyParser);

var _dotenv = require('dotenv');

var _dotenv2 = _interopRequireDefault(_dotenv);

var _routes = require('./routes');

var _routes2 = _interopRequireDefault(_routes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var setPort = function setPort() {
  if (process.env.NODE_ENV === 'DEV') {
    return process.env.PORT_DEV;
  } else if (process.env.NODE_ENV === 'TEST') {
    return process.env.PORT_TEST;
  }
  return process.env.PORT_PROD;
};

_dotenv2.default.config();
var app = (0, _express2.default)();
var port = setPort();
app.use(_bodyParser2.default.json());
// eslint-disable-next-line no-unused-vars
app.use(function (err, req, res, next) {
  res.status(500).send('Request could not be completed. Please try again');
});
(0, _routes2.default)(app);
app.listen(port, function () {
  // eslint-disable-next-line no-console
  console.log('App listening on ' + port);
});

exports.default = app;