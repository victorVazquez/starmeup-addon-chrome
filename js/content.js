/*content.js*/
console.log('CONTENT.JS');
var StarmeUpAddonChromeContent = StarmeUpAddonChromeContent || {};

// StarmeUpAddonChromeContent.makeRequestSMU = function(method, url, useToken, typeRequest){
//   var xhr = new XMLHttpRequest();
//   var token = localStorage.getItem('TokenUserSMULogged');
//   var info = [];
//   xhr.open(method, url, true);
//   if (useToken === true) {
//     xhr.setRequestHeader('TOKEN', token);
//   }
//   xhr.onreadystatechange = function(){
//     if (xhr.readyState == 4) {
//       var data = JSON.parse(xhr.responseText);
//       info.push(xhr.responseText);
//       console.log('info from xhr: ', info);
//       localStorage.setItem('InfoLoggedUser', {typeRequest: xhr.responseText});
//       // switch(typeRequest) {
//       //   case 'received':
//       //     localStorage.setItem('InfoLoggedUser', {info.push(data)})
//       //   break;
//       // }
//       if (data.result.length > 0) {
//         console.log('dataUserFB: ', data);
//         for (var i = 0; i < data.result.length; i++) {
//         }
//         // console.log();
//       }else{
//         console.warn('No data result from xhr');
//       }
//     }
//   };
//   xhr.send();
// };

StarmeUpAddonChromeContent.findUserSMU = function(userName, element){
  var locateUserSMU = new XMLHttpRequest();
  var url = 'https://qa.starmeup.com/starmeup-api/v2/smart/locateusers?searchString=' + userName;
  console.log('url: ', url);
  var token = localStorage.getItem('TokenUserSMULogged');
  locateUserSMU.open('GET', url, true);
  locateUserSMU.setRequestHeader('TOKEN', token);
  locateUserSMU.onreadystatechange = function(){
    if (locateUserSMU.readyState == 4) {
      var data = JSON.parse(locateUserSMU.responseText);
      if (data.result.length > 0) {
        console.log('dataUserFB: ', data);
        localStorage.setItem('ProfileUsersSMU', JSON.stringify(data.result));
        for (var i = 0; i < data.result.length; i++) {
          var identification = data.result[i].identification.substr(0, userName.length);
          console.log("userName === data.result[i].firstName + ' ' + data.result[i].lastName");
          console.log(userName === data.result[i].firstName + ' ' + data.result[i].lastName);
          console.log(userName.length);
          console.log('identification: ', identification);
          // if (userName === data.result[i].firstName + ' ' + data.result[i].lastName) {
          if (userName === identification) {
            console.log(data.result[i].firstName + ' ' + data.result[i].lastName);
            StarmeUpAddonChromeContent.renderProfile(data.result[i], element);
          }else{
            // console.log(i);
            // console.log(data.result.length);
            // console.log(i >= (data.result.length -1) );
            console.warn('The SMU user "' + data.result[i].firstName + ' ' + data.result[i].lastName + '" doesn\'t match with the Facebook user "' + userName + '"');
            // if (i >= (data.result.length -1) ) {
            //   console.log('**************************************');
            //   console.warn('No SMU users match the Facebook user "' + userName + '"');
            // }
          }
        }
        // console.log();
      }else{
        console.warn('No SMU users that match the Facebook user');
      }
    }
  };
  locateUserSMU.send();
};

// StarmeUpAddonChromeContent.getInfoLoggedUser = function () {
//   var profile = JSON.parse(localStorage['ProfileUserSMULogged']);
//   var id = profile.id;
//   var url_received = 'https://qa.starmeup.com/starmeup-api/v2/stellar/starsreceived/'+ id + '?v=2&o=SMU_WEB';
//   var url_given = 'https://qa.starmeup.com/starmeup-api/v2/stellar/starsgiven/'+ id + '?v=2&o=SMU_WEB';
//   var url_earned = 'https://qa.starmeup.com/starmeup-api/v2/achievements/badges/'+ id + '/earned?v=2&o=SMU_WEB';
//
//   console.log('id: ', id);
//   StarmeUpAddonChromeContent.makeRequestSMU('GET', url_received, true, 'received');
//   StarmeUpAddonChromeContent.makeRequestSMU('GET', url_given, true, 'given');
//
//   if ('InfoLoggedUser' in localStorage) {
//     console.log('starsReceived: ', localStorage.getItem('InfoLoggedUser'));
//   }
// };

