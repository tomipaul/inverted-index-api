import InvertedIndex from '../src/inverted-index';
import someMalformedBooks from '../fixtures/someMalformedBooks.json';
import emptyFile from '../fixtures/emptyFile.json';
import emptyObject from '../fixtures/emptyObject.json';
import validFile from '../fixtures/validFile.json';
import anotherValidFile from '../fixtures/anotherValidFile.json';
import allMalformedBooks from '../fixtures/allMalformedBooks.json';
import oneMalformedBook from '../fixtures/oneMalformedBook.json';

describe('InvertedIndex class checks if file content is valid', () => {
  describe('InvertedIndex.checkBook(acc=[], book, bookIndex)', () => {
    it('returns [bookIndex] if book has invalid text and tile', () => {
      expect(InvertedIndex.checkBook([], someMalformedBooks[0], 0))
      .toEqual([0]);
    });

    it('returns [bookIndex] if book has more than two keys', () => {
      expect(InvertedIndex.checkBook([], someMalformedBooks[2], 2))
      .toEqual([2]);
    });

    it('returns [bookindex] if book is an empty object', () => {
      expect(InvertedIndex.checkBook([], someMalformedBooks[3], 3))
      .toEqual([3]);
    });

    it('returns [bookindex] if book does not have a text poperty', () => {
      expect(InvertedIndex.checkBook([], someMalformedBooks[4], 4))
      .toEqual([4]);
    });

    it('returns [bookindex] if book does not have a title poperty', () => {
      expect(InvertedIndex.checkBook([], someMalformedBooks[5], 5))
      .toEqual([5]);
    });

    it('returns [] if book is not malformed', () => {
      expect(InvertedIndex.checkBook([], someMalformedBooks[1], 1))
      .toEqual([]);
    });
  });

  describe('InvertedIndex.checkBooks(fileContent)', () => {
    it(`returns [false, 'malformed', [malformedBooksIndices]]
     if some/all books in file is malformed`, () => {
      expect(InvertedIndex.checkBooks(someMalformedBooks))
      .toEqual([false, 'malformed', [0, 2, 3, 4, 5]]);
      expect(InvertedIndex.checkBooks(allMalformedBooks))
      .toEqual([false, 'malformed', [0, 1, 2]]);
      expect(InvertedIndex.checkBooks(oneMalformedBook))
      .toEqual([false, 'malformed', [0]]);
    });

    it('returns [true] if all books in file is valid', () => {
      expect(InvertedIndex.checkBooks(validFile)).toEqual([true]);
      expect(InvertedIndex.checkBooks(anotherValidFile)).toEqual([true]);
    });
  });

  describe('InvertedIndex.validateFileContent(fileContent)', () => {
    it("returns [false, 'empty'] if fileContent is empty", () => {
      expect(InvertedIndex.validateFileContent(emptyFile))
      .toEqual([false, 'empty']);
    });

    it(`returns [false, 'invalid']
     if fileContent is not valid JSON array`, () => {
      expect(InvertedIndex.validateFileContent(emptyObject))
      .toEqual([false, 'invalid']);
      expect(InvertedIndex.validateFileContent(validFile)).toEqual([true]);
    });

    it(`calls InvertedIndex.checkBooks
     if fileContent is non-empty valid JSON array`, () => {
      spyOn(InvertedIndex, 'checkBooks');
      InvertedIndex.validateFileContent(validFile);
      InvertedIndex.validateFileContent(allMalformedBooks);
      expect(InvertedIndex.checkBooks).toHaveBeenCalled();
      expect(InvertedIndex.checkBooks).toHaveBeenCalledWith(validFile);
      expect(InvertedIndex.checkBooks).toHaveBeenCalledWith(allMalformedBooks);
    });

    it(`returns InvertedIndex.checkBooks(fileContent)
     if fileContent is non-empty valid JSON array`, () => {
      expect(InvertedIndex.validateFileContent(anotherValidFile)).toEqual([true]);
      expect(InvertedIndex.validateFileContent(someMalformedBooks))
      .toEqual([false, 'malformed', [0, 2, 3, 4, 5]]);
    });
  });
});

describe('Inverted index class creates index', () => {
  describe('InvertedIndex.analyse(book)', () => {
    it('returns an array of all words in book object', () => {
      let bookTokens = InvertedIndex.analyse(anotherValidFile[2]);
      expect(bookTokens).toEqual(
        ['times', 'of', 'sciences', 'science', 'can',
          'make', 'you', 'fly', 'with', 'an', 'edge']
      );
      expect(bookTokens.length).toEqual(11);

      bookTokens = InvertedIndex.analyse(anotherValidFile[1]);
      expect(bookTokens.length).toEqual(32);
      expect(InvertedIndex.analyse(anotherValidFile[1]))
      .toContain('people');

      bookTokens = InvertedIndex.analyse(anotherValidFile[3]);
      expect(bookTokens.length).toEqual(12);
      expect(bookTokens).toContain('2045');
    });
  });

  describe('invertedIndex.createIndex(fileName, fileContent)', () => {
    const invertedIndex = new InvertedIndex();
    it('asserts that fileName is valid', () => {
      expect(invertedIndex.createIndex('emptyObject.txt', emptyObject))
      .toEqual([false, 'File name Invalid']);
      expect(invertedIndex.createIndex('.json', emptyFile))
      .toEqual([false, 'File name Invalid']);
    });

    it('asserts that fileContent is valid', () => {
      expect(invertedIndex.createIndex('emptyObject.json', emptyObject))
      .toEqual([false, 'invalid']);
      expect(invertedIndex.createIndex('emptyFile.json', emptyFile))
      .toEqual([false, 'empty']);
      expect(invertedIndex.createIndex('oneMalformedBook.json',
       oneMalformedBook))
       .toEqual([false, 'malformed', [0]]);
    });

    it('creates and returns an index object', () => {
      const index = invertedIndex.createIndex('anotherValidFile.json',
       anotherValidFile);
      expect(index.edge).toBeDefined();
      expect(index.edge).toEqual([0, 1, 2]);
      expect(index.fly).toBeDefined();
      expect(index.fly).toEqual([1, 2]);
    });

    it('creates and returns an index object', () => {
      const index = invertedIndex.createIndex('validFile.json',
       validFile);
      expect(index.animals).toBeDefined();
      expect(index.animals).toEqual([0, 1]);
      expect(index.system).toBeDefined();
      expect(index.system).toEqual([1, 2]);
    });

    it('creates and returns an index object', () => {
      const index = invertedIndex.createIndex('validFile.json',
       validFile);
      Object.keys(index).forEach((item) => {
        expect(index[item].includes(3)).toBeFalsy();
      });
    });
  });
});
