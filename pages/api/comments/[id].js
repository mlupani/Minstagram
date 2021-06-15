import { firestore, getMapPost } from 'firebase/admin'

export default (req, res) => {
  const { query } = req
  const { id } = query

  firestore
    .collection("comments")
    .where("idPost", "==", id)
    .orderBy("createdAt", "desc")
    .limit(20)
    .onSnapshot(({ docs }) => {
      const data = docs.map(getMapPost)
      res.json(data)
    })
}