/** Class representing an InvertedIndex application */
class InvertedIndex {
  /**
   * Create an instance of InvertedIndex
   * @constructor
   */
  constructor() {
    this.indexes = {};
  }

  /**
   * assert fileContent is a non-empty valid JSON array
   * @method validateFileContent
   * @static
   * @param {array} fileContent - Content of uploaded file; JSON array of book Objects
   * @returns {array.Boolean.<true>} [true] if fileContent is valid
   * @returns {array} [false, invalid|empty|malformed] if fileContent is Invalid
   */
  static validateFileContent(fileContent) {
    if (!Array.isArray(fileContent)) {
      return [false, 'Invalid!'];
    } else if (!fileContent.length) {
      return [false, 'Empty!'];
    }
    return this.validateBookObjs(fileContent);
  }

  /**
   * assert book objects in JSON array is not malformed
   * @method checkFileContent
   * @static
   * @param {array} fileContent -Array of books in JSON file
   * @returns {array} [true] if books are valid
   * [false, 'malformed', malformedObjects] if some are malformed
   */
  static validateBookObjs(fileContent) {
    const isNotMalformed = fileContent.every((book) => {
      return this.checkBookObj(book);
    });
    return (isNotMalformed) ?
    [true] : [false, 'Malformed!'];
  }

  /**
   * Checks if a book object is valid
   * A book object should have two keys; title and text
   * The title and text should be non-empty strings
   * @method checkBookObj
   * @static
   * @param {Object} book -A book object in the JSON Array
   * @returns {Boolean} -true if object is valid, false otherwise
   */
  static checkBookObj(book) {
    if (typeof book !== 'object') {
      return false;
    }
    const bookKeys = Object.keys(book);
    return (bookKeys.length === 2 &&
    bookKeys.includes('title') &&
    book.title &&
    !/^(\s*|\W*)$/.test(book.title) &&
    typeof book.title === 'string' &&
    bookKeys.includes('text') &&
    book.text &&
    !/^(\s*|\W*)$/.test(book.text) &&
    typeof book.text === 'string');
  }

  /**
   * normalize and tokenize text of a book Object
   * @method analyse
   * @static
   * @param {Object} book -Book object with title and text properties
   * @return {array.<string>} -an arry of words in book
   */
  static analyse(book) {
    const bookText = book.text;
    const normalizedBookText = this.normalize(bookText);
    const bookTokens = normalizedBookText.split(/\s+/);
    return bookTokens;
  }

  /**
   * normalize a string before splitting into tokens
   * replaces all non-word characters and underscore with spaces
   * removes whitespaces at both ends of the string
   * converts all characters into lowercase
   * @method normalize
   * @static
   * @param {string} text -a non-empty string
   * @returns {string} -normalized string
   */
  static normalize(text) {
    return text.replace(/\W+|_+/g, ' ').trim().toLowerCase();
  }

  /**
   * flattens an array
   * @method flattenArray
   * @static
   * @param {array} nestedArray -A multidimensional array
   * @returns {array} -A one dimensional array
   */
  static flattenArray(nestedArray) {
    return nestedArray.reduce((arr, item) => {
      return arr.concat(Array.isArray(item) ?
       this.flattenArray(item) : item);
    }, []);
  }

  /**
   * Search for simultaneous occurence of two or more words in a book Object
   * @method multiTermSearch
   * @static
   * @param {Object} index - Index to be searched
   * @param {string} chainedTerms - A space delimited string of two or more terms
   * @returns {array} -An array of book Object indexes where terms occur simultaneously
   */
  static multiTermSearch(index, chainedTerms) {
    const termsArray = chainedTerms.split(' ');
    const indicesArray = termsArray.reduce((acc, term) => {
      const indices = index[term] || [];
      acc.push(...indices);
      return acc;
    }, []);
    const indexCount = {};
    indicesArray.forEach((val) => {
      Object.prototype.hasOwnProperty.call(indexCount, val) ?
      indexCount[val] += 1 : indexCount[val] = 1;
    });
    const bookContainsAll = [];
    Object.keys(indexCount).forEach((bookIndex) => {
      if (indexCount[bookIndex] === termsArray.length) {
        bookContainsAll.push(parseInt(bookIndex, 10));
      }
    });
    return bookContainsAll;
  }

  /**
   * create a map from words in books text to indices of books that contain them
   * @method createIndex
   * @param {string} fileName -Name of uploaded JSON file
   * @param {array} fileContent -JSON array of book objects
   * @returns {Object.<array>} -A map from words to array of book indices
   */
  createIndex(fileName, fileContent) {
    const nameIsValid = (typeof fileName === 'string'
     && /^\w+.json$/i.test(fileName));
    const contentIsValid = InvertedIndex.validateFileContent(fileContent);
    if (nameIsValid && contentIsValid[0]) {
      const index = {};
      fileContent.forEach((book, bookIndex) => {
        InvertedIndex.analyse(book).forEach((token) => {
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
      return { ...this.indexes };
    }
    return (!nameIsValid) ? [false, 'File name Invalid'] : contentIsValid;
  }

  /**
   * search for occurence of terms in an index
   * @param {Object} index -Index object that maps from filenames to indexes
   * @param {string} fileName -Name of an indexed file
   * @param {array|string} terms -Tokens to search for in index
   * @returns {Object} -A map from filename to an index object that
   *  maps from terms to array of Books' indices that contains terms
   */
  searchIndex(index, fileName, ...terms) {
    if (Array.isArray(index) || typeof index !== 'object'
     || !Object.keys(index).length) {
      return 'Invalid index Object';
    } else if (!terms || !terms.length) {
      return 'Terms cannot be empty';
    }
    const searchedIndex = (fileName) ?
     { [fileName]: index[fileName] } : index;
    return Object.keys(searchedIndex).reduce((acc, filename) => {
      const indexObj = searchedIndex[filename];
      const searchedTerms = InvertedIndex.flattenArray(terms);
      const searchResult = searchedTerms.reduce((obj, term) => {
        const normalizedTerm = InvertedIndex.normalize(term);
        obj[normalizedTerm] = /\w+ \w+/g.test(normalizedTerm) ?
        InvertedIndex.multiTermSearch(indexObj, normalizedTerm) :
         indexObj[normalizedTerm] || [];
        return obj;
      }, {});
      acc[filename] = searchResult;
      return acc;
    }, {});
  }
}

export default InvertedIndex;
