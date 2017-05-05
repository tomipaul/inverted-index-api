/** Class representing an InvertedIndex application */
class InvertedIndex {
  /**
   * Create an inverted index application
   * @constructor
   */
  constructor() {
    this.indexes = {};
  }

  /**
   * assert fileContent is a non-empty valid JSON array
   * @param {array} fileContent - Content of uploaded file
   * @returns {array.Boolean.<true>} [true] if fileContent is valid
   * @returns {array} [false, invalid|empty|if fileContent is Invalid
   */
  static validateFileContent(fileContent) {
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
  static checkBooks(fileContent) {
    // to be name checkFileContent
    const isNotMalformed = fileContent.every((book) => {
      return this.checkBook(book);
    });
    return (isNotMalformed) ?
    [true] : [false, 'malformed'];
  }

  /**
   * Checks if book is valid
   * @param {Object} book -A book object in the JSON file
   * @returns {array} - acc = [] | acc = [bookIndex]
   */
  static checkBook(book) {
    // to be named checkBookObjectsaz
    /* fileObj should have two keys - title and text
    title and text should be non-empty strings */
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
   * normalize and tokenize book contents
   * @param {Object} book -Book object
   * @param {string} book.title -title of the book
   * @param {string} book.text -text of the book
   * @return {array.<string>} -an arry of words in book
   */
  static analyse(book) {
    // merge title and text of the object
    const bookText = `${book.title} ${book.text}`;
    // change all non-word characters including '_' to ' '
    const normalizedBookText = bookText
    .replace(/\W+|_+/g, ' ').trim().toLowerCase();
    // tokenize; split normalized book text to word units
    const bookTokens = normalizedBookText.split(/\s+/);
    return bookTokens;
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
   * Search for occurence of two or more words in a book
   * @param {Object} index - Index to be searched
   * @param {string} chainedTerms - A space delimited string
   *  of two or more words
   * @returns {array} -An array of books where terms occur simultaneously
   */
  static multiTermSearch(index, chainedTerms) {
    // 'we are here' to ['we', 'are', 'here]
    const termsArray = chainedTerms.split(' ');
    // Accumulate indexes of all terms
    // [[0, 1], [4, 5], [5, 1]] to [0, 1, 4, 5, 5, 1]
    const indicesArray = termsArray.reduce((acc, term) => {
      const indices = index[term] || [];
      acc.push(...indices);
      return acc;
    }, []);
    const indexCount = {};
    // count the number of occurence of each index in indicesArray
    indicesArray.forEach((val) => {
      Object.prototype.hasOwnProperty.call(indexCount, val) ?
      indexCount[val] += 1 : indexCount[val] = 1;
    });
    const bookContainsAll = [];
    /* Knowing that each index can only occur once for a term
     if an index frequency is equal to the number of search terms
     then each search term has the index
     ===> the book at that index has all terms */
    Object.keys(indexCount).forEach((bookIndex) => {
      if (indexCount[bookIndex] === termsArray.length) {
        bookContainsAll.push(parseInt(bookIndex, 10));
      }
    });
    return bookContainsAll;
  }

  /**
   * create a map from words in book to indices of books that contain them
   * @param {string} fileName -Name of uploaded JSON file
   * @param {array} fileContent -JSON array of book objects
   * @returns {Object.<array>} -A map from words to array of book indices
   */
  createIndex(fileName, fileContent) {
    // Check if file is valid
    const nameIsValid = (typeof fileName === 'string'
     && /^\w+.json$/i.test(fileName));
    const contentIsValid = InvertedIndex.validateFileContent(fileContent);
    if (nameIsValid && contentIsValid[0]) {
      const index = {};
      fileContent.forEach((book, bookIndex) => {
        // for each book in the file, analyse
        InvertedIndex.analyse(book).forEach((token) => {
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
      return { ...this.indexes };
    }
    return (!nameIsValid) ? [false, 'File name Invalid'] : contentIsValid;
  }

  /**
   * search for occurence of terms in an index
   * @param {Object} index -Index object that maps from filenames to indexes
   * @param {string} fileName -Name of an indexed file
   * @param {array|string} terms -Tokens to search for in index
   * @returns {Object} -A map from token to array of Books
   *  that contains token
   */
  searchIndex(index, fileName, ...terms) {
    const searchedIndex = (fileName) ?
     { [fileName]: index[fileName] } : index;
    return Object.keys(searchedIndex).reduce((acc, filename) => {
      const indexObj = searchedIndex[filename];
      const searchedTerms = InvertedIndex.flattenArray(terms);
      const searchResult = searchedTerms.reduce((obj, term) => {
        const normalizedTerm = term.replace(/\W+/g, ' ').trim().toLowerCase();
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
