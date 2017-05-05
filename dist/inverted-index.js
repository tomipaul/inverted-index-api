'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/** Class representing an InvertedIndex application */
var InvertedIndex = function () {
  /**
   * Create an inverted index application
   * @constructor
   */
  function InvertedIndex() {
    _classCallCheck(this, InvertedIndex);

    this.indexes = {};
  }

  /**
   * assert fileContent is a non-empty valid JSON array
   * @param {array} fileContent - Content of uploaded file
   * @returns {array.Boolean.<true>} [true] if fileContent is valid
   * @returns {array} [false, invalid|empty|if fileContent is Invalid
   */


  _createClass(InvertedIndex, [{
    key: 'createIndex',


    /**
     * create a map from words in book to indices of books that contain them
     * @param {string} fileName -Name of uploaded JSON file
     * @param {array} fileContent -JSON array of book objects
     * @returns {Object.<array>} -A map from words to array of book indices
     */
    value: function createIndex(fileName, fileContent) {
      // Check if file is valid
      var nameIsValid = typeof fileName === 'string' && /^\w+.json$/i.test(fileName);
      var contentIsValid = InvertedIndex.validateFileContent(fileContent);
      if (nameIsValid && contentIsValid[0]) {
        var index = {};
        fileContent.forEach(function (book, bookIndex) {
          // for each book in the file, analyse
          InvertedIndex.analyse(book).forEach(function (token) {
            // for each token in analysed book text, check and update `indexes`
            if (Object.prototype.hasOwnProperty.call(index, token)) {
              if (!index[token].includes(bookIndex)) {
                index[token].push(bookIndex);
              }
            } else {
              index[token] = [bookIndex];
            }
          });
        });
        this.indexes[fileName] = index;
        return _extends({}, this.indexes);
      }
      return !nameIsValid ? [false, 'File name Invalid'] : contentIsValid;
    }

    /**
     * search for occurence of terms in an index
     * @param {Object} index -Index object that maps from filenames to indexes
     * @param {string} fileName -Name of an indexed file
     * @param {array|string} terms -Tokens to search for in index
     * @returns {Object} -A map from token to array of Books
     *  that contains token
     */

  }, {
    key: 'searchIndex',
    value: function searchIndex(index, fileName) {
      for (var _len = arguments.length, terms = Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
        terms[_key - 2] = arguments[_key];
      }

      var searchedIndex = fileName ? _defineProperty({}, fileName, index[fileName]) : index;
      return Object.keys(searchedIndex).reduce(function (acc, filename) {
        var indexObj = searchedIndex[filename];
        var searchedTerms = InvertedIndex.flattenArray(terms);
        var searchResult = searchedTerms.reduce(function (obj, term) {
          var normalizedTerm = term.replace(/\W+/g, ' ').trim().toLowerCase();
          obj[normalizedTerm] = /\w+ \w+/g.test(normalizedTerm) ? InvertedIndex.multiTermSearch(indexObj, normalizedTerm) : indexObj[normalizedTerm] || [];
          return obj;
        }, {});
        acc[filename] = searchResult;
        return acc;
      }, {});
    }
  }], [{
    key: 'validateFileContent',
    value: function validateFileContent(fileContent) {
      if (!Array.isArray(fileContent)) {
        return [false, 'invalid'];
      } else if (!fileContent.length) {
        return [false, 'empty'];
      }
      return this.checkBooks(fileContent);
    }

    /**
     * Checks if books in fileContent are valid Objects
     * @param {array} fileContent -Array of books in JSON file
     * @returns {array} [true] if books are valid
     * [false, 'malformed', malformedObjects] if some are malformed
     */

  }, {
    key: 'checkBooks',
    value: function checkBooks(fileContent) {
      var _this = this;

      // to be name checkFileContent
      var isNotMalformed = fileContent.every(function (book) {
        return _this.checkBook(book);
      });
      return isNotMalformed ? [true] : [false, 'malformed'];
    }

    /**
     * Checks if book is valid
     * @param {Object} book -A book object in the JSON file
     * @returns {array} - acc = [] | acc = [bookIndex]
     */

  }, {
    key: 'checkBook',
    value: function checkBook(book) {
      // to be named checkBookObjectsaz
      /* fileObj should have two keys - title and text
      title and text should be non-empty strings */
      if ((typeof book === 'undefined' ? 'undefined' : _typeof(book)) !== 'object') {
        return false;
      }
      var bookKeys = Object.keys(book);
      return bookKeys.length === 2 && bookKeys.includes('title') && book.title && !/^(\s*|\W*)$/.test(book.title) && typeof book.title === 'string' && bookKeys.includes('text') && book.text && !/^(\s*|\W*)$/.test(book.text) && typeof book.text === 'string';
    }

    /**
     * normalize and tokenize book contents
     * @param {Object} book -Book object
     * @param {string} book.title -title of the book
     * @param {string} book.text -text of the book
     * @return {array.<string>} -an arry of words in book
     */

  }, {
    key: 'analyse',
    value: function analyse(book) {
      // merge title and text of the object
      var bookText = book.title + ' ' + book.text;
      // change all non-word characters including '_' to ' '
      var normalizedBookText = bookText.replace(/\W+|_+/g, ' ').trim().toLowerCase();
      // tokenize; split normalized book text to word units
      var bookTokens = normalizedBookText.split(/\s+/);
      return bookTokens;
    }

    /**
     * flattens an array
     * @method flattenArray
     * @static
     * @param {array} nestedArray -A multidimensional array
     * @returns {array} -A one dimensional array
     */

  }, {
    key: 'flattenArray',
    value: function flattenArray(nestedArray) {
      var _this2 = this;

      return nestedArray.reduce(function (arr, item) {
        return arr.concat(Array.isArray(item) ? _this2.flattenArray(item) : item);
      }, []);
    }

    /**
     * Search for occurence of two or more words in a book
     * @param {Object} index - Index to be searched
     * @param {string} chainedTerms - A space delimited string
     *  of two or more words
     * @returns {array} -An array of books where terms occur simultaneously
     */

  }, {
    key: 'multiTermSearch',
    value: function multiTermSearch(index, chainedTerms) {
      // 'we are here' to ['we', 'are', 'here]
      var termsArray = chainedTerms.split(' ');
      // Accumulate indexes of all terms
      // [[0, 1], [4, 5], [5, 1]] to [0, 1, 4, 5, 5, 1]
      var indicesArray = termsArray.reduce(function (acc, term) {
        var indices = index[term] || [];
        acc.push.apply(acc, _toConsumableArray(indices));
        return acc;
      }, []);
      var indexCount = {};
      // count the number of occurence of each index in indicesArray
      indicesArray.forEach(function (val) {
        Object.prototype.hasOwnProperty.call(indexCount, val) ? indexCount[val] += 1 : indexCount[val] = 1;
      });
      var bookContainsAll = [];
      /* Knowing that each index can only occur once for a term
       if an index frequency is equal to the number of search terms
       then each search term has the index
       ===> the book at that index has all terms */
      Object.keys(indexCount).forEach(function (bookIndex) {
        if (indexCount[bookIndex] === termsArray.length) {
          bookContainsAll.push(parseInt(bookIndex, 10));
        }
      });
      return bookContainsAll;
    }
  }]);

  return InvertedIndex;
}();

exports.default = InvertedIndex;