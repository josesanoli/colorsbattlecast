(function (global) {

    
    cast.framework.CastReceiverContext.getInstance().setLoggerLevel(cast.framework.LoggerLevel.DEBUG);
    
    global.onload = function() {
        var context = cast.framework.CastReceiverContext.getInstance();
        
        console.log('starting the receiver application');
        var element = document.getElementById("subtitle");
        //element.innerHTML = "Subtitle changed";
        
        const CUSTOM_CHANNEL = 'urn:x-cast:es.jolusan.colorsbattlecast';
        context.addCustomMessageListener(CUSTOM_CHANNEL, customEvent => {
            console.log('addCustomMessageListener:');
            console.log(customEvent);
            element.innerHTML = customEvent.data;
            const objToSender = 
              {
                type: 'status',
                message: 'Playing'
              };

            context.sendCustomMessage(CUSTOM_CHANNEL, objToSender);
        });
        
        //context.start();
        
        const options = new cast.framework.CastReceiverOptions();
        options.customNamespaces = {
            [CUSTOM_CHANNEL]: cast.framework.system.MessageType.JSON
        };
        context.start(options);

        

        
        
        /*const CHANNEL = 'urn:x-cast:es.jolusan.colorsbattlecast';
        const options = new cast.framework.CastReceiverOptions();
          const objToSender = 
          {
            type: 'status',
            message: 'Playing'
          };

         options.customNamespaces = Object.assign({});
         options.customNamespaces[CHANNEL] = cast.framework.system.MessageType.JSON;

      //receiving sender message
      context.addCustomMessageListener(CHANNEL,  customEvent => element.innerHTML = customEvent.data.msg);

      //message to sender app
      context.sendCustomMessage(CHANNEL, objToSender);

      context.start(options);
        */
        /*
        window.castReceiverManager = cast.receiver.CastReceiverManager.getInstance();
        
        castReceiverManager.onReady = function(event) {
            console.log('receiver application is ready: ' + JSON.stringify(event.data));
            window.castReceiverManager.setApplicationState('Application status is ready...');
        };
        castReceiverManager.onSenderConnected = function(event) {
            console.log('sender application connected: ' + event.data);
            console.log(window.castReceiverManager.getSender(event.data).userAgent);
        };
        castReceiverManager.onSenderDisconnected = function(event) {
            console.log('sender application disconnected: ' + event.data);
            //if we dont have any connected devices then just close this app, this might not be necessary for your use case though
            if (window.castReceiverManager.getSenders().length == 0) {
                window.close();
            }
        };
        //register the namespace that we can handle messaging from. NOTE, THIS SHOULD be the same as the one the SENDER app uses to send messages
        window.messageBus = window.castReceiverManager.getCastMessageBus('urn:x-cast:es.jolusan.colorsbattlecast');
        //handler for the incoming CastMessageBus message events from sender applications
        window.messageBus.onMessage = function(event) {
            console.log('Message [' + event.senderId + ']: ' + event.data);
            var json = JSON.parse(event.data);
            processMessage(json);
        }
        // initialize the CastReceiverManager with an application status message
        window.castReceiverManager.start({statusText: 'Application is starting'});
        */
        console.log('Receiver Manager started');
    };
 // "use strict";
 // var
 //   doc = global.document,
 //   namespace = "urn:x-cast:com.es.jolusan.colorsbattlecast",
 //   dom = {
 //     "message": doc.getElementById("message")
 //   },
 //   castReceiverManager, messageBus,
 //   max_width = dom.message.offsetWidth,
 //   max_height = dom.message.offsetHeight,
 //   callback_count = 0,
 //   photos = [], currentPhoto = -1, timer, stopped = false, displayTime = 4000;
//
 // // Fetch data via jsonp
 // function fetchData(url, cb) {
 //   var script;
//
 //   callback_count++;
//
 //   global["jsonp_callback_" + callback_count] = function (data) {
 //     cb(data);
 //   };
//
 //   if (url.indexOf("?") >= 0) {
 //     url += "&";
 //   } else {
 //     url += "?";
 //   }
 //   url += "callback=jsonp_callback_" + callback_count;
//
 //   script = doc.createElement("script");
 //   script.src = url;
 //   doc.head.appendChild(script);
 // }
//
 // function slideShow() {
 //   var image, start;
 //   if (!!photos && photos.length > 0) {
 //     global.clearTimeout(timer);
 //     currentPhoto++;
 //     if (currentPhoto >= photos.length) {
 //       currentPhoto = 0;
 //     }
 //     image = new global.Image();
//
 //     image.onerror = function () {
 //       timer = global.setTimeout(slideShow, 1);
 //     };
 //     image.onabort = function () {
 //       timer = global.setTimeout(slideShow, 1);
 //     };
 //     image.onload = function () {
 //       if (stopped) { return; }
 //       var delay = start - (new Date()).getTime();
//
 //       /*
 //        * wait until display time of the previous photos is over
 //        * before actually showing the image after loading
 //        */
 //       timer = global.setTimeout(function () {
 //         if (stopped) { return; }
//
 //         var img, w, h;
 //         img = doc.createElement("img");
//
 //         // Sizing and centering the image
 //         w = max_width;
 //         h = max_width / image.width * image.height;
 //         if (h > max_height) {
 //           h = max_height;
 //           w = max_height / image.height * image.width;
 //         }
 //         img.style.width = w + "px";
 //         img.style.height = h + "px";
//
 //         img.src = image.src;
//
 //         dom.message.innerHTML = "";
 //         dom.message.appendChild(img);
//
 //         // immediately start loading the next image
 //         timer = global.setTimeout(slideShow, 1);
 //       }, Math.max(1, displayTime - delay));
 //     };
 //     start = (new Date()).getTime();
 //     image.src = photos[currentPhoto];
 //   } else {
 //     dom.message.innerHTML = "No photos found.";
 //   }
 // }
//
 // function loadAlbum(data) {
 //   var i, photo;
 //   photos = [];
 //   currentPhoto = -1;
 //   if (!!data && !!data.feed && !!data.feed.entry && data.feed.entry.length > 0) {
 //     for (i = 0; i < data.feed.entry.length; i++) {
 //       photo = data.feed.entry[i];
 //       photos.push(photo.media$group.media$thumbnail[0].url.replace("/s72/", "/s1280/"));
 //     }
 //   }
 //   stopped = false;
 //   castReceiverManager.setApplicationState("Displaying slideshow...");
 //   global.setTimeout(slideShow, 1);
 // }
//
 // function init() {
 //   castReceiverManager = global.cast.receiver.CastReceiverManager.getInstance();
//
 //   castReceiverManager.onReady = function() {
 //     castReceiverManager.setApplicationState("Application status is ready.");
 //   };
//
 //   castReceiverManager.onSenderDisconnected = function() {
 //     if (castReceiverManager.getSenders().length === 0) {
 //       global.close();
 //     }
 //   };
//
 //   messageBus = castReceiverManager.getCastMessageBus(namespace, global.cast.receiver.CastMessageBus.MessageType.JSON);
//
 //   messageBus.onMessage = function(event) {
//
 //     // Handle message
 //     if (!!event.data.url) {
 //       // Stop previous slideshow if still running
 //       stopped = true;
 //       global.clearTimeout(timer);
//
 //       dom.message.innerHTML = "Photocast fetching photos...";
 //       castReceiverManager.setApplicationState("Fetching photos...");
 //       fetchData(event.data.url, loadAlbum);
 //     } else {
 //       if (!!event.data.action) {
 //         if (event.data.action === "STOP_CAST") {
 //           stopped = true;
 //           global.clearTimeout(timer);
 //           dom.message.innerHTML = "Photocast waiting for input...";
 //           castReceiverManager.setApplicationState("Waiting for input...");
 //         }
 //       }
 //     }
//
 //     messageBus.send(event.senderId, event.data);
 //   };
//
 //   // initialize the CastReceiverManager with an application status message
 //   castReceiverManager.start({statusText: "Application is starting"});
 // }
//
 // global.onload = init;

}(this));
