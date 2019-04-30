(function (global) {
  
  // Messages
  const MSG_GET_GAME_CODE = "get_game_code";
  const MSG_INIT_SCREEN = "init_screen";
  const MSG_START_COUNTDOWN = "start_countdown";
  const MSG_START_GAME = "start_game";
  const MSG_EDIT_PLAYER = "player_";
  const MSG_SET_TIME = "set_time";
  const MSG_PLAYER_SCORE = "player_score";
  const MSG_CELL_COLOR = "cell_color";
  const MSG_FINISH_SCREEN = "finish_screen";

  // Cast
  const CUSTOM_CHANNEL = 'urn:x-cast:es.jolusan.colorsbattlecast';

  // Variables
  var gameCode = "0";

  // Colors
  const DEFAULT_CELL_COLOR = "#ddddff";
  const COUNTDOWN_CELL_COLOR = "#222222";
  const PLAYER_COLOR = "#eeeeee";
  const SCORE_COLOR = "#222222";
  const BEST_PLAYER_COLOR = "#a67c00";
  const BEST_SCORE_COLOR = "#876152";

  hideAllPlayers();

  cast.framework.CastReceiverContext.getInstance().setLoggerLevel(cast.framework.LoggerLevel.DEBUG);
    
    global.onload = function() {
      
        var context = cast.framework.CastReceiverContext.getInstance();
        
        console.log('starting the receiver application');
        
        context.addCustomMessageListener(CUSTOM_CHANNEL, customEvent => {
            console.log('addCustomMessageListener:' + customEvent);
            
            let action = String(customEvent.data.action);
            let key = String(customEvent.data.key);
            let value = String(customEvent.data.value);

            if (action == MSG_GET_GAME_CODE){
              const objToSender = 
                {
                  type: action,
                  message: gameCode
                };
              context.sendCustomMessage(CUSTOM_CHANNEL, undefined, objToSender);
          
            } else if (action == MSG_INIT_SCREEN){
              document.getElementById("subtitle").innerHTML = key;
              document.getElementById("subtitle2").innerHTML = value;
              gameCode = value;
            
            } else if (action == MSG_START_COUNTDOWN){
              document.getElementById("subtitle").innerHTML = key;
              document.getElementById("subtitle2").innerHTML = value;
              startCountDown();
            
            } else if (action.startsWith(MSG_EDIT_PLAYER)){
              if (key != ""){
                document.getElementById(action + "_slot").style.display = "flex";
                document.getElementById(action + "_name").innerHTML = key;
                document.getElementById(action + "_color").style.backgroundColor = value;
                document.getElementById(action + "_score").innerHTML = "0";
              } else {
                document.getElementById(action + "_slot").style.display = "none";
              }

            } else if (action == MSG_SET_TIME){
              document.getElementById("subtitle").innerHTML = key;
              document.getElementById("subtitle2").innerHTML = value;
          
            } else if (action == MSG_PLAYER_SCORE){
              document.getElementById(key + "_score").innerHTML = value;
              checkBestScore();

            } else if (action == MSG_CELL_COLOR){
              if (value != "alpha"){
                document.getElementById(key).style.backgroundColor = value;
              } else {
                document.getElementById(key).style.opacity = "0.6";
              }
            
            } else if (action == MSG_FINISH_SCREEN){
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
        let playerScore = "player_" + i + "_score";
        let playerName = "player_" + i + "_name";
        document.getElementById(playerName).style.color = PLAYER_COLOR;
        document.getElementById(playerName).innerHTML = "-";
        document.getElementById(playerScore).style.color = SCORE_COLOR;
        document.getElementById(playerScore).innerHTML = "0";
      }
    }

    function startCountDown(){
      var dissapearOrder = ["B3","C3","C2","B2","A2","A3","A4","B4","C4","D4","D3","D2","D1","C1","B1","A1"]; 
      var i = 0;
      for (i = 0; i < dissapearOrder.length; i++) { 
        var cellKey = "cell" + dissapearOrder[i]
        document.getElementById(cellKey).style.backgroundColor = COUNTDOWN_CELL_COLOR;
      }

      var counter = 0,
      timer = setInterval(function(){
            if (counter === dissapearOrder.length) {
              //When finished
              clearInterval(timer);
              const objToSender = 
              {
                type: MSG_START_COUNTDOWN,
                message: MSG_START_GAME
              };
              var context = cast.framework.CastReceiverContext.getInstance();
              context.sendCustomMessage(CUSTOM_CHANNEL, undefined, objToSender);
              
            } else {
              var cellKey = "cell" + dissapearOrder[counter]
              document.getElementById(cellKey).style.backgroundColor = DEFAULT_CELL_COLOR;
              counter++
            }
      },400);

    }

    function checkBestScore(){
      var arr = new Array(8);
      var i;
      var maxScore = 0;
      for (i = 0; i < 8; i++) { 
        let playerScore = "player_" + i + "_score";
        arr[i] = parseInt(document.getElementById(playerScore).innerText);
        if (arr[i] > maxScore){
          maxScore = arr[i];
        }
      } 
      for (i = 0; i < 8; i++) {
        let playerScore = "player_" + i + "_score";
        let playerName = "player_" + i + "_name";
        if (arr[i] == maxScore && arr[i]>0){
          document.getElementById(playerName).style.color = BEST_PLAYER_COLOR;
          document.getElementById(playerScore).style.color = BEST_SCORE_COLOR;
        } else {
          document.getElementById(playerName).style.color = PLAYER_COLOR;
          document.getElementById(playerScore).style.color = SCORE_COLOR;
        }
        
      }
    }

}(this));
