(function (global) {
    
    hideAllPlayers();
    cast.framework.CastReceiverContext.getInstance().setLoggerLevel(cast.framework.LoggerLevel.DEBUG);
    
    global.onload = function() {

        var context = cast.framework.CastReceiverContext.getInstance();
        
        console.log('starting the receiver application');
        
        const CUSTOM_CHANNEL = 'urn:x-cast:es.jolusan.colorsbattlecast';
        context.addCustomMessageListener(CUSTOM_CHANNEL, customEvent => {
            console.log('addCustomMessageListener:' + customEvent);
            
            let action = String(customEvent.data.action);
            let key = String(customEvent.data.key);
            let value = String(customEvent.data.value);

            if (action == "init_screen"){
              document.getElementById("subtitle2").innerHTML = "Game code: " + value;
            
            } else if (action.startsWith("player_")){
              if (key != ""){
                document.getElementById(action + "_slot").style.display = "flex";
                document.getElementById(action + "_name").innerHTML = key;
                document.getElementById(action + "_color").style.backgroundColor = value;
                document.getElementById(action + "_score").innerHTML = "0";
              } else {
                document.getElementById(action + "_slot").style.display = "none";
              }

            } else if (action == "set_time"){
              document.getElementById("subtitle").innerHTML = "Time to play";
              document.getElementById("subtitle2").innerHTML = value;
          
            } else if (action == "update_player_score"){
              document.getElementById(key + "_score").innerHTML = value;
          
            } else if (action == "change_cell_color"){
              document.getElementById(key).style.backgroundColor = value;
            
            } else if (action == "finish_screen"){
              document.getElementById("subtitle").innerHTML = key;
              document.getElementById("subtitle2").innerHTML = value;
            }
         
            //Send message received to device
            const objToSender = 
                {
                  type: 'Action: ' + action,
                  message: 'Key: ' + key + '. Value: ' + value
                };
            context.sendCustomMessage(CUSTOM_CHANNEL, undefined, objToSender);

        });
        
        const options = new cast.framework.CastReceiverOptions();
        options.customNamespaces = Object.assign({});
        options.customNamespaces[CUSTOM_CHANNEL] = cast.framework.system.MessageType.JSON;
        
        context.start(options);

    };

    function hideAllPlayers(){
      var i;
      for (i = 0; i < 8; i++) { 
        let slotId = "player_" + i + "_slot";
        document.getElementById(slotId).style.display = "none";
      }
    }

}(this));
