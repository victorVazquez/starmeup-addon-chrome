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
      $('.enableIntegration strong').text('Disable Facebook Integration');
    }
    chrome.tabs.query({'active': true}, function(Tabs){
      chrome.browserAction.setPopup({
        popup: 'main.html'
      });
    });
  }else{
    $('.enableIntegration strong').text('Enable Facebook Integration');
    chrome.tabs.query({'active': true}, function(Tabs){
      chrome.browserAction.setPopup({
        popup: 'popup.html'
      });
    });
  }

  StarmeUpAddonChromePopUp.logIn = function(){
    var logger = StarmeUpAddonChromePopUp.SMULogger('Log In');
    logger.info('submit');
    StarmeUpAddonChromePopUp.username = $('#username').val();
    StarmeUpAddonChromePopUp.password = $('#password').val();
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
          $('#formStarmeUp .error').addClass('show');
        }else{
          $('#formStarmeUp .error').removeClass('show');
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
              StarmeUpAddonChromePopUp.enableIntegration();
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

  StarmeUpAddonChromePopUp.enableIntegration = function(){
    $('.enableIntegration strong').text('Disable Facebook Integration');
    localStorage.setItem('IntegrationEnabled', 'true');
    chrome.browserAction.setIcon({
      path: '/img/icon.png'
    });
    StarmeUpAddonChromePopUp.sendMessageToContent({'type': 'appIntegrationEnabled', 'token': localStorage['tokenSMULogged'], 'infoUserSMULogged': localStorage['InfoUserSMULogged'], 'profileUserSMULogged': localStorage['profileUserSMULogged']});

    if (window.location.pathname === '/popup.html') {
      window.location.href = 'main.html';
    }
  };

  StarmeUpAddonChromePopUp.disableIntegration = function(){
    $('.enableIntegration strong').text('Enable Facebook Integration');
    localStorage.removeItem('IntegrationEnabled');
    chrome.browserAction.setIcon({
      path: '/img/icon-disabled.png'
    });
    StarmeUpAddonChromePopUp.sendMessageToContent({'type': 'appIntegrationDisabled'});
  };

  StarmeUpAddonChromePopUp.logOut = function(){
    var logger = StarmeUpAddonChromePopUp.SMULogger('logOut');

    localStorage.removeItem('InfoUserSMULogged');
    localStorage.removeItem('IntegrationEnabled');
    localStorage.removeItem('profileUserSMULogged');
    localStorage.removeItem('tokenSMULogged');
    localStorage.removeItem('userSMULogged');

    logger.warn('Closed user session in addon');

    StarmeUpAddonChromePopUp.sendMessageToContent({'type': 'logOut'});
    window.location.href = 'popup.html';
  };


  // popup.html Events
  $('#logIn').on('click', function(e){
    StarmeUpAddonChromePopUp.logIn();
  });

  $('#username, #password').keypress(function (e) {
    console.log('Event: ', e);
    console.log(e.charCode);
    if (e.charCode == 13) {
      console.log('Enter key');
      StarmeUpAddonChromePopUp.logIn();
    }
  });

  // main.html Events
  // send to profile userSMU
  $('#myProfile').on('click', function(e){
    var logger = StarmeUpAddonChromePopUp.SMULogger('My Profile');

    logger.log('profileUserSMULogged: ', JSON.parse(localStorage.getItem('profileUserSMULogged')));
    var data = JSON.parse(localStorage.getItem('profileUserSMULogged'));
    var uid = data.uid;
    chrome.tabs.create({
      url: 'https://qa.starmeup.com/#profile/' + uid,
      active: true
    });
  });

  $('#leaderboard').on('click', function(e){
    var logger = StarmeUpAddonChromePopUp.SMULogger('Leaderboard');

    chrome.tabs.create({
      url: 'https://qa.starmeup.com/#leaderboard',
      active: true
    });

  });

  $('#logOut').on('click', function(e){
    StarmeUpAddonChromePopUp.logOut();
  });

  $('#enableIntegration').change(function(e){
    var logger = StarmeUpAddonChromePopUp.SMULogger('Enable Integration');

    // logger.log('isChecked');
    // logger.log(localStorage['tokenSMULogged']);

    if ('IntegrationEnabled' in localStorage) {
      StarmeUpAddonChromePopUp.disableIntegration();
    }else{
      if ('userSMULogged' in localStorage) {
        StarmeUpAddonChromePopUp.enableIntegration();
      }
    }
  });




};
