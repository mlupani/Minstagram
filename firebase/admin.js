var admin = require("firebase-admin");

var serviceAccount = process.env.ADMIN_KEYS

try {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount)
    });
} catch (error) {}

export const firestore = admin.firestore()

export const getMapPost = doc => {

    const data = doc.data()
    const id = doc.id
    const createAt = data.createdAt

    return {
        ...data,
        id,
        createdAt: +createAt.toDate()
    }
}