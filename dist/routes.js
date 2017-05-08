'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _invertedIndex = require('./inverted-index');

var _invertedIndex2 = _interopRequireDefault(_invertedIndex);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

/**
 * Define routes and route handlers
 * @function apiEndPoints
 * @param {Object} app -an express application instance
 * @returns {Object} -index object which maps from words to book object indexes
 */
var apiEndPoints = function apiEndpoints(app) {
  var invertedIndex = new _invertedIndex2.default();
  app.post('/api/create', function (req, res) {
    var _req$body = req.body,
        fileName = _req$body.fileName,
        fileContent = _req$body.fileContent;

    var index = invertedIndex.createIndex(fileName, fileContent);
    if (Array.isArray(index)) {
      return res.status(400).json(index[1]);
    }
    return res.status(200).json(index);
  });

  app.post('/api/search', function (req, res) {
    var _req$body2 = req.body,
        index = _req$body2.index,
        fileName = _req$body2.fileName,
        terms = _req$body2.terms;

    var termsArray = terms ? terms.split(', ') : [];
    var searchResult = invertedIndex.searchIndex.apply(invertedIndex, [index, fileName].concat(_toConsumableArray(termsArray)));
    if (typeof searchResult === 'string') {
      return res.status(400).json(searchResult);
    }
    return res.status(200).json(searchResult);
  });
};

exports.default = apiEndPoints;