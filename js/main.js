window.onload = function(){
  console.log('MAIN.JS');
  var StarmeUpAddonChromeMain = StarmeUpAddonChromeMain || {};
  StarmeUpAddonChromeMain.SMUEnableLogger = true;

  StarmeUpAddonChromeMain.SMULogger = function(name) {
    if (StarmeUpAddonChromeMain.SMUEnableLogger === true) {
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

  StarmeUpAddonChromeMain.enableIntegration = function(){
    document.querySelector('#enableIntegration').checked = true;
    document.querySelector('.enableIntegration strong').innerHTML = 'Disable Facebook Integration';
    localStorage.setItem('IntegrationEnabled', 'true');
    chrome.browserAction.setIcon({
      path: '/img/icon.png'
    });
    StarmeUpAddonChromeMain.sendMessageToContent({'type': 'appIntegrationEnabled', 'token': localStorage['tokenSMULogged'], 'infoUserSMULogged': localStorage['InfoUserSMULogged'], 'profileUserSMULogged': localStorage['profileUserSMULogged']});

    if (window.location.pathname === '/popup.html') {
      // window.location.href = 'main.html';
    }
  };

  StarmeUpAddonChromeMain.disableIntegration = function(){
    document.querySelector('#enableIntegration').checked = false;
    document.querySelector('.enableIntegration strong').innerHTML = 'Enable Facebook Integration';
    localStorage.removeItem('IntegrationEnabled');
    chrome.browserAction.setIcon({
      path: '/img/icon-disabled.png'
    });
    StarmeUpAddonChromeMain.sendMessageToContent({'type': 'appIntegrationDisabled'});
  };

  StarmeUpAddonChromeMain.logOut = function(){
    var logger = StarmeUpAddonChromeMain.SMULogger('logOut');

    localStorage.removeItem('InfoUserSMULogged');
    localStorage.removeItem('IntegrationEnabled');
    localStorage.removeItem('profileUserSMULogged');
    localStorage.removeItem('tokenSMULogged');
    localStorage.removeItem('userSMULogged');
    chrome.browserAction.setIcon({
      path: '/img/icon-disabled.png'
    });


    logger.warn('Closed user session in addon');

    StarmeUpAddonChromeMain.sendMessageToContent({'type': 'logOut'});
    window.location.href = 'popup.html';
  };

  StarmeUpAddonChromeMain.sendMessageToContent = function(message){
    var logger = StarmeUpAddonChromeMain.SMULogger('SendMessage to Content');
      chrome.tabs.getSelected(null, function(tab){
        chrome.tabs.sendMessage(tab.id, message);
      });
  };



  // main.html Events
  // send to profile userSMU
  document.querySelector('#myProfile').addEventListener('click', function(e){
    var logger = StarmeUpAddonChromeMain.SMULogger('My Profile');

    logger.log('profileUserSMULogged: ', JSON.parse(localStorage.getItem('profileUserSMULogged')));
    var data = JSON.parse(localStorage.getItem('profileUserSMULogged'));
    var uid = data.uid;
    chrome.tabs.create({
      url: 'https://qa.starmeup.com/#profile/' + uid,
      active: true
    });
  });

  document.querySelector('#leaderboard').addEventListener('click', function(e){
    var logger = StarmeUpAddonChromeMain.SMULogger('Leaderboard');

    chrome.tabs.create({
      url: 'https://qa.starmeup.com/#leaderboard',
      active: true
    });

  });

  document.querySelector('#logOut').addEventListener('click', function(e){
    StarmeUpAddonChromeMain.logOut();
  });

  document.querySelector('#enableIntegration').addEventListener('change', function(e){
    var logger = StarmeUpAddonChromeMain.SMULogger('Enable Integration');

    // logger.log('isChecked');
    // logger.log(localStorage['tokenSMULogged']);

    if ('IntegrationEnabled' in localStorage) {
      StarmeUpAddonChromeMain.disableIntegration();
    }else{
      if ('userSMULogged' in localStorage) {
        StarmeUpAddonChromeMain.enableIntegration();
      }
    }
  });

  if ('userSMULogged' in localStorage) {
    StarmeUpAddonChromeMain.enableIntegration();

    if ('IntegrationEnabled' in localStorage) {
      chrome.browserAction.setIcon({
        path: '/img/icon.png'
      });

      document.querySelector('#enableIntegration').checked = true;
      document.querySelector('.enableIntegration strong').innerHTML = 'Disable Facebook Integration';
    }
    chrome.tabs.query({'active': true}, function(Tabs){
      chrome.browserAction.setPopup({
        popup: 'main.html'
      });
    });
  }else{
    chrome.browserAction.setIcon({
      path: '/img/icon-disabled.png'
    });

    document.querySelector('.enableIntegration strong').innerHTML = 'Enable Facebook Integration';
    chrome.tabs.query({'active': true}, function(Tabs){
      chrome.browserAction.setPopup({
        popup: 'popup.html'
      });
    });
  }


};
