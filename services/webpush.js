const webpush = require('web-push');

webpush.setVapidDetails(
    'mailto:mlupani2@gmail.com',
    process.env.NEXT_PUBLIC_VAPID_KEY,
    process.env.PRIVATE_VAPID_KEYS
)

export default webpush