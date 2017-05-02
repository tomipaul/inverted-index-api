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
          // for each token in analysed book text,Va check and update `indexes`
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
}
export default InvertedIndex;