StarmeUpAddonChromeContent.renderInfoLoggedUser = function(){
  var infoUserSMULogged = JSON.parse(localStorage['InfoUserSMULogged']);
  // console.log('infoUserSMULogged: ', infoUserSMULogged);
  if ($('#StarmeUpAddonChromeContent').length === 0) {
    $('#pagelet_navigation').before('<div id="StarmeUpAddonChromeContent"></div>');
    $('#StarmeUpAddonChromeContent').hide().append('<div id="smuAddonFBHeader"><img src="https://qa.starmeup.com/assets/img/favicon.ico" width="16" height="16" /> <strong>StarmeUp</strong></div><div id="smuAddonFBBody"><div id="infoUserSMULogged"><div class="stars"><span>'+infoUserSMULogged.starsReceived+'</span><strong>STARS</strong></div><div class="badges"><span>'+infoUserSMULogged.badges+'</span><strong>BADGES</strong></div><div class="remaining"><span>'+infoUserSMULogged.starsRemaining+'</span><strong>REMAINING</strong></div></div></div>');
    $('#StarmeUpAddonChromeContent').slideDown();
    console.info('The infoUserSMULogged has added succesfully before #pagelet_navigation :)');
  }else{
    console.warn('The infoUserSMULogged has been added');
  }

};

