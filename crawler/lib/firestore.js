const { initializeApp, applicationDefault, cert } = require('firebase-admin/app');
const { getFirestore, Timestamp, FieldValue } = require('firebase-admin/firestore');

initializeApp({
  credential: cert({
    projectId: process.env["FIRESTOREID"],
    clientEmail: process.env["FIRESTORE_EMAIL"],
    // @ts-ignore
    privateKey: process.env["FIRESTORE_KEY"].replace(/\\n/g, '\n'),
  })
});

exports.db = getFirestore();