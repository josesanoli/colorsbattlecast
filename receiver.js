(function (global) {

  // Messages
  const MSG_GET_GAME_CODE = "get_game_code";
  const MSG_INIT_SCREEN = "init_screen";
  const MSG_START_COUNTDOWN = "start_countdown";
  const MSG_START_GAME = "start_game";
  const MSG_EDIT_PLAYER = "player_";//No other must starts with "player_"
  const MSG_SET_TIME = "set_time";
  const MSG_UPDATE_SCORE = "update_score";
  const MSG_CELL_COLOR = "cell_color";
  const MSG_ALPHA = "alpha";
  const MSG_FINISH_SCREEN = "finish_screen";
  const MSG_RESTART_GAME = "restart_game";
  const MSG_MIN_CAST_VERSION = "min_cast_version";

  // Cast
  const CUSTOM_CHANNEL = 'urn:x-cast:es.jolusan.colorsbattlecast';
  const MIN_CAST_VERSION = "1";

  // Colors
  const DEFAULT_CELL_COLOR = "#ddddff";
  const COUNTDOWN_CELL_COLOR = "#222222";
  const PLAYER_COLOR = "#eeeeee";
  const SCORE_COLOR = "#222222";
  const BEST_PLAYER_COLOR = "#a67c00";
  const BEST_SCORE_COLOR = "#876152";
  const LAST_SECONDS_COLOR = "#ff0000";
  const H2_TEXT_COLOR = "#cccccc";

  // Players Colors
  const cPlayer_0 = "#963E74";
  const cPlayer_1 = "#D0596E";
  const cPlayer_2 = "#F68661";
  const cPlayer_3 = "#FFBD5B";
  const cPlayer_4 = "#F9F871";
  const cPlayer_5 = "#A1EE8A";
  const cPlayer_6 = "#579D91";
  const cPlayer_7 = "#0093C7";
  const cPlayer_8 = "#355195";
  const cPlayer_9 = "#745290";

  // Variables
  var gameCode = "0000";
  var countDownStart = false;
  var lastTenPlayed = false;
  var gameOverShown = false;

  testColorsOnScreen();
  hideAllPlayers();

  //cast.framework.CastReceiverContext.getInstance().setLoggerLevel(cast.framework.LoggerLevel.DEBUG);
  const context = cast.framework.CastReceiverContext.getInstance();
  const playerManager = context.getPlayerManager();

  global.onload = function () {

    console.log('starting the receiver application');

    context.addCustomMessageListener(CUSTOM_CHANNEL, customEvent => {
      console.log('addCustomMessageListener:' + customEvent);

      let action = String(customEvent.data.action);
      let key = String(customEvent.data.key);
      let value = String(customEvent.data.value);

      if (action == MSG_GET_GAME_CODE) {
        document.getElementById("players").innerHTML = key;
        const objToSender =
        {
          type: action,
          message: gameCode.substr(gameCode.length - 4)
        };
        context.sendCustomMessage(CUSTOM_CHANNEL, undefined, objToSender);

      } else if (action == MSG_MIN_CAST_VERSION) {
        document.getElementById("players").innerHTML = key;
        const objToSender =
        {
          type: action,
          message: MIN_CAST_VERSION
        };
        context.sendCustomMessage(CUSTOM_CHANNEL, undefined, objToSender);

      } else if (action == MSG_INIT_SCREEN) {
        document.getElementById("subtitle").innerHTML = key;
        document.getElementById("subtitle2").innerHTML = value;
        gameCode = value;

      } else if (action == MSG_START_COUNTDOWN) {
        document.getElementById("subtitle").innerHTML = key;
        document.getElementById("subtitle2").innerHTML = value;
        playSound("ready_0");
        countDownStart = true;
        startCountDown();

      } else if (action.startsWith(MSG_EDIT_PLAYER)) {
        if (key != "") {
          document.getElementById(action + "_slot").style.display = "flex";
          document.getElementById(action + "_name").innerHTML = key;
          document.getElementById(action + "_color").style.backgroundColor = value;
          document.getElementById(action + "_score").innerHTML = "0";
          document.getElementById(action + "_name").style.color = PLAYER_COLOR;
          document.getElementById(action + "_score").style.color = SCORE_COLOR;
          if (!countDownStart) {
            playSound(getSoundIdByColor(value))
          }
        } else {
          document.getElementById(action + "_slot").style.display = "none";
        }

      } else if (action == MSG_SET_TIME) {
        document.getElementById("subtitle").innerHTML = key;
        document.getElementById("subtitle2").innerHTML = value;
        if (value == "10") {
          document.getElementById("subtitle2").style.color = LAST_SECONDS_COLOR;
          if (!lastTenPlayed) {
            playSound("last_ten_0");
            lastTenPlayed = true;
          }
        }

      } else if (action == MSG_UPDATE_SCORE) {
        document.getElementById(key + "_score").innerHTML = value;
        checkBestScore();

      } else if (action == MSG_CELL_COLOR) {
        if (value != MSG_ALPHA) {
          document.getElementById(key).style.backgroundColor = value;
          playSound(getSoundIdByColor(value));

        } else {
          document.getElementById(key).style.opacity = "0.6";
        }

      } else if (action == MSG_FINISH_SCREEN) {
        document.getElementById("subtitle").innerHTML = key;
        document.getElementById("subtitle2").innerHTML = value;
        document.getElementById("subtitle2").style.color = H2_TEXT_COLOR;
        if (gameOverShown) {
          var winnerSound = "winner_0";
          var randomValue = Math.random();
          if (randomValue < 0.3) {
            winnerSound =  "winner_1";
          } else  if (randomValue > 0.7){
            winnerSound =  "winner_2";
          }
          playSound(winnerSound);

        } else {
          var gameOverSound = "game_over_0";
          if (Math.random() >= 0.5) {
            gameOverSound = "game_over_1";
          }
          playSound(gameOverSound);
          gameOverShown = true;

        }

      } else if (action == MSG_RESTART_GAME) {
        initScreeen();
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

  function initScreeen() {
    hideAllPlayers();
    document.getElementById("subtitle").innerHTML = "";
    document.getElementById("subtitle2").innerHTML = "-";
    document.getElementById("subtitle2").style.color = H2_TEXT_COLOR;
    var cellNames = ["B3", "C3", "C2", "B2", "A2", "A3", "A4", "B4", "C4", "D4", "D3", "D2", "D1", "C1", "B1", "A1"];
    var i = 0;
    for (i = 0; i < cellNames.length; i++) {
      var cellKey = "cell" + cellNames[i];
      document.getElementById(cellKey).style.backgroundColor = DEFAULT_CELL_COLOR;
      document.getElementById(cellKey).style.opacity = "1.0";
    }
    gameOverShown = false;
    countDownStart = false;
    lastTenPlayed = false;
  }

  function hideAllPlayers() {
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

  function startCountDown() {
    var dissapearOrder = ["C3", "B3", "B2", "C2", "D2", "D3", "D4", "C4", "B4", "A4", "A3", "A2", "A1", "B1", "C1", "D1"];
    var i = 0;
    for (i = 0; i < dissapearOrder.length; i++) {
      var cellKey = "cell" + dissapearOrder[i]
      document.getElementById(cellKey).style.backgroundColor = COUNTDOWN_CELL_COLOR;
    }

    var counter = 0,
      timer = setInterval(function () {
        if (counter === dissapearOrder.length) {
          //When finished
          playSound("start_game_0");
          clearInterval(timer);
          const objToSender =
          {
            type: MSG_START_COUNTDOWN,
            message: MSG_START_GAME
          };
          context.sendCustomMessage(CUSTOM_CHANNEL, undefined, objToSender);

        } else {
          var cellKey = "cell" + dissapearOrder[counter]
          document.getElementById(cellKey).style.backgroundColor = DEFAULT_CELL_COLOR;
          counter++
        }
      }, 400);

  }

  function checkBestScore() {
    var arr = new Array(8);
    var i;
    var maxScore = 0;
    for (i = 0; i < 8; i++) {
      let playerScore = "player_" + i + "_score";
      arr[i] = parseInt(document.getElementById(playerScore).innerText);
      if (arr[i] > maxScore) {
        maxScore = arr[i];
      }
    }
    for (i = 0; i < 8; i++) {
      let playerScore = "player_" + i + "_score";
      let playerName = "player_" + i + "_name";
      if (arr[i] == maxScore && arr[i] > 0) {
        document.getElementById(playerName).style.color = BEST_PLAYER_COLOR;
        document.getElementById(playerScore).style.color = BEST_SCORE_COLOR;
      } else {
        document.getElementById(playerName).style.color = PLAYER_COLOR;
        document.getElementById(playerScore).style.color = SCORE_COLOR;
      }

    }
  }

  function testColorsOnScreen() {

    document.getElementById("cellA1").style.backgroundColor = cPlayer_0;
    document.getElementById("cellB1").style.backgroundColor = cPlayer_1;
    document.getElementById("cellC1").style.backgroundColor = cPlayer_2;
    document.getElementById("cellD1").style.backgroundColor = cPlayer_3;

    document.getElementById("cellA2").style.backgroundColor = cPlayer_9;
    document.getElementById("cellB2").style.backgroundColor = DEFAULT_CELL_COLOR;
    document.getElementById("cellC2").style.backgroundColor = DEFAULT_CELL_COLOR;
    document.getElementById("cellD2").style.backgroundColor = cPlayer_4;

    document.getElementById("cellA3").style.backgroundColor = cPlayer_8;
    document.getElementById("cellB3").style.backgroundColor = DEFAULT_CELL_COLOR;
    document.getElementById("cellC3").style.backgroundColor = DEFAULT_CELL_COLOR;
    document.getElementById("cellD3").style.backgroundColor = cPlayer_5;

    document.getElementById("cellA4").style.backgroundColor = DEFAULT_CELL_COLOR;
    document.getElementById("cellB4").style.backgroundColor = cPlayer_7;
    document.getElementById("cellC4").style.backgroundColor = cPlayer_6;
    document.getElementById("cellD4").style.backgroundColor = DEFAULT_CELL_COLOR;

  }

  function playSound(htmlSound) {
    //console.log('function play: ', htmlSound);
    var soundSrc = document.getElementById(htmlSound).src;
    console.log('soundSrc: ', soundSrc);

    const loadRequestData = new cast.framework.messages.LoadRequestData();
    loadRequestData.media = new cast.framework.messages.MediaInformation();
    loadRequestData.media.contentId = soundSrc;
    loadRequestData.media.streamType = "BUFFERED"; 
    loadRequestData.autoplay = true;

    playerManager.load(loadRequestData).then(
      function () { console.log('Load succeed'); },
      function (errorCode) { console.log('Error code: ' + errorCode); }
    );

  }

  function getSoundIdByColor(color) {

    var playerSound = "laser_13";
    switch (color) {
      case cPlayer_0: playerSound = "laser_0"; break;
      case cPlayer_1: playerSound = "laser_1"; break;
      case cPlayer_2: playerSound = "laser_2"; break;
      case cPlayer_3: playerSound = "laser_3"; break;
      case cPlayer_4: playerSound = "laser_4"; break;
      case cPlayer_5: playerSound = "laser_5"; break;
      case cPlayer_6: playerSound = "laser_6"; break;
      case cPlayer_7: playerSound = "laser_7"; break;
      case cPlayer_8: playerSound = "laser_8"; break;
      case cPlayer_9: playerSound = "laser_9"; break;
      case DEFAULT_CELL_COLOR: playerSound = "clear_0"; break;
    }
    return playerSound;
  }

}(this));
