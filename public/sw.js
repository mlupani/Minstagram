console.log("Hello world from the Service Worker 🤙");

self.addEventListener('push', e => {
  const data = e.data.json()
  self.registration.showNotification(data.title, {
    body: data.message,
    //icon: 'https://img.icons8.com/color/452/club-atletico-boca-juniors.png'
  })
})