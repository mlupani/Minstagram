console.log("Hello world from the Service Worker 🤙");

self.addEventListener('push', e => {
  const data = e.data.json()
  self.registration.showNotification(data.title, {
    body: data.message,
    icon: data.icon,
    data: data.data,
    actions: data.actions,
    vibrate: 4
  })
})

self.addEventListener('notificationclick', event =>  {

  switch(event.notification.actions[0].action){
    case 'follow':
      clients.openWindow(event.notification.data.url);
    break;
    /*
    case 'any_other_action':
      clients.openWindow("https://www.example.com");
    break;
    */
  }
});