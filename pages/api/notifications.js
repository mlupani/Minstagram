import webpush from '/services/webpush'
let pushSubscription

export default async (req, res) => {

    pushSubscription = req.body.subscription
    const payload = JSON.stringify(req.body.payload)
    res.status(200).json()

    try {
        await webpush.sendNotification(pushSubscription, payload)
    } catch (error) {
        console.log("error: "+error)
    }
}