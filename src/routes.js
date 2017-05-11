import InvertedIndex from './inverted-index';

/**
 * Define routes and route handlers
 * @function apiEndPoints
 * @param {Object} app -an express application instance
 * @returns {Object} -index object which maps from words to book object indexes
 */
const apiEndPoints = function apiEndpoints(app) {
  const invertedIndex = new InvertedIndex();
  app.post('/api/v0/create', (req, res) => {
    const { fileName, fileContent } = req.body;
    const index = invertedIndex.createIndex(fileName, fileContent);
    if (Array.isArray(index)) {
      return res.status(400).json(index[1]);
    }
    return res.status(200).json(index);
  });

  app.post('/api/v0/search', (req, res) => {
    const { index, fileName, terms } = req.body;
    const termsArray = (terms) ? terms.split(', ') : [];
    const searchResult = invertedIndex.searchIndex(index,
     fileName, ...termsArray);
    if (typeof searchResult === 'string') {
      return res.status(400).json(searchResult);
    }
    return res.status(200).json(searchResult);
  });
};

export default apiEndPoints;
