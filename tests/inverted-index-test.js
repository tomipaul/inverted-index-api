import InvertedIndex from '../src/inverted-index';
import someMalformedBooks from '../fixtures/someMalformedBooks.json';
import emptyFile from '../fixtures/emptyFile.json';
import emptyObject from '../fixtures/emptyObject.json';
import validFile from '../fixtures/validFile.json';
import anotherValidFile from '../fixtures/anotherValidFile.json';
import allMalformedBooks from '../fixtures/allMalformedBooks.json';
import oneMalformedBook from '../fixtures/oneMalformedBook.json';

describe('InvertedIndex class checks if file content is valid', () => {
  describe('InvertedIndex.checkBookObj(book)', () => {
    it('returns false if book has invalid text and tile', () => {
      expect(InvertedIndex.checkBookObj(someMalformedBooks[0]))
      .toBe(false);
    });

    it('returns false if book has more than two keys', () => {
      expect(InvertedIndex.checkBookObj(someMalformedBooks[2]))
      .toBe(false);
    });

    it('returns false if book is an empty object', () => {
      expect(InvertedIndex.checkBookObj(someMalformedBooks[3]))
      .toBe(false);
    });

    it('returns false if book does not have a text poperty', () => {
      expect(InvertedIndex.checkBookObj(someMalformedBooks[4]))
      .toBe(false);
    });

    it('returns false if book does not have a title poperty', () => {
      expect(InvertedIndex.checkBookObj(someMalformedBooks[5]))
      .toBe(false);
    });

    it('returns true if book is not malformed', () => {
      expect(InvertedIndex.checkBookObj(someMalformedBooks[1]))
      .toBe(true);
    });
  });

  describe('InvertedIndex.validateBookObjs(fileContent)', () => {
    it(`returns [false, 'malformed'] if some/all
     books in file is malformed`, () => {
      expect(InvertedIndex.validateBookObjs(someMalformedBooks))
      .toEqual([false, 'Malformed!']);
      expect(InvertedIndex.validateBookObjs(allMalformedBooks))
      .toEqual([false, 'Malformed!']);
      expect(InvertedIndex.validateBookObjs(oneMalformedBook))
      .toEqual([false, 'Malformed!']);
    });

    it('returns [true] if all books in file is valid', () => {
      expect(InvertedIndex.validateBookObjs(validFile)).toEqual([true]);
      expect(InvertedIndex.validateBookObjs(anotherValidFile)).toEqual([true]);
    });
  });

  describe('InvertedIndex.validateFileContent(fileContent)', () => {
    it("returns [false, 'empty'] if fileContent is empty", () => {
      expect(InvertedIndex.validateFileContent(emptyFile))
      .toEqual([false, 'Empty!']);
    });

    it(`returns [false, 'invalid']
     if fileContent is not valid JSON array`, () => {
      expect(InvertedIndex.validateFileContent(emptyObject))
      .toEqual([false, 'Invalid!']);
    });

    it(`calls InvertedIndex.validateBookObjs
     if fileContent is non-empty valid JSON array`, () => {
      spyOn(InvertedIndex, 'validateBookObjs');
      InvertedIndex.validateFileContent(validFile);
      InvertedIndex.validateFileContent(allMalformedBooks);
      expect(InvertedIndex.validateBookObjs)
      .toHaveBeenCalled();
      expect(InvertedIndex.validateBookObjs)
      .toHaveBeenCalledWith(validFile);
      expect(InvertedIndex.validateBookObjs)
      .toHaveBeenCalledWith(allMalformedBooks);
    });

    it(`returns InvertedIndex.validateBookObjs(fileContent)
     if fileContent is non-empty valid JSON array`, () => {
      expect(InvertedIndex.validateFileContent(validFile)).toEqual([true]);
      expect(InvertedIndex.validateFileContent(anotherValidFile)).toEqual([true]);
      expect(InvertedIndex.validateFileContent(someMalformedBooks))
      .toEqual([false, 'Malformed!']);
    });
  });
});

