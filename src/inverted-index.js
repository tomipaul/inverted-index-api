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
   * @param {*} fileContent - Content of uploaded file
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
    const malformedObjs = fileContent.reduce((acc, book, bookIndex) => {
      return (typeof book === 'object') ?
      this.checkBook(acc, book, bookIndex) :
      (acc.push(bookIndex), acc);
    }, []);
    return (malformedObjs.length) ?
     [false, 'malformed', malformedObjs] : [true];
  }

  /**
   * Checks if book is valid
   * @param {array} acc -Accumulator
   * @param {Object} book -A book object in the JSON file
   * @param {*} bookIndex -Index of the book object in the array
   * @returns {array} - acc = [] | acc = [bookIndex]
   */
  static checkBook(acc, book, bookIndex) {
    /* fileObj should have two keys - title and text
    title and text should be non-empty strings */
    const bookKeys = Object.keys(book);
    return (bookKeys.length === 2 &&
    bookKeys.includes('title') &&
    book.title &&
    typeof book.title === 'string' &&
    bookKeys.includes('text') &&
    book.text &&
    typeof book.text === 'string') ?
    acc : (acc.push(bookIndex), acc);
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
   * flattens array
   * @param {array} nestedArray -A multidimensional array
   * @returns {array} -A one dimensional array
   */
  static flattenArray(nestedArray) {
    nestedArray.reduce((arr, item) => {
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
      return acc.push(...index[term]);
    }, []);
    const indexCount = {};
    // count the number of occurence of each index in indicesArray
    indicesArray.forEach((val) => {
      Object.prototype.hasOwnProperty.call(indexCount, index) ?
      indexCount[val] += 1 : indexCount[val] = 1;
    });
    const bookContainsAll = [];
    /* Knowing that each index can only occur once for a term
     if an index frequency is equal to the number of search terms
     then each search term has the index
     ===> the book at that index has all terms */
    Object.keys(indexCount).forEach((bookIndex) => {
      if (indexCount[bookIndex] === termsArray.length) {
        bookContainsAll.push(bookIndex);
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
      return { ...index };
    }
    return (!nameIsValid) ? [false, 'File name Invalid'] : contentIsValid;
  }

  /**
   * gets the index object created from 'filename'
   * @param {string} fileName -Name of file
   * @returns {Object} -A mapping of words to books in file
   */
  getIndex(fileName) {
    return (fileName) ? this.indexes[fileName] : this.indexes;
  }

  /**
   * search for occurence of words in Books
   * @param {Object} index -Index to be searched
   * @param {string} fileName -Name of file that corresponds to index
   * @param {array|string} terms -Tokens to search for in index
   * @returns {Object} -A map from token to array of Books
   *  that contains token
   */
  searchIndex(index, fileName, ...terms) {
    const searchedTerms = InvertedIndex.flattenArray(terms);
    const searchResult = searchedTerms.reduce((obj, term) => {
      const normalizedTerm = term.trim().toLowerCase().replace(/\W+/g, ' ');
      /\w+ \w+/g.test(normalizedTerm) ?
       obj[normalizedTerm] = InvertedIndex.multiTermSearch(normalizedTerm) :
       obj[normalizedTerm] = index[normalizedTerm];
      return obj;
    }, {});
    return [fileName, searchResult];
  }
}

export default InvertedIndex;
