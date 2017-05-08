import request from 'supertest';
import app from '../src/app';
import someMalformedBooks from '../fixtures/someMalformedBooks.json';
import emptyFile from '../fixtures/emptyFile.json';
import emptyObject from '../fixtures/emptyObject.json';
import validFile from '../fixtures/validFile.json';
import anotherValidFile from '../fixtures/anotherValidFile.json';

let indexes;

describe('/api/create', () => {
  it('takes fileName and fileContent and returns an index object',
  (done) => {
    request(app)
     .post('/api/create')
     .send({ fileName: 'validFile.json' })
     .send({ fileContent: validFile })
     .expect(200)
     .expect('Content-Type', /json/)
     .expect((res) => {
       const index = res.body['validFile.json'];
       expect(index).toBeDefined();
       expect(Object.keys(index).length).toEqual(28);
       expect(index.the).toEqual([0, 1, 2]);
     })
     .end((err, res) => {
       if (err) { return done(err); }
       indexes = res.body;
       return done();
     });
  });

  it('returns error if fileName is not valid', (done) => {
    request(app)
    .post('/api/create')
    .send({ fileName: 'badFileName.txt' })
    .send({ fileContent: validFile })
    .expect(400)
    .expect((res) => {
      expect(res.body).toEqual('File name Invalid');
    })
    .end((err) => {
      if (err) { return done(err); }
      return done();
    });
  });

  it('returns error if fileContent is an empty array', (done) => {
    request(app)
    .post('/api/create')
    .send({ fileName: 'emptyFile.json' })
    .send({ fileContent: emptyFile })
    .expect(400)
    .expect((res) => {
      expect(res.body).toEqual('Empty!');
    })
    .end((err) => {
      if (err) { return done(err); }
      return done();
    });
  });

  it('returns error if fileContent is an not an array', (done) => {
    request(app)
    .post('/api/create')
    .send({ fileName: 'emptyObject.json' })
    .send({ fileContent: emptyObject })
    .expect(400)
    .expect((res) => {
      expect(res.body).toEqual('Invalid!');
    })
    .end((err) => {
      if (err) { return done(err); }
      return done();
    });
  });

  it('returns error if fileContent has malformed objects', (done) => {
    request(app)
    .post('/api/create')
    .send({ fileName: 'someMalformedBooks.json' })
    .send({ fileContent: someMalformedBooks })
    .expect(400)
    .expect((res) => {
      expect(res.body).toEqual('Malformed!');
    })
    .end((err) => {
      if (err) { return done(err); }
      return done();
    });
  });

  it('creates and returns index for multiple files',
  (done) => {
    request(app)
     .post('/api/create')
     .send({ fileName: 'anotherValidFile.json' })
     .send({ fileContent: anotherValidFile })
     .expect(200)
     .expect('Content-Type', /json/)
     .expect((res) => {
       expect(Object.keys(res.body).length).toEqual(2);
       expect(res.body['validFile.json']).toBeDefined();
       expect(res.body['anotherValidFile.json']).toBeDefined();
       const index = res.body['anotherValidFile.json'];
       expect(Object.keys(index).length).toEqual(41);
       expect(index.edge).toEqual([0, 1, 2]);
     })
     .end((err, res) => {
       if (err) { return done(err); }
       indexes = res.body;
       return done();
     });
  });
});

describe('/api/search', () => {
  it(`takes index, filename and search terms and returns
   result for terms in index of file 'fileName'`, (done) => {
    request(app)
    .post('/api/search')
    .send({ index: indexes })
    .send({ fileName: 'validFile.json' })
    .send({ terms: 'system, animals, the' })
    .expect(200)
    .expect('Content-Type', /json/)
    .expect((res) => {
      const searchIndex = res.body['validFile.json'];
      expect(Object.keys(searchIndex).length).toEqual(3);
      expect(searchIndex.animals).toEqual([0, 1]);
      expect(searchIndex.system).toEqual([1, 2]);
      expect(searchIndex.the).toEqual([0, 1, 2]);
    })
    .end((err) => {
      if (err) { return done(err); }
      return done();
    });
  });

  it(`returns result for search terms in indexes of all files
   if 'fileName' is undefined`, (done) => {
    request(app)
    .post('/api/search')
    .send({ index: indexes })
    .send({ terms: 'to, the' })
    .expect(200)
    .expect('Content-Type', /json/)
    .expect((res) => {
      expect(Object.keys(res.body).length).toEqual(2);
      let searchIndex = res.body['validFile.json'];
      expect(searchIndex.to).toEqual([0]);
      expect(searchIndex.the).toEqual([0, 1, 2]);
      searchIndex = res.body['anotherValidFile.json'];
      expect(searchIndex.to).toEqual([1]);
      expect(searchIndex.the).toEqual([1]);
    })
    .end((err) => {
      if (err) { return done(err); }
      return done();
    });
  });

  it('returns error if search terms is empty', (done) => {
    request(app)
    .post('/api/search')
    .send({ index: indexes })
    .send({ fileName: 'validFile.json' })
    .expect(400)
    .expect((res) => {
      expect(res.body).toEqual('Terms cannot be empty');
    })
    .end((err) => {
      if (err) { return done(err); }
      return done();
    });
  });

  it('returns error if index is not an object', (done) => {
    request(app)
    .post('/api/search')
    .send({ index: [] })
    .send({ fileName: 'validFile.json' })
    .expect(400)
    .expect((res) => {
      expect(res.body).toEqual('Invalid index Object');
    })
    .end((err) => {
      if (err) { return done(err); }
      return done();
    });
  });

  it('returns error if index is an empty object', (done) => {
    request(app)
    .post('/api/search')
    .send({ index: {} })
    .send({ fileName: 'validFile.json' })
    .expect(400)
    .expect((res) => {
      expect(res.body).toEqual('Invalid index Object');
    })
    .end((err) => {
      if (err) { return done(err); }
      return done();
    });
  });
});