StarmeUpAddonChromeContent.renderProfile = function(profile, element){
  console.log(element);

  switch(element){
    case '#pagelet_navigation':
    console.log('ProfileUserSMULogged', JSON.parse(localStorage['ProfileUserSMULogged']) );
    // return;
    var profileUserLogged = JSON.parse(localStorage['ProfileUserSMULogged']);
    if ($('#StarmeUpAddonChromeContent').length === 0) {
      $('#pagelet_navigation').before('<div id="StarmeUpAddonChromeContent"></div>');
      $('#StarmeUpAddonChromeContent').hide().append('<div id="smuAddonFBHeader"><img src="https://qa.starmeup.com/assets/img/favicon.ico" width="16" height="16" /> <strong>Starmeup Profile</strong></div><div id="smuAddonFBBody"><i class="fa fa-institution" aria-hidden="true"></i> <strong>ORGANIZATION</strong><br><span>'+profileUserLogged.organizationName+'</span><br><i class="fa fa-user" aria-hidden="true"></i> <strong>POSITION</strong><br><span>'+profileUserLogged.job+'</span><br><i class="fa fa-map-marker" aria-hidden="true"></i> <strong>LOCATION</strong><br><span>'+profileUserLogged.office.name+'</span><br><i class="fa fa-briefcase" aria-hidden="true"></i> <strong>AREA</strong><br><span>'+profileUserLogged.area+'</span><br><i class="fa fa-suitcase" aria-hidden="true"></i> <strong>PROJECT</strong><br><span>'+profileUserLogged.project+'</span><br><i class="fa fa-folder-open" aria-hidden="true"></i>  <strong>ACCOUNT</strong><br><span>'+profileUserLogged.account+'</span><br></div>');
      $('#StarmeUpAddonChromeContent').slideDown();
      console.info('The profile has added succesfully before #pagelet_navigation :)');
    }else{
      console.warn('The profile has been added');
    }
    break;

    case '#fbProfileCover':
    if ($('#StarmeUpAddonChromeContent').length === 0) {
      $('#fbProfileCover').after('<div id="StarmeUpAddonChromeContent"></div>');
      $('#StarmeUpAddonChromeContent').hide().append('<div id="smuAddonFBHeader"><img src="https://qa.starmeup.com/assets/img/favicon.ico" width="16" height="16" /> <strong>Starmeup Profile</strong></div><div id="smuAddonFBBody"><i class="fa fa-institution" aria-hidden="true"></i> <strong>ORGANIZATION</strong><br><span>'+profile.organizationName+'</span><br><i class="fa fa-user" aria-hidden="true"></i> <strong>POSITION</strong><br><span>'+profile.job+'</span><br><i class="fa fa-map-marker" aria-hidden="true"></i> <strong>LOCATION</strong><br><span>'+profile.organizationOfficeName+'</span><br><i class="fa fa-briefcase" aria-hidden="true"></i> <strong>AREA</strong><br><span>'+profile.area+'</span><br><i class="fa fa-suitcase" aria-hidden="true"></i> <strong>PROJECT</strong><br><span>'+profile.project+'</span><br><i class="fa fa-folder-open" aria-hidden="true"></i>  <strong>ACCOUNT</strong><br><span>'+profile.account+'</span><br></div>');
      $('#StarmeUpAddonChromeContent').slideDown();
      console.info('The profile has added succesfully in #fbProfileCover :)');
    }else{
      console.warn('The profile has been added');
    }
    break;

    case '#pagelet_escape_hatch':
    if ($('#StarmeUpAddonChromeContent').length === 0) {
      $('#timeline_top_section').after('<div id="StarmeUpAddonChromeContent" class="profileUserSMU"></div>');
      $('#StarmeUpAddonChromeContent').hide().append('<div id="smuAddonFBHeader" class="clearfix"><img src="https://qa.starmeup.com/assets/img/favicon.ico" width="16" height="16" /> <strong>Starmeup</strong></div><div id="smuAddonFBBody"><i class="fa fa-map-marker" aria-hidden="true"></i> <strong>LOCATION</strong><br><span>'+profile.organizationOfficeName+'</span><br><i class="fa fa-envelope" aria-hidden="true"></i> <strong>EMAIL</strong><br><span>'+profile.identification+'</span><br><i class="fa fa-briefcase" aria-hidden="true"></i> <strong>AREA</strong><br><span>'+profile.area+'</span><br><i class="fa fa-suitcase" aria-hidden="true"></i> <strong>PROJECT</strong><br><span>'+profile.project+'</span><br><i class="fa fa-folder-open" aria-hidden="true"></i>  <strong>ACCOUNT</strong><br><span>'+profile.account+'</span><br><p><a href="https://qa.starmeup.com" target="_blank">Give a Star</a></p></div>');
      $('#StarmeUpAddonChromeContent').slideDown();
      console.info('The profile has added succesfully in #pagelet_escape_hatch :)');
    }else{
      console.warn('The profile has been added');
    }
    break;

    case '#pagelet_pymk_timeline':
    if ($('#StarmeUpAddonChromeContent').length === 0) {
      $('#pagelet_pymk_timeline').before('<div id="StarmeUpAddonChromeContent"></div>');
      $('#StarmeUpAddonChromeContent').hide().append('<div id="smuAddonFBHeader"><img src="https://qa.starmeup.com/assets/img/favicon.ico" width="16" height="16" /> <strong>Starmeup Profile</strong></div><div id="smuAddonFBBody"><i class="fa fa-institution" aria-hidden="true"></i> <strong>ORGANIZATION</strong><br><span>'+profile.organizationName+'</span><br><i class="fa fa-user" aria-hidden="true"></i> <strong>POSITION</strong><br><span>'+profile.job+'</span><br><i class="fa fa-map-marker" aria-hidden="true"></i> <strong>LOCATION</strong><br><span>'+profile.organizationOfficeName+'</span><br><i class="fa fa-briefcase" aria-hidden="true"></i> <strong>AREA</strong><br><span>'+profile.area+'</span><br><i class="fa fa-suitcase" aria-hidden="true"></i> <strong>PROJECT</strong><br><span>'+profile.project+'</span><br><i class="fa fa-folder-open" aria-hidden="true"></i>  <strong>ACCOUNT</strong><br><span>'+profile.account+'</span><br></div>');
      $('#StarmeUpAddonChromeContent').slideDown();
      console.info('The profile has added succesfully in #pagelet_escape_hatch :)');
    } else{
      console.warn('The profile has been added');
    }
    break;
  }



};

