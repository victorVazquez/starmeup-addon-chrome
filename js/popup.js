window.onload = function(){
  console.log('POPUP.JS');
  var StarmeUpAddonChromePopUp = StarmeUpAddonChromePopUp || {};
  StarmeUpAddonChromePopUp.SMUEnableLogger = true;

  StarmeUpAddonChromePopUp.SMULogger = function(name) {
    if (StarmeUpAddonChromePopUp.SMUEnableLogger === true) {
      return {
            debug: console.log.bind(console, '\b[' + name + ']\n '),
            log: console.log.bind(console, '\b[' + name + ']\n '),
            info: console.info.bind(console, '[' + name + ']\n '),
            warn: console.warn.bind(console, '[' + name + ']\n '),
            error: console.error.bind(console, '[' + name + ']\n ') };
    } else {
      var dummyFunction = function() {};
      return {
            debug: dummyFunction,
            log: dummyFunction,
            info: dummyFunction,
            warn: dummyFunction,
            error: dummyFunction };
    }
  };



  StarmeUpAddonChromePopUp.logIn = function(){
    var logger = StarmeUpAddonChromePopUp.SMULogger('Log In');
    logger.info('submit');
    StarmeUpAddonChromePopUp.username = document.querySelector('#username').value;
    StarmeUpAddonChromePopUp.password = document.querySelector('#password').value;
    // If user is already logged
    if (localStorage.getItem('userSMULogged') === null) {
      StarmeUpAddonChromePopUp.authenticateUserSMU();
    }
  };

  StarmeUpAddonChromePopUp.authenticateUserSMU = function(){
    var logger = StarmeUpAddonChromePopUp.SMULogger('Authenticate User');
    var requestUserSMUData = new XMLHttpRequest();
    var url = 'https://qa.starmeup.com/starmeup-api/v2/sec/authenticateuser/?email=' + StarmeUpAddonChromePopUp.username + '&password=' + StarmeUpAddonChromePopUp.password;
    requestUserSMUData.open('POST', url, true);
    requestUserSMUData.onreadystatechange = function(){
      if (requestUserSMUData.readyState == 4) {
        var data = JSON.parse(requestUserSMUData.responseText);
        logger.log('data: ', data);
        // logger.log('data.errorCode: ', data.errorCode);
        if (data.errorCode == 100 || data.errorCode == 125) { // invalid credentials
          document.querySelector('#formStarmeUp .error span').className = 'show';
        }else{
          document.querySelector('#formStarmeUp .error span').className = 'hide';
          var profileUserSMULogged = data.result;
          var tokenSMULogged = data.token;
          // var idLoggedUser = data.result.id; // loggedUser
          var idLoggedUser = 44; // using davidRincon because victorVazquez has no stars

          localStorage.setItem('profileUserSMULogged', JSON.stringify(profileUserSMULogged));
          localStorage.setItem('tokenSMULogged', tokenSMULogged);
          localStorage.setItem('userSMULogged', 'true');
          StarmeUpAddonChromePopUp.getInfoUserSMULogged(idLoggedUser);
        }
      }
    };
    requestUserSMUData.send();
  };

  StarmeUpAddonChromePopUp.getInfoUserSMULogged = function(id){
    var logger = StarmeUpAddonChromePopUp.SMULogger('Get Info User SMU Logged');

    var urls = [
      'https://qa.starmeup.com/starmeup-api/v2/stellar/starsreceived/'+ id + '?v=2&o=SMU_WEB',
      'https://qa.starmeup.com/starmeup-api/v2/stellar/starsgiven/'+ id + '?v=2&o=SMU_WEB',
      'https://qa.starmeup.com/starmeup-api/v2/achievements/badges/'+ id + '/earned?v=2&o=SMU_WEB',
      'https://qa.starmeup.com/starmeup-api/v2/stellar/remainder/stars?v=2&o=SMU_WEB'
    ];

    var requests = new Array();
    var info = {};
    var numRequest = 0;

    for (var i in urls) {
      if (urls.hasOwnProperty(i)) {
        requests[i] = new requestSMU(urls[i]);
      }
    }

    function requestSMU(url){
      var _url = url;
      var queues = {};
      var xhr = new XMLHttpRequest();
      xhr.open('GET', _url, true);
      xhr.setRequestHeader('TOKEN', localStorage['tokenSMULogged']);
        xhr.onreadystatechange = function(){
          if (xhr.readyState == 4 && xhr.status == 200) {
            var data = JSON.parse(xhr.responseText);
            var typeInfo = _url.match(/(\/)[a-z]+/g)[4].substr(1);
            logger.log('typeInfo: ', typeInfo);
            switch (typeInfo) {
              case 'starsreceived':
                info['starsReceived'] = data.result;
              break;

              case 'starsgiven':
                info['starsGiven'] = data.result.length;
              break;

              case 'badges':
                info['badges'] = data.result.earned;
              break;

              case 'remainder':
                info['starsRemaining'] = data.result;
              break;

            }

            localStorage.setItem('InfoUserSMULogged', JSON.stringify(info));

            numRequest++;
            if (numRequest == urls.length) {
              logger.log('finish requests: ');
              logger.log('info finish: ', info);
              StarmeUpAddonChromePopUp.sendMessageToContent({'type': 'logIn', 'infoUserSMULogged': localStorage['InfoUserSMULogged']});
              window.location.href = 'main.html';
            }
          }
        };
        xhr.send();
    }

  };

  StarmeUpAddonChromePopUp.sendMessageToContent = function(message){
    var logger = StarmeUpAddonChromePopUp.SMULogger('SendMessage to Content');
      chrome.tabs.getSelected(null, function(tab){
        chrome.tabs.sendMessage(tab.id, message);
      });
  };


  // popup.html Events
  document.querySelector('#logIn').addEventListener('click', function(e){
    StarmeUpAddonChromePopUp.logIn();
  });

  document.querySelector('#username').addEventListener('keypress',function (e) {
    console.log(e);
    if (e.charCode == 13) {
      StarmeUpAddonChromePopUp.logIn();
    }
  });
  document.querySelector('#password').addEventListener('keypress',function (e) {
    console.log(e);
    if (e.charCode == 13) {
      StarmeUpAddonChromePopUp.logIn();
    }
  });

};
