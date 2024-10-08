const admin = require("firebase-admin");

admin.initializeApp({
  credential: admin.credential.applicationDefault(),
});

const db = admin.firestore();

async function viewData() {
  const snapshot = await db.collection("transactions").get();
  console.log(snapshot);
}

viewData().catch(console.error);
