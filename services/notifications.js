let subscription

function urlBase64ToUint8Array(base64String) {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
    .replace(/-/g, '+')
    .replace(/_/g, '/');

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
}

export const subscribeNotifications = async (callback) => {

    const PUBLIC_VAPID_KEY = 'BJvVreswBv89i4HbjRtetboHnxf5satBDgWrNBxdEmFv0KuKeODvCRj2wZMda2O5Jhr1YfCp9pf5M-Cjfv367U8'

    let register = JSON.parse(localStorage.getItem("regSW"));

    console.log('register: ', register)
    if(register){
        subscription  = await register?.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: urlBase64ToUint8Array(PUBLIC_VAPID_KEY)
        })
    
        callback(subscription)
    }


}

export const sendNotification = async (payload, subscription) => {

    const body = {subscription , payload}

    try {

        await fetch('/api/notifications', {
            method: "POST",
            payload: JSON.stringify(payload),
            body: JSON.stringify(body),
            headers: {
                "Content-Type": "application/json"
            }
        })

    } catch (error) {
        console.log(error)
    }


}