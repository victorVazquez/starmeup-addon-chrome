window.onload = function(){
  console.log('POPUP.JS');
  var StarmeUpAddonChromePopUp = StarmeUpAddonChromePopUp || {};
  // var __url__ = 'https://qa.starmeup.com/starmeup-api/v2/stellar/starsreceived/';
  // var expReg = /(https:\/\/qa.starmeup.com\/starmeup-api\/v2\/stellar\/)+/g;
  // var expReg = /(\/)[a-z]+/g;
  // console.log(__url__);
  // console.log(__url__.match(expReg)[4].substring(1));

  // chrome.browserAction.onClicked.addListener(function(tab) {
  //     alert('Hi');
  // });

  if ('userSMULogged' in localStorage) {
    // alert('Integration Enabled');
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
    // console.log('StarmeUpAddonChromePopUp.username: ', StarmeUpAddonChromePopUp.username);
    // console.log(StarmeUpAddonChromePopUp.password);
    // return;
    var requestUserSMUData = new XMLHttpRequest();
    var url = 'https://qa.starmeup.com/starmeup-api/v2/sec/authenticateuser/?email=' + StarmeUpAddonChromePopUp.username + '&password=' + StarmeUpAddonChromePopUp.password;
    requestUserSMUData.open('POST', url, true);
    requestUserSMUData.onreadystatechange = function(){
      // console.log(requestUserSMUData);
      // return;
      if (requestUserSMUData.readyState == 4) {
        var data = JSON.parse(requestUserSMUData.responseText);
        console.log('data: ', data);
        // return;
        // console.log('data.errorCode: ', data.errorCode);
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
          //   // console.log(Tabs);
          //   // chrome.tabs.sendMessage(Tabs[1].id, {'type': 'profile', 'profile': profile});
          //   chrome.tabs.sendMessage(Tabs[1].id, {'type': 'userLogged', 'token': tokenSMULogged, 'profileUserSMULogged': profileUserSMULogged});
          // });
        }
      }
    };
    requestUserSMUData.send();
  };

  StarmeUpAddonChromePopUp.getInfoUserSMULogged = function(id){
    // console.log('id: ', id);
    // return;
    var urls = [
      'https://qa.starmeup.com/starmeup-api/v2/stellar/starsreceived/'+ id + '?v=2&o=SMU_WEB',
      'https://qa.starmeup.com/starmeup-api/v2/stellar/starsgiven/'+ id + '?v=2&o=SMU_WEB',
      'https://qa.starmeup.com/starmeup-api/v2/achievements/badges/'+ id + '/earned?v=2&o=SMU_WEB',
      'https://qa.starmeup.com/starmeup-api/v2/stellar/remainder/stars?v=2&o=SMU_WEB'
    ];

    var requests = new Array();
    var info = {};
    var result = [];
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
            console.log('typeInfo: ', typeInfo);
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
            // result.push(data.result);
            // info['']
            // switch(typeof data.result){
            //   case 'number':
            //   if (_url.match(/remainder/g)) {
            //     info['starsRemaining'] = data.result;
            //   }else{
            //     info['starsReceived'] = data.result;
            //   }
            //   break;
            //
            //   case 'object':
            //     if (data.result instanceof Array) {
            //       info['starsGiven'] = data.result.length;
            //     }else{
            //       info['Badges'] = data.result.earned;
            //     }
            //   break;
            // }

            localStorage.setItem('InfoUserSMULogged', JSON.stringify(info));
            // console.log('typeof data.result: ', typeof data.result);
            // var instance = data.result;
            // console.log('instanceof: ', data.result instanceof Array);
            // // console.log('data: ', data);
            // console.log('queues: ', data.result);
            // console.log('result: ', result);
            console.log('info: ', info);
            numRequest++;
            if (numRequest == urls.length) {
              // console.log('finish requests');
              // console.log('info finish: ', info);
              chrome.tabs.query({'active': true}, function(Tabs){
                chrome.tabs.sendMessage(Tabs[1].id, {'type': 'userLogged', 'infoUserSMULogged': JSON.parse(localStorage['InfoUserSMULogged'])});
                window.location.href = 'main.html';
              });
            }
            // console.log('constructor: ', data.result.constructor);
          }
        };
        xhr.send();
        // console.log('urls.length: ', urls.length);
        // console.log('numRequest: ', numRequest);
    }

  };

  // $('#logOut').on('click', function(e){
  //   chrome.tabs.getSelected(null, function(tab){
  //     chrome.tabs.sendMessage(tab.id, {'type': 'remove'});
  //   });
  // });
  //

  $('#logIn').on('click', function(e){
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
    console.log('profileUserSMULogged: ', JSON.parse(localStorage.getItem('profileUserSMULogged')));
    var data = JSON.parse(localStorage.getItem('profileUserSMULogged'));
    var uid = data.uid;
    chrome.tabs.create({
      url: 'https://qa.starmeup.com/#profile/' + uid,
      active: true
    }, function(){

    });
  });

  $('#leaderboard').on('click', function(e){
    chrome.tabs.create({
      url: 'https://qa.starmeup.com/#leaderboard',
      active: true
    }, function(){

    });

  });

  $('#enableIntegration').change(function(e){
    // console.log('isChecked');
    // console.log(localStorage['tokenSMULogged']);

    if ('IntegrationEnabled' in localStorage) {
      $('.toggle-switch-title').text('Enable Facebook Integration');
      chrome.tabs.query({'active': true}, function(Tabs){
        localStorage.removeItem('IntegrationEnabled');
        chrome.tabs.sendMessage(Tabs[1].id, {'type': 'appIntegrationDisabled'});
      });
    }else{
      $('.toggle-switch-title').text('Disable Facebook Integration');
      chrome.tabs.query({'active': true}, function(Tabs){
        // console.log(Tabs);
        // chrome.tabs.sendMessage(Tabs[1].id, {'type': 'profile', 'profile': profile});
        localStorage.setItem('IntegrationEnabled', 'true');
        chrome.tabs.sendMessage(Tabs[1].id, {'type': 'appIntegrationEnabled', 'token': localStorage['tokenSMULogged'], 'infoUserSMULogged': JSON.stringify(localStorage['InfoUserSMULogged']), 'profileUserSMULogged': JSON.parse(localStorage['profileUserSMULogged'])});
      });
    }
    // return;

  });
};