describe('Inverted index class creates an index', () => {
  describe('InvertedIndex.analyse(book)', () => {
    it('returns an array of all words in book object', () => {
      let bookTokens = InvertedIndex.analyse(anotherValidFile[2]);
      expect(bookTokens).toEqual(
        ['science',
          'can',
          'make',
          'you',
          'fly',
          'with',
          'an',
          'edge']
      );
      expect(bookTokens.length).toEqual(8);

      bookTokens = InvertedIndex.analyse(anotherValidFile[1]);
      expect(bookTokens.length).toEqual(28);
      expect(InvertedIndex.analyse(anotherValidFile[1]))
      .toContain('people');

      bookTokens = InvertedIndex.analyse(anotherValidFile[3]);
      expect(bookTokens.length).toEqual(9);
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
      .toEqual([false, 'Invalid!']);
      expect(invertedIndex.createIndex('emptyFile.json', emptyFile))
      .toEqual([false, 'Empty!']);
      expect(invertedIndex.createIndex('oneMalformedBook.json',
       oneMalformedBook))
       .toEqual([false, 'Malformed!']);
    });

    it('creates and returns an index object', () => {
      const fileIndex = invertedIndex.createIndex('anotherValidFile.json',
       anotherValidFile)['anotherValidFile.json'];
      expect(fileIndex.edge).toBeDefined();
      expect(fileIndex.edge).toEqual([0, 1, 2]);
      expect(fileIndex.fly).toBeDefined();
      expect(fileIndex.fly).toEqual([1, 2]);
    });

    it('creates and returns an index object', () => {
      const fileIndex = invertedIndex.createIndex('validFile.json',
       validFile)['validFile.json'];
      expect(fileIndex.animals).toBeDefined();
      expect(fileIndex.animals).toEqual([0, 1]);
      expect(fileIndex.system).toBeDefined();
      expect(fileIndex.system).toEqual([1, 2]);
      expect(fileIndex.the).toBeDefined();
      expect(fileIndex.the.length).toEqual(validFile.length);
    });
  });
});

describe('Inverted Index class searches an index for term(s)', () => {
  describe('InvertedIndex.flattenArray(nestedArray)', () => {
    it(`takes a multidimensional array of search terms 
    and returns a one dimensional array`, () => {
      expect(InvertedIndex
      .flattenArray([
        [1, 2, 3],
        [
          [[[
            [4, 5], 'a', 'b'
          ]]],
          ['x'],
          'y'
        ]
      ]))
      .toEqual([1, 2, 3, 4, 5, 'a', 'b', 'x', 'y']);
    });

    it(`takes a multidimensional array of search terms
     and returns a one dimensional array`, () => {
      expect(InvertedIndex
      .flattenArray([
        'man',
        [
          ['the'],
          ['there', 'for']
        ]
      ]))
      .toEqual(['man', 'the', 'there', 'for']);
    });
  });

  describe('invertedIndex.searchIndex(index, fileName, ...terms)', () => {
    const invertedIndex = new InvertedIndex();
    invertedIndex.createIndex('validFile.json', validFile);
    const index = invertedIndex.createIndex('anotherValidFile.json',
      anotherValidFile);
    it('looks up terms in the index of a file `fileName`', () => {
      const searchResult = invertedIndex.searchIndex(index, 'validFile.json',
       'the', ['system'], ['animals'])['validFile.json'];
      expect(searchResult).toBeTruthy();
      expect(searchResult.animals).toEqual([0, 1]);
      expect(searchResult.the).toEqual([0, 1, 2]);
      expect(searchResult.system).toEqual([1, 2]);
    });

    it('looks up terms in the index of all files if fileName is undefined',
    () => {
      const searchResult = invertedIndex.searchIndex(index, undefined,
      ['and', ['fly']], ['the']);
      const validFileResult = searchResult['validFile.json'];
      const anotherValidFileResult = searchResult['anotherValidFile.json'];
      expect(Object.keys(searchResult).length).toEqual(2);
      expect(validFileResult.and).toEqual([1]);
      expect(anotherValidFileResult.and).toEqual([1]);
      expect(validFileResult.fly).toEqual([]);
      expect(anotherValidFileResult.fly).toEqual([1, 2]);
      expect(validFileResult.the).toEqual([0, 1, 2]);
      expect(anotherValidFileResult.the).toEqual([1]);
    });

    it('looks up simultaneous terms in index of file(s)', () => {
      const searchResult = invertedIndex.searchIndex(index, undefined,
       ['of to'], ['the animals']);
      const validFileResult = searchResult['validFile.json'];
      const anotherValidFileResult = searchResult['anotherValidFile.json'];
      expect(validFileResult['of to']).toEqual([0]);
      expect(anotherValidFileResult['of to']).toEqual([]);
      expect(validFileResult['the animals']).toEqual([0, 1]);
      expect(anotherValidFileResult['the animals']).toEqual([]);
    });

    it('returns empty array for term if term is not in the index', () => {
      const searchResult = invertedIndex.searchIndex(index,
      'anotherValidFile.json', 'beauty', ['in', 'our'],
       'eyes')['anotherValidFile.json'];
      expect(searchResult.beauty).toEqual([]);
      expect(searchResult.in).toEqual([]);
      expect(searchResult.our).toEqual([]);
      expect(searchResult.eyes).toEqual([]);
    });

    it('returns a message if no term is given', () => {
      const searchResult = invertedIndex.searchIndex(index,
      'anotherValidFile.json');
      expect(searchResult).toEqual('Terms cannot be empty');
    });

    it('returns a message if index is not an object', () => {
      const searchResult = invertedIndex.searchIndex([],
      'anotherValidFile.json');
      expect(searchResult).toEqual('Invalid index Object');
    });

    it('returns a message if index is an empty object', () => {
      const searchResult = invertedIndex.searchIndex({},
      'anotherValidFile.json');
      expect(searchResult).toEqual('Invalid index Object');
    });
  });
});
