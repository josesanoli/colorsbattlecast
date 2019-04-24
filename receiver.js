(function (global) {
    
    cast.framework.CastReceiverContext.getInstance().setLoggerLevel(cast.framework.LoggerLevel.DEBUG);
    
    global.onload = function() {
        var context = cast.framework.CastReceiverContext.getInstance();
        
        console.log('starting the receiver application');
        var element = document.getElementById("subtitle");
        
        const CUSTOM_CHANNEL = 'urn:x-cast:es.jolusan.colorsbattlecast';
        context.addCustomMessageListener(CUSTOM_CHANNEL, customEvent => {
            console.log('addCustomMessageListener:');
            console.log(customEvent);
            element.innerHTML = customEvent.data;
           const objToSender = 
              {
                type: 'status',
                message: 'Received: ' + customEvent.data
              };

            context.sendCustomMessage(CUSTOM_CHANNEL, undefined, objToSender);
        });
        
        const options = new cast.framework.CastReceiverOptions();
        options.customNamespaces = Object.assign({});
        options.customNamespaces[CUSTOM_CHANNEL] = cast.framework.system.MessageType.JSON;
        
        context.start(options);

    };

}(this));
