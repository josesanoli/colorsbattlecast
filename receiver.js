(function (global) {
    
    hideAllPlayers();
    cast.framework.CastReceiverContext.getInstance().setLoggerLevel(cast.framework.LoggerLevel.DEBUG);
    
    global.onload = function() {

        //hideAllPlayers();

        var context = cast.framework.CastReceiverContext.getInstance();
        
        console.log('starting the receiver application');
        
        const CUSTOM_CHANNEL = 'urn:x-cast:es.jolusan.colorsbattlecast';
        context.addCustomMessageListener(CUSTOM_CHANNEL, customEvent => {
            console.log('addCustomMessageListener:' + customEvent);
            
            let action = String(customEvent.data.action);
            let key = customEvent.data.key;
            let value = customEvent.data.value;

            if (action == "init_screen"){
              document.getElementById("subtitle2").innerHTML = "Game code: " + value;
            
            } else if (action.startsWith("player_")){
              document.getElementById(action + "_slot").style.display = "block";
              document.getElementById(action + "_name").innerHTML = key;
              document.getElementById(action + "_color").style.backgroundColor = value;
            } else if (action == "set_time"){
              document.getElementById("subtitle").innerHTML = "Time to play";
              document.getElementById("subtitle2").innerHTML = value;
          
            } else if (action == "update_player_score"){
              document.getElementById(key + "_score").innerHTML = value;
          
            } else if (action == "change_cell_color"){
              document.getElementById(key).style.backgroundColor = value;
            
            } else if (action == "finish_screen"){
              document.getElementById("subtitle").innerHTML = "Game over!: ";
              document.getElementById("subtitle2").innerHTML = "Winner: " + value;
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
        //document.getElementById(slotId).style.display = "block";//to show

      }
    }

}(this));
