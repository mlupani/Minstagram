import { firestore, getMapPost } from 'firebase/admin'

export default (req, res) => {
  const { query } = req
  const { id } = query

  firestore
    .collection('posts')
    .doc(id)
    .get()
    .then(doc => {
        const data = getMapPost(doc)
        res.json(data)
    }).catch(err => {
        res.status(404).end()
    })
}
