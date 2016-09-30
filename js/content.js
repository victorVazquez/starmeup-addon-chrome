/*content.js*/
console.log('CONTENT.JS');
var StarmeUpAddonChromeContent = StarmeUpAddonChromeContent || {};
StarmeUpAddonChromeContent.SMUEnableLogger = false;

StarmeUpAddonChromeContent.SMULogger = function(name) {
  if (StarmeUpAddonChromeContent.SMUEnableLogger === true) {
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


StarmeUpAddonChromeContent.findUserSMU = function(userName, element){
  var logger = new StarmeUpAddonChromeContent.SMULogger('Find User SMU');

  var locateUserSMU = new XMLHttpRequest();
  var url = 'https://qa.starmeup.com/starmeup-api/v2/smart/locateusers?searchString=' + userName;
  var token = localStorage.getItem('TokenUserSMULogged');

  // Criteria for filter search SMU userName
  userName = userName.toLowerCase();
  userName = userName.replace(/[ÁáÀàÂâǍǎĂăÃãẢảẠạÄäÅåĀāĄąẤấẦầẪẫẨẩẬậẮắẰằẴẵẲẳẶặǺǻ]/g, 'a');
  userName = userName.replace(/[ÉéÈèÊêĚěĔĕẼẽẺẻĖėËëĒēĘęẾếỀềỄễỂểẸẹỆệ]/g, 'e');
  userName = userName.replace(/[ÍíÌìĬĭÎîǏǐÏïĨĩĮįĪīỈỉỊị]/g, 'i');
  userName = userName.replace(/[ÓóÒòŎŏÔôỐốỒồỖỗỔổǑǒÖöŐőÕõØøǾǿŌōỎỏƠơỚớỜờỠỡỞởỢợỌọỘộ]/g, 'o');
  userName = userName.replace(/[ÚúÙùŬŭÛûǓǔŮůÜüǗǘǛǜǙǚǕǖŰűŨũŲųŪūỦủƯưỨứỪừỮữỬửỰựỤụ]/g, 'u');
  userName = userName.split(' ').join('.'); //
  logger.log('url: ', url);
  logger.log('userName: ', userName);

  locateUserSMU.open('GET', url, true);
  locateUserSMU.setRequestHeader('TOKEN', token);
  locateUserSMU.onreadystatechange = function(){
    if (locateUserSMU.readyState == 4) {
      var data = JSON.parse(locateUserSMU.responseText);
      if (data.result.length > 0) {
        // logger.log('dataUserFB: ', data);
        localStorage.setItem('ProfileUsersSMU', JSON.stringify(data.result));

        for (var i = 0; i < data.result.length; i++) {
          var identification = data.result[i].identification.substr(0, userName.length);
          // logger.log("userName === data.result[i].firstName + ' ' + data.result[i].lastName");
          // logger.log(userName === data.result[i].firstName + ' ' + data.result[i].lastName);
          // logger.log(userName.length);
          // logger.log('identification: ', identification);
          // if (userName === data.result[i].firstName + ' ' + data.result[i].lastName) {
          if (userName === identification) {
            // logger.log(data.result[i].firstName + ' ' + data.result[i].lastName);
            StarmeUpAddonChromeContent.renderProfile(data.result[i], element);
          }else{
            // logger.log(i);
            // logger.log(data.result.length);
            // logger.log(i >= (data.result.length -1) );
            logger.warn('The SMU user "' + data.result[i].firstName + ' ' + data.result[i].lastName + '" doesn\'t match with the Facebook user "' + userName + '"');
            // if (i >= (data.result.length -1) ) {
            //   logger.log('**************************************');
            //   logger.warn('No SMU users match the Facebook user "' + userName + '"');
            // }
          }
        }
        // logger.log();
      }else{
        logger.warn('No SMU users that match the Facebook user');
      }
    }
  };
  locateUserSMU.send();
};

StarmeUpAddonChromeContent.renderInfoLoggedUser = function(){
  var logger = new StarmeUpAddonChromeContent.SMULogger('Render Info Logged User');

  var infoUserSMULogged = JSON.parse(localStorage['InfoUserSMULogged']);
  if ($('#StarmeUpAddonChromeContent').length === 0) {
    $('#pagelet_navigation').before('<div id="StarmeUpAddonChromeContent"></div>');
    $('#StarmeUpAddonChromeContent').hide().append('<div id="smuAddonFBHeader"><i class="fa fa-star fa-star-smu" aria-hidden="true"></i><strong>StarmeUp</strong></div><div id="smuAddonFBBody"><div id="infoUserSMULogged" class="horizontal"><div class="stars"><span><i class="fa fa-star" aria-hidden="true"></i>'+infoUserSMULogged.starsReceived+'</span><strong>STARS</strong></div><div class="badges"><span><i class="fa fa-certificate" aria-hidden="true"></i>'+infoUserSMULogged.badges+'</span><strong>BADGES</strong></div><div class="remaining"><span><i class="fa fa-star-half-o" aria-hidden="true"></i>'+infoUserSMULogged.starsRemaining+'</span><strong>REMAINING</strong></div></div></div>');
    // $('#StarmeUpAddonChromeContent').hide().append('<div id="smuAddonFBHeader"><img src="https://qa.starmeup.com/assets/img/favicon.ico" width="16" height="16" /> <strong>StarmeUp</strong></div><div id="smuAddonFBBody"><div id="infoUserSMULogged"><div class="stars"><span><i class="fa fa-star" aria-hidden="true"></i>'+infoUserSMULogged.starsReceived+'</span><strong>STARS</strong></div><div class="badges"><span><i class="fa fa-certificate" aria-hidden="true"></i>'+infoUserSMULogged.badges+'</span><strong>BADGES</strong></div><div class="remaining"><span><i class="fa fa-star-half-o" aria-hidden="true"></i>'+infoUserSMULogged.starsRemaining+'</span><strong>REMAINING</strong></div></div></div>');
    $('#StarmeUpAddonChromeContent').slideDown();
    logger.info('The infoUserSMULogged has added succesfully before #pagelet_navigation :)');
  }else{
    logger.warn('The infoUserSMULogged has been added');
  }
};

StarmeUpAddonChromeContent.renderProfile = function(profile, element){
  var logger = new StarmeUpAddonChromeContent.SMULogger('Render Profile');

  logger.log('Profile to render : ', profile);
  logger.log('Element to render profile: ', element);

  switch(element){
    // Info User FB Logged in SMU
    case '#pagelet_navigation':
      var profileUserLogged = JSON.parse(localStorage['ProfileUserSMULogged']);

      if ($('#StarmeUpAddonChromeContent').length === 0) {
        $('#pagelet_navigation').before('<div id="StarmeUpAddonChromeContent"></div>');
        $('#StarmeUpAddonChromeContent').hide().append('<div id="smuAddonFBHeader"><i class="fa fa-star fa-star-smu" aria-hidden="true"></i><strong>Starmeup Profile</strong></div><div id="smuAddonFBBody"><i class="fa fa-institution" aria-hidden="true"></i> <strong>ORGANIZATION</strong><br><span>'+profileUserLogged.organizationName+'</span><br><i class="fa fa-user" aria-hidden="true"></i> <strong>POSITION</strong><br><span>'+profileUserLogged.job+'</span><br><i class="fa fa-map-marker" aria-hidden="true"></i> <strong>LOCATION</strong><br><span>'+profileUserLogged.office.name+'</span><br><i class="fa fa-briefcase" aria-hidden="true"></i> <strong>AREA</strong><br><span>'+profileUserLogged.area+'</span><br><i class="fa fa-suitcase" aria-hidden="true"></i> <strong>PROJECT</strong><br><span>'+profileUserLogged.project+'</span><br><i class="fa fa-folder-open" aria-hidden="true"></i>  <strong>ACCOUNT</strong><br><span>'+profileUserLogged.account+'</span><br></div>');
        // $('#StarmeUpAddonChromeContent').hide().append('<div id="smuAddonFBHeader"><img src="https://qa.starmeup.com/assets/img/favicon.ico" width="16" height="16" /> <strong>Starmeup Profile</strong></div><div id="smuAddonFBBody"><i class="fa fa-institution" aria-hidden="true"></i> <strong>ORGANIZATION</strong><br><span>'+profileUserLogged.organizationName+'</span><br><i class="fa fa-user" aria-hidden="true"></i> <strong>POSITION</strong><br><span>'+profileUserLogged.job+'</span><br><i class="fa fa-map-marker" aria-hidden="true"></i> <strong>LOCATION</strong><br><span>'+profileUserLogged.office.name+'</span><br><i class="fa fa-briefcase" aria-hidden="true"></i> <strong>AREA</strong><br><span>'+profileUserLogged.area+'</span><br><i class="fa fa-suitcase" aria-hidden="true"></i> <strong>PROJECT</strong><br><span>'+profileUserLogged.project+'</span><br><i class="fa fa-folder-open" aria-hidden="true"></i>  <strong>ACCOUNT</strong><br><span>'+profileUserLogged.account+'</span><br></div>');
        $('#StarmeUpAddonChromeContent').slideDown();
        logger.info('The profile has added succesfully before #pagelet_navigation :)');
      }else{
        logger.warn('The profile has been added');
      }
    break;

    // Profile SMU User FB
    case '#timeline_top_section':
      if ($('#StarmeUpAddonChromeContent').length === 0) {
        $('#timeline_top_section').after('<div id="StarmeUpAddonChromeContent" class="profileUserSMU"></div>');
        $('#StarmeUpAddonChromeContent').hide().append('<div id="smuAddonFBHeader" class="clearfix"><i class="fa fa-star fa-star-smu" aria-hidden="true"></i><strong>Starmeup</strong></div><div id="smuAddonFBBody"><i class="fa fa-map-marker" aria-hidden="true"></i> <strong>LOCATION</strong><br><span>'+profile.organizationOfficeName+'</span><br><i class="fa fa-envelope" aria-hidden="true"></i> <strong>EMAIL</strong><br><span>'+profile.identification+'</span><br><i class="fa fa-briefcase" aria-hidden="true"></i> <strong>AREA</strong><br><span>'+profile.area+'</span><br><i class="fa fa-suitcase" aria-hidden="true"></i> <strong>PROJECT</strong><br><span>'+profile.project+'</span><br><i class="fa fa-folder-open" aria-hidden="true"></i>  <strong>ACCOUNT</strong><br><span>'+profile.account+'</span><br><p><a href="https://qa.starmeup.com" target="_blank">Give a Star</a></p></div>');
        // $('#StarmeUpAddonChromeContent').hide().append('<div id="smuAddonFBHeader" class="clearfix"><img src="https://qa.starmeup.com/assets/img/favicon.ico" width="16" height="16" /> <strong>Starmeup</strong></div><div id="smuAddonFBBody"><i class="fa fa-map-marker" aria-hidden="true"></i> <strong>LOCATION</strong><br><span>'+profile.organizationOfficeName+'</span><br><i class="fa fa-envelope" aria-hidden="true"></i> <strong>EMAIL</strong><br><span>'+profile.identification+'</span><br><i class="fa fa-briefcase" aria-hidden="true"></i> <strong>AREA</strong><br><span>'+profile.area+'</span><br><i class="fa fa-suitcase" aria-hidden="true"></i> <strong>PROJECT</strong><br><span>'+profile.project+'</span><br><i class="fa fa-folder-open" aria-hidden="true"></i>  <strong>ACCOUNT</strong><br><span>'+profile.account+'</span><br><p><a href="https://qa.starmeup.com" target="_blank">Give a Star</a></p></div>');
        $('#StarmeUpAddonChromeContent').slideDown();
        logger.info('The profile has added succesfully in #timeline_top_section :)');
      }else{
        logger.warn('The profile has been added');
      }
    break;
  }
};

StarmeUpAddonChromeContent.removeProfile = function(){
  var logger = new StarmeUpAddonChromeContent.SMULogger('Remove Profile');
  $('#StarmeUpAddonChromeContent').slideUp(function(){
    $('#StarmeUpAddonChromeContent').remove();
    logger.warn('StarmeUpAddonChromeContent removed');
  });
};

StarmeUpAddonChromeContent.disableIntegration = function () {
  var logger = new StarmeUpAddonChromeContent.SMULogger('Disable Integration');
  localStorage.removeItem('AppIntegrationEnabled');
  logger.warn('App Integration has been disabled');
  StarmeUpAddonChromeContent.removeProfile();
};

StarmeUpAddonChromeContent.lookUpRenderElements = function(elements){
  var logger = new StarmeUpAddonChromeContent.SMULogger('LookUp Render Elements');
  var numElements = elements.length;

  var elements_str = elements.splice(',').join(', ');
  var elements_found = $('body').find($(elements_str));
  var elements_arr = elements_str.split(', ');

  // logger.info('elements_found: ', elements_found);
  // logger.log('Elements Arr: ', elements_arr);
  // logger.log('Elements found: ', elements_found);
  // logger.log('typeof elements_found: ', typeof elements_found);
  // logger.log('elements_found.length: ', elements_found.length);

  if (elements_found.length > 0) {
    // var numElements = elements_found.length;
    // logger.log('***********************');
    // logger.log('elements.length: ', elements.length);
    for (var i = 0; i < elements_found.length; i++) {
      logger.warn(elements_found[i].id);
      // $(elements[i]).hide();
      switch(elements_found[i].id){

        // For User Logged
        case 'pagelet_navigation':
        // var profile = JSON.stringify(localStorage['ProfileUserSMULogged']);
        // var element = '#pagelet_navigation';
        // Show Stars of current user
        // StarmeUpAddonChromeContent.renderProfile(profile, element);
        // StarmeUpAddonChromeContent.getInfoLoggedUser();
        StarmeUpAddonChromeContent.renderInfoLoggedUser();

        break;

        // For Facebook User
        case 'timeline_top_section':
        var element = '#timeline_top_section';
        var userName = $('#pageTitle').text();
        logger.info('userName: ', userName);
        // logger.log(' ');
        // logger.log(userName.split(' ').join('.'));
        // logger.log('url: ', window.location.href);
        // alert('hi' + userName);
        // logger.log('userName: ', userName);
        // return;
        StarmeUpAddonChromeContent.findUserSMU(userName, element);
        break;

      }
    }
    // StarmeUpAddonChromeContent.renderElements(elements_found);
  }else{
    logger.warn('No elements to render');
  }


};

chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
  var logger = new StarmeUpAddonChromeContent.SMULogger('onMessage');
  logger.log('message: ', message);

  switch(message.type){
    // from authenticateUserSMU
    case 'userLogged':
      // logger.log(message.profileUserSMULogged);
      // logger.log(message.token);
      localStorage.setItem('UserSMUIsLogged', 'true');
      localStorage.setItem('TokenUserSMULogged', message.token);
      localStorage.setItem('InfoUserSMULogged', message.infoUserSMULogged);
    break;

    case 'appIntegrationEnabled':
      localStorage.setItem('TokenUserSMULogged', message.token);
      localStorage.setItem('ProfileUserSMULogged', message.profileUserSMULogged);
      localStorage.setItem('AppIntegrationEnabled', 'true');
      if ('AppIntegrationEnabled' in localStorage) {
        StarmeUpAddonChromeContent.lookUpRenderElements(['#pagelet_navigation', '#timeline_top_section']);
      }
    break;

    case 'appIntegrationDisabled':
      logger.info('appIntegrationDisabled');
      StarmeUpAddonChromeContent.disableIntegration();
    break;

    case 'load':
      if ('InfoUserSMULogged' in localStorage && 'AppIntegrationEnabled' in localStorage) {
        StarmeUpAddonChromeContent.renderInfoLoggedUser();
      }
      if ('AppIntegrationEnabled' in localStorage) {
        logger.log('AppIntegrationEnabled: ', localStorage['AppIntegrationEnabled']);
        StarmeUpAddonChromeContent.lookUpRenderElements(['#pagelet_navigation', '#timeline_top_section']);
      }
    break;
  }

});
