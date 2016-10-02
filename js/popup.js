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


  if ('userSMULogged' in localStorage) {
    if ('IntegrationEnabled' in localStorage) {
      $('#enableIntegration').prop('checked', true);
      $('.toggle-switch-title').text('Disable Facebook Integration');
    }
    chrome.tabs.query({'active': true}, function(Tabs){
      chrome.browserAction.setPopup({
        // tabId: Tabs[0].id,
        popup: 'main.html'
      });
    });
    // window.location.href = 'main.html';
  }else{
    $('.toggle-switch-title').text('Enable Facebook Integration');
    chrome.tabs.query({'active': true}, function(Tabs){
      chrome.browserAction.setPopup({
        // tabId: Tabs[0].id,
        popup: 'popup.html'
      });
    });
    // alert('Integration Disabled');
  }


  StarmeUpAddonChromePopUp.authenticateUserSMU = function(){
    var logger = StarmeUpAddonChromePopUp.SMULogger('Authenticate User');
    // logger.log('StarmeUpAddonChromePopUp.username: ', StarmeUpAddonChromePopUp.username);
    // logger.log(StarmeUpAddonChromePopUp.password);
    // return;
    var requestUserSMUData = new XMLHttpRequest();
    var url = 'https://qa.starmeup.com/starmeup-api/v2/sec/authenticateuser/?email=' + StarmeUpAddonChromePopUp.username + '&password=' + StarmeUpAddonChromePopUp.password;
    requestUserSMUData.open('POST', url, true);
    requestUserSMUData.onreadystatechange = function(){
      // logger.log(requestUserSMUData);
      // return;
      if (requestUserSMUData.readyState == 4) {
        var data = JSON.parse(requestUserSMUData.responseText);
        logger.log('data: ', data);
        // return;
        // logger.log('data.errorCode: ', data.errorCode);
        if (data.errorCode == 100 || data.errorCode == 125) { // invalid credentials
          $('#formStarmeUp .error').addClass('show');
        }else{
          $('#formStarmeUp .error').removeClass('show');
          var profileUserSMULogged = data.result;
          var tokenSMULogged = data.token;
          // var idLoggedUser = data.result.id; // loggedUser
          var idLoggedUser = 44; // davidRincon

          localStorage.setItem('profileUserSMULogged', JSON.stringify(profileUserSMULogged));
          localStorage.setItem('tokenSMULogged', tokenSMULogged);
          localStorage.setItem('userSMULogged', 'true');


          StarmeUpAddonChromePopUp.getInfoUserSMULogged(idLoggedUser);
          // Redirect to main screen
          // window.location.href = 'main.html';

          // chrome.tabs.query({'active': true}, function(Tabs){
          //   // logger.log(Tabs);
          //   // chrome.tabs.sendMessage(Tabs[1].id, {'type': 'profile', 'profile': profile});
          //   chrome.tabs.sendMessage(Tabs[1].id, {'type': 'userLogged', 'token': tokenSMULogged, 'profileUserSMULogged': profileUserSMULogged});
          // });
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
              StarmeUpAddonChromePopUp.sendMessageToContent({'type': 'userLogged', 'infoUserSMULogged': localStorage['InfoUserSMULogged']});
              window.location.href = 'main.html';

              // chrome.tabs.query({'active': true}, function(Tabs){
              //   var numTabs = Tabs.length;
              //   var i;
              //   for(i = 0; i < numTabs; i++){
              //     logger.warn(Tabs[i].url);
              //     if (Tabs[i].url === 'https://www.facebook.com/') {
              //       chrome.tabs.sendMessage(Tabs[i].id, {'type': 'userLogged', 'infoUserSMULogged': localStorage['InfoUserSMULogged']});
              //       window.location.href = 'main.html';
              //     }
              //   }
              //   // logger.log('infoUserSMULogged: ', JSON.parse(localStorage['InfoUserSMULogged']));
              // });
            }
          }
        };
        xhr.send();
    }

  };

  StarmeUpAddonChromePopUp.sendMessageToContent = function(message){
    var logger = StarmeUpAddonChromePopUp.SMULogger('SendMessage to Content');

    chrome.tabs.query({'active': true}, function(Tabs){
      var numTabs = Tabs.length;
      var i;
      for(i = 0; i < numTabs; i++){
        logger.warn(Tabs[i].url);
        if (Tabs[i].url === 'https://www.facebook.com/') {
          chrome.tabs.sendMessage(Tabs[i].id, message);
          // window.location.href = 'main.html';
        }
      }
    });
  };


  // $('#logOut').on('click', function(e){
  //   chrome.tabs.getSelected(null, function(tab){
  //     chrome.tabs.sendMessage(tab.id, {'type': 'remove'});
  //   });
  // });
  //

  $('#logIn').on('click', function(e){
    var logger = StarmeUpAddonChromePopUp.SMULogger('Log In');

    StarmeUpAddonChromePopUp.username = $('#username').val();
    StarmeUpAddonChromePopUp.password = $('#password').val();
    // If user is already logged
    if (localStorage.getItem('userSMULogged') === null) {
      StarmeUpAddonChromePopUp.authenticateUserSMU();
    }else{
      // Do something
    }
  });

  // send to profile userSMU
  $('#myProfile').on('click', function(e){
    var logger = StarmeUpAddonChromePopUp.SMULogger('My Profile');

    logger.log('profileUserSMULogged: ', JSON.parse(localStorage.getItem('profileUserSMULogged')));
    var data = JSON.parse(localStorage.getItem('profileUserSMULogged'));
    var uid = data.uid;
    chrome.tabs.create({
      url: 'https://qa.starmeup.com/#profile/' + uid,
      active: true
    }, function(){

    });
  });

  $('#leaderboard').on('click', function(e){
    var logger = StarmeUpAddonChromePopUp.SMULogger('Leaderboard');

    chrome.tabs.create({
      url: 'https://qa.starmeup.com/#leaderboard',
      active: true
    }, function(){

    });

  });

  $('#enableIntegration').change(function(e){
    var logger = StarmeUpAddonChromePopUp.SMULogger('Enable Integration');

    // logger.log('isChecked');
    // logger.log(localStorage['tokenSMULogged']);

    if ('IntegrationEnabled' in localStorage) {
      $('.toggle-switch-title').text('Enable Facebook Integration');
      // chrome.tabs.query({'active': true}, function(Tabs){
      //   chrome.tabs.sendMessage(Tabs[1].id, {'type': 'appIntegrationDisabled'});
      // });
      localStorage.removeItem('IntegrationEnabled');
      StarmeUpAddonChromePopUp.sendMessageToContent({'type': 'appIntegrationDisabled'});
    }else{
      $('.toggle-switch-title').text('Disable Facebook Integration');
      // chrome.tabs.query({'active': true}, function(Tabs){
      //   logger.log(Tabs);
      //   logger.log('token: ', localStorage['tokenSMULogged']);
      //   logger.log('infoUserSMULogged: ', JSON.parse(localStorage['InfoUserSMULogged']));
      //   logger.log('profileUserSMULogged: ', JSON.parse(localStorage['profileUserSMULogged']));
      //   // chrome.tabs.sendMessage(Tabs[1].id, {'type': 'profile', 'profile': profile});
      //   localStorage.setItem('IntegrationEnabled', 'true');
      //   chrome.tabs.sendMessage(Tabs[1].id, {'type': 'appIntegrationEnabled', 'token': localStorage['tokenSMULogged'], 'infoUserSMULogged': localStorage['InfoUserSMULogged'], 'profileUserSMULogged': localStorage['profileUserSMULogged']});
      // });

      localStorage.setItem('IntegrationEnabled', 'true');
      StarmeUpAddonChromePopUp.sendMessageToContent({'type': 'appIntegrationEnabled', 'token': localStorage['tokenSMULogged'], 'infoUserSMULogged': localStorage['InfoUserSMULogged'], 'profileUserSMULogged': localStorage['profileUserSMULogged']});
    }
    // return;

  });


};
