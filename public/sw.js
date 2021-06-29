console.log("Hello world from the Service Worker 🤙");

self.addEventListener('push', e => {
  const data = e.data.json()

  e.waitUntil(
    self.registration.showNotification(data.title, {
        body: data.message,
        icon: data.icon,
        data: data.data,
        actions: data.actions,
        vibrate: [200, 100, 200, 100, 200, 100, 200],
      })
  )
})

self.addEventListener('notificationclick', event =>  {

  switch(event.notification.actions[0].action){
    case 'follow':
    case 'message':
      clients.openWindow(event.notification.data.url);
      event.notification.close();
    break;
    /*
    case 'any_other_action':
      clients.openWindow("https://www.example.com");
    break;
    */
  }
});