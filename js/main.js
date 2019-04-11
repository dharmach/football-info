var webPush = require('web-push');

var pushSubscription = {
    "endpoint": "https://android.googleapis.com/gcm/send/e-82Hfz3kZw:APA91bGWX5HnKbVMjaJE6GCEHWRrebkksfdezA0FkCcsRAvN3doCjPfaUfOHrtWwLKHRWRRrXQQ06AbG8jgroxTXX4qf6CkYEr-NeWfI18EReJZY3RjN_IqK_8gaiEn093xJKsP4re-n",
    "keys": {
        "p256dh": "BDwJbr1W+3scepFgOA4QIWTJ1yGn6/oudXihdrdkA4ckgKmYaK00Wbi4DWoB2BhNApUtGaBzKrqE4qYuePOAsEI=", 
        "auth": "KqcSRxx91+oCQewDNGj8mw=="
    }
};

var payload = 'Here is a payload!';

var options = {
    gcmAPIKey: 'AIzaSyBbopD5CM8oVDLqmxbd0zT6STi7fSixNCo',
    TTL: 60
};

webPush.sendNotification(
    pushSubscription,
    payload,
    options
);