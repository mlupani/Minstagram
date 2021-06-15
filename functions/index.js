// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });

/*
const functions = require("firebase-functions");

// The Firebase Admin SDK to access Firestore.
const admin = require("firebase-admin");
admin.initializeApp();

const updateAvatarInPosts = (user, newAvatar) => {
  const db = admin.firestore();
  return db
      .collection("posts")
      .where("userID", "==", user)
      .get()
      .then(({docs}) => {
        return docs.map((doc) => {
          return db.collection("posts").doc(doc.id).update({
            avatar: newAvatar,
          });
        });
      });
};

const updateAvatarInComments = (user, newAvatar) => {
  const db = admin.firestore();
  return db
      .collection("comments")
      .where("userID", "==", user)
      .get()
      .then(({docs}) => {
        return docs.map((doc) => {
          return db.collection("comments").doc(doc.id).update({
            avatar: newAvatar,
          });
        });
      });
};

const updateAvatarInCommentsofComments = (user, newAvatar) => {
  const db = admin.firestore();
  return db
      .collection("commentsOfComments")
      .where("userID", "==", user)
      .get()
      .then(({docs}) => {
        return docs.map((doc) => {
          return db.collection("commentsOfComments").doc(doc.id).update({
            avatar: newAvatar,
          });
        });
      });
};

const updateAvatarInFollowRequests = (user, newAvatar) => {
  const db = admin.firestore();
  return db
      .collection("followRequests")
      .where("fromUserID", "==", user)
      .get()
      .then(({docs}) => {
        return docs.map((doc) => {
          return db.collection("followRequests").doc(doc.id).update({
            fromAvatar: newAvatar,
          });
        });
      });
};

exports.onUpdatedAvatar = functions.firestore
    .document("users/{userId}")
    .onUpdate((change, context) => {
      const after = change.after.data();
      const before = change.before.data();

      if (after.avatar != before.avatar) {
        updateAvatarInPosts(context.params.userId, after.avatar);
        updateAvatarInComments(context.params.userId, after.avatar);
        updateAvatarInCommentsofComments(context.params.userId, after.avatar);
        updateAvatarInFollowRequests(context.params.userId, after.avatar);
      }
    });
*/
