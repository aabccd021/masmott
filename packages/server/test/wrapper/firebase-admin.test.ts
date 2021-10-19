import { assert } from 'chai';
import { App } from 'firebase-admin/app';
import * as firestore from 'firebase-admin/firestore';
import sinon, { stubInterface } from 'ts-sinon';
import { deleteDoc, getDoc } from '../../src/wrapper/firebase-admin';

afterEach(() => {
  sinon.restore();
});

describe('getDoc', () => {
  it('gets the document', async () => {
    // arrange
    const snapshot: firestore.DocumentSnapshot = {
      ...stubInterface<firestore.DocumentSnapshot>(),
      id: 'hogeId',
      data: () => ({
        lorem: 'ipsum',
      }),
    };

    const doc = stubInterface<firestore.DocumentReference>();
    doc.get.resolves(snapshot);

    const firestoreInstance = stubInterface<firestore.Firestore>();
    firestoreInstance.doc.returns(doc);

    const app = stubInterface<App>();
    const getFirestore = sinon
      .stub(firestore, 'getFirestore')
      .returns(firestoreInstance);

    // act
    const wrappedSnapshot = await getDoc(app, 'fooCollection', 'barId');

    // assert
    assert.isTrue(getFirestore.calledOnceWith(app));
    assert.isTrue(firestoreInstance.doc.calledOnceWith('fooCollection/barId'));
    assert.isTrue(doc.get.calledOnceWith());

    const expectedSnapshot = {
      data: {
        lorem: 'ipsum',
      },
      id: 'hogeId',
    };
    assert.deepStrictEqual(wrappedSnapshot, expectedSnapshot);
  });
});

describe('deleteDoc', () => {
  it('deletes the document', async () => {
    // arrange
    const mockedDeleteResult = stubInterface<firestore.WriteResult>();

    const doc = stubInterface<firestore.DocumentReference>();
    doc.delete.resolves(mockedDeleteResult);

    const firestoreInstance = stubInterface<firestore.Firestore>();
    firestoreInstance.doc.returns(doc);

    const app = stubInterface<App>();
    const getFirestore = sinon
      .stub(firestore, 'getFirestore')
      .returns(firestoreInstance);

    // act
    const deleteResult = await deleteDoc(app, 'fooCollection', 'barId');

    // assert
    assert.isTrue(getFirestore.calledOnceWith(app));
    assert.isTrue(firestoreInstance.doc.calledOnceWith('fooCollection/barId'));
    assert.isTrue(doc.delete.calledOnceWith());
    assert.deepStrictEqual(deleteResult, mockedDeleteResult);
  });
});