StarmeUpAddonChromeContent.removeProfile = function(){
  $('#StarmeUpAddonChromeContent').slideUp(function(){
    $('#StarmeUpAddonChromeContent').remove();
    console.warn('StarmeUpAddonChromeContent removed');
  });
};

StarmeUpAddonChromeContent.disableIntegration = function () {
  localStorage.removeItem('AppIntegrationEnabled');
  console.warn('App Integration has been disabled');
  StarmeUpAddonChromeContent.removeProfile();
};

StarmeUpAddonChromeContent.lookUpRenderElements = function(elements){
  var numElements = elements.length;

  var elements_str = elements.splice(',').join(', ');
  var elements_found = $('body').find($(elements_str));
  var elements_arr = elements_str.split(', ');

  // console.info('elements_found: ', elements_found);
  // console.log('Elements Arr: ', elements_arr);
  // console.log('Elements found: ', elements_found);
  // console.log('typeof elements_found: ', typeof elements_found);
  // console.log('elements_found.length: ', elements_found.length);

  if (elements_found.length > 0) {
    // var numElements = elements_found.length;
    // console.log('***********************');
    // console.log('elements.length: ', elements.length);
    for (var i = 0; i < elements_found.length; i++) {
      console.warn(elements_found[i].id);
      // $(elements[i]).hide();
      switch(elements_found[i].id){

        case 'pagelet_navigation':
        // var profile = JSON.stringify(localStorage['ProfileUserSMULogged']);
        // var element = '#pagelet_navigation';
        // Show Stars of current user
        // StarmeUpAddonChromeContent.renderProfile(profile, element);
        // StarmeUpAddonChromeContent.getInfoLoggedUser();
        StarmeUpAddonChromeContent.renderInfoLoggedUser();

        break;

        case 'pagelet_welcome_box':
        var userName = $('#pageTitle').text();
        console.log(' ');
        console.log(userName.split(' ').join('.').toLowerCase());

        console.log('url: ', window.location.href);
        var element = '#pagelet_welcome_box';
        // alert('hi' + userName);
        userName = userName.split(' ').join('.').toLowerCase();
        StarmeUpAddonChromeContent.findUserSMU(userName, element);

        break;

        // case '#fbProfileCover':
        case 'pagelet_escape_hatch':
        var userName = $('#pageTitle').text();
        console.info('userName: ', userName);
        console.log(' ');
        console.log(userName.split(' ').join('.').toLowerCase());
        console.log('url: ', window.location.href);
        var element = '#pagelet_escape_hatch';
        // alert('hi' + userName);
        userName = userName.split(' ').join('.').toLowerCase();
        StarmeUpAddonChromeContent.findUserSMU(userName, element);
        break;

        case 'pagelet_pymk_timeline':
        var userName = $('#pageTitle').text();
        var element = '#pagelet_pymk_timeline';
        console.log(' ');
        console.log(userName.split(' ').join('.').toLowerCase());
        userName = userName.split(' ').join('.').toLowerCase();
        StarmeUpAddonChromeContent.findUserSMU(userName, element);
        break;
      }
    }
    // StarmeUpAddonChromeContent.renderElements(elements_found);
  }else{
    console.warn('Cant find elements to render');
  }


};

chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
  console.log('onMessage');
  console.log('message: ', message);

  switch(message.type){
    case 'profile':
      // console.log('message.profile');
      var profile_str = JSON.stringify(message.profile);
      localStorage.setItem('profile_loaded', true);
      localStorage.setItem('profileLS', profile_str);UserLogged
      StarmeUpAddonChromeContent.render();
    break;

    case 'load':
      // console.log('message.page_loaded');
      // console.log("localStorage['profileLS']: ", localStorage['profileLS']);
      // if ('profileLS' in localStorage) {
      //   StarmeUpAddonChromeContent.render();
      // }
      if ('InfoUserSMULogged' in localStorage && 'AppIntegrationEnabled' in localStorage) {
        StarmeUpAddonChromeContent.renderInfoLoggedUser();
        // StarmeUpAddonChromeContent.lookUpRenderElements(['#pagelet_welcome_box', '#pagelet_pymk_timeline', '#pagelet_escape_hatch']);
      }
      if ('AppIntegrationEnabled' in localStorage) {
        StarmeUpAddonChromeContent.lookUpRenderElements(['#pagelet_navigation', '#pagelet_pymk_timeline', '#pagelet_escape_hatch']);
      }
    break;

    case 'remove':
      // console.log('message.remove');
      StarmeUpAddonChromeContent.remove();
    break;

    // from authenticateUserSMU
    case 'userLogged':
      // console.log(message.profileUserSMULogged);
      // console.log(message.token);
      localStorage.setItem('UserSMUIsLogged', 'true');
      localStorage.setItem('TokenUserSMULogged', message.token);
      localStorage.setItem('InfoUserSMULogged', JSON.stringify(message.infoUserSMULogged));
      // StarmeUpAddonChromeContent.renderElements([
      //   {'element':'#pagelet_welcome_box', 'type':'profileUser'},
      //   {'element': '#fbProfileCover', 'type':'profileUserFB'},
      //   {'element': '#pagelet_escape_hatch', 'type':'profileUserFB'}
      // ]);
      // StarmeUpAddonChromeContent.lookUpRenderElements(['#pagelet_navigation']);
    break;

    case 'appIntegrationEnabled':
      localStorage.setItem('TokenUserSMULogged', message.token);
      localStorage.setItem('ProfileUserSMULogged', JSON.stringify(message.profileUserSMULogged));
      localStorage.setItem('AppIntegrationEnabled', 'true');
      StarmeUpAddonChromeContent.lookUpRenderElements(['#pagelet_navigation']);

    break;

    case 'appIntegrationDisabled':
      console.info('appIntegrationDisabled');
      StarmeUpAddonChromeContent.disableIntegration();
    break;

  }

});


