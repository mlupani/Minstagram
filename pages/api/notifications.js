import webpush from '/services/webpush'
let pushSubscription

export default async (req, res) => {

    pushSubscription = req.body.subscription
    const payload = JSON.stringify(req.body.payload)

    try {
        await webpush.sendNotification(pushSubscription, payload)
        res.status(200).json()
    } catch (error) {
        console.log("error: "+error)
    }
}