/*

StarmeUpAddonChromeContent.enabledLogger = true;

StarmeUpAddonChromeContent.getLogger = function(name){
  if (StarmeUpAddonChromeContent.enabledLogger) {
    return {
          debug: console.log.bind(console, '[' + name + ']: '),
          log: console.log.bind(console, '[' + name + ']: '),
          info: console.info.bind(console, '[' + name + ']: '),
          warn: console.warn.bind(console, '[' + name + ']: '),
          error: console.error.bind(console, '[' + name + ']: ') };
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

StarmeUpAddonChromeContent.renderElements = function(elements){
  console.log(localStorage['ProfileUserSMULogged']);
  return;
  var profileUserLogged = JSON.parse(localStorage['ProfileUserSMULogged']);
  var profile = profileUserLogged;

  console.log(elements);
  var numElements = elements.length;
  for (var i = 0; i < numElements; i++) {
    // $(elements[i]).hide();
    // console.log(elements[i]);
    switch(elements[i]){
      case '#pagelet_navigation':
      if ($('#StarmeUpAddonChromeContent').length === 0) {
        $('#pagelet_navigation').after('<div id="StarmeUpAddonChromeContent"></div>');
        $('#StarmeUpAddonChromeContent').hide().append('<div id="smuAddonFBHeader"><img src="https://qa.starmeup.com/assets/img/favicon.ico" width="16" height="16" /> <strong>Starmeup Profile</strong></div><div id="smuAddonFBBody"><i class="fa fa-institution" aria-hidden="true"></i> <strong>ORGANIZATION</strong><br><span>'+profileUserLogged.organizationName+'</span><br><i class="fa fa-user" aria-hidden="true"></i> <strong>POSITION</strong><br><span>'+profileUserLogged.job+'</span><br><i class="fa fa-map-marker" aria-hidden="true"></i> <strong>LOCATION</strong><br><span>'+profileUserLogged.office.name+'</span><br><i class="fa fa-briefcase" aria-hidden="true"></i> <strong>AREA</strong><br><span>'+profileUserLogged.area+'</span><br><i class="fa fa-suitcase" aria-hidden="true"></i> <strong>PROJECT</strong><br><span>'+profileUserLogged.project+'</span><br><i class="fa fa-folder-open" aria-hidden="true"></i>  <strong>ACCOUNT</strong><br><span>'+profileUserLogged.account+'</span><br></div>');
        $('#StarmeUpAddonChromeContent').slideDown();
      }
      break;

      case '#fbProfileCover':
      $('#fbProfileCover').after('<div id="StarmeUpAddonChromeContent"></div>');
      $('#StarmeUpAddonChromeContent').hide().append('<div id="smuAddonFBHeader"><img src="https://qa.starmeup.com/assets/img/favicon.ico" width="16" height="16" /> <strong>Starmeup Profile</strong></div><div id="smuAddonFBBody"><i class="fa fa-institution" aria-hidden="true"></i> <strong>ORGANIZATION</strong><br><span>'+profile.organizationName+'</span><br><i class="fa fa-user" aria-hidden="true"></i> <strong>POSITION</strong><br><span>'+profile.job+'</span><br><i class="fa fa-map-marker" aria-hidden="true"></i> <strong>LOCATION</strong><br><span>'+profile.office.name+'</span><br><i class="fa fa-briefcase" aria-hidden="true"></i> <strong>AREA</strong><br><span>'+profile.area+'</span><br><i class="fa fa-suitcase" aria-hidden="true"></i> <strong>PROJECT</strong><br><span>'+profile.project+'</span><br><i class="fa fa-folder-open" aria-hidden="true"></i>  <strong>ACCOUNT</strong><br><span>'+profile.account+'</span><br></div>');
      $('#StarmeUpAddonChromeContent').slideDown();
      break;
    }
  }



};


StarmeUpAddonChromeContent.render = function(){
  var logger = StarmeUpAddonChromeContent.getLogger('Rendering');
  var pagelet_welcome_box = $('#pagelet_welcome_box');
  var profile = JSON.parse(localStorage['profileLS']);
  profile.office.name += ' - Buenos Aires, ARG';

  if (profile.job === '') {
    profile.job = 'Web UI Developer';
  }
  if (profile.account === '') {
    profile.account = 'Johnson & Johnson';
  }
  if ($('#pagelet_welcome_box').length === 0) {
    logger.error('Can\'t find element container');
    return false;
  }else{
    // logger.log('pagelet_welcome_box: ', pagelet_welcome_box);
    if ($('#StarmeUpAddonChromeContent').length === 0) {
      $('#pagelet_welcome_box').after('<div id="StarmeUpAddonChromeContent"></div>');
      $('#StarmeUpAddonChromeContent').hide().append('<div id="smuAddonFBHeader"><img src="https://qa.starmeup.com/assets/img/favicon.ico" width="16" height="16" /> <strong>Starmeup Profile</strong></div><div id="smuAddonFBBody"><i class="fa fa-institution" aria-hidden="true"></i> <strong>ORGANIZATION</strong><br><span>'+profile.organizationName+'</span><br><i class="fa fa-user" aria-hidden="true"></i> <strong>POSITION</strong><br><span>'+profile.job+'</span><br><i class="fa fa-map-marker" aria-hidden="true"></i> <strong>LOCATION</strong><br><span>'+profile.office.name+'</span><br><i class="fa fa-briefcase" aria-hidden="true"></i> <strong>AREA</strong><br><span>'+profile.area+'</span><br><i class="fa fa-suitcase" aria-hidden="true"></i> <strong>PROJECT</strong><br><span>'+profile.project+'</span><br><i class="fa fa-folder-open" aria-hidden="true"></i>  <strong>ACCOUNT</strong><br><span>'+profile.account+'</span><br></div>');
      $('#StarmeUpAddonChromeContent').slideDown();
      logger.info('StarmeUpAddonChromeContent added :)');
    }else{
      logger.warn('StarmeUpAddonChromeContent already added :(|)');
    }
    return true;
  }

};

StarmeUpAddonChromeContent.remove = function () {
  var logger = StarmeUpAddonChromeContent.getLogger('Remove Profile');
  $('#StarmeUpAddonChromeContent').slideUp(function(){
    $('#StarmeUpAddonChromeContent').remove();
    localStorage.removeItem('profileLS');
    localStorage.removeItem('profile_loaded');
    logger.info('StarmeUpAddonChromeContent removed');
  });
};



*/
