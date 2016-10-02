/*content.js*/
console.log('CONTENT.JS');
var StarmeUpAddonChromeContent = StarmeUpAddonChromeContent || {};
StarmeUpAddonChromeContent.SMUEnableLogger = true;

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

StarmeUpAddonChromeContent.lookUpRenderElements = function(elements){
  var logger = new StarmeUpAddonChromeContent.SMULogger('LookUp Render Elements');

  var elements_str = elements.splice(',').join(', ');
  var elements_found = $('body').find($(elements_str));

  if (elements_found.length > 0) {
    for (var i = 0; i < elements_found.length; i++) {
      logger.warn('Elements found: ', elements_found[i].id);
      switch(elements_found[i].id){

        // For User Logged
        case 'pagelet_navigation':
        StarmeUpAddonChromeContent.renderInfoLoggedUser();

        break;

        // For Facebook User
        case 'timeline_top_section':
        var element = '#timeline_top_section';
        var userName = $('#pageTitle').text();
        StarmeUpAddonChromeContent.findUserSMU(userName);
        break;

      }
    }
  }else{
    logger.warn('No elements to render');
  }
};

StarmeUpAddonChromeContent.findUserSMU = function(userName){
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
        localStorage.setItem('ProfileUsersSMU', JSON.stringify(data.result));

        for (var i = 0; i < data.result.length; i++) {
          var identification = data.result[i].identification.substr(0, userName.length);
          if (userName === identification) {
            StarmeUpAddonChromeContent.renderProfile(data.result[i]);
          }else{
            logger.warn('The SMU user "' + data.result[i].firstName + ' ' + data.result[i].lastName + '" doesn\'t match with the Facebook user "' + userName + '"');
          }
        }
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
    $('#StarmeUpAddonChromeContent').hide().append('<div id="smuAddonFBHeader"><i class="fa fa-star fa-star-smu" aria-hidden="true"></i><strong>StarmeUp</strong></div><div id="smuAddonFBBody"><div id="infoUserSMULogged"><div class="stars"><span><i class="fa fa-star" aria-hidden="true"></i>'+infoUserSMULogged.starsReceived+'</span><strong>STARS</strong></div><div class="badges"><span><i class="fa fa-certificate" aria-hidden="true"></i>'+infoUserSMULogged.badges+'</span><strong>BADGES</strong></div><div class="remaining"><span><i class="fa fa-star-half-o" aria-hidden="true"></i>'+infoUserSMULogged.starsRemaining+'</span><strong>REMAINING</strong></div></div></div>');
    $('#StarmeUpAddonChromeContent').slideDown();
    logger.info('The infoUserSMULogged has added succesfully before #pagelet_navigation :)');
  }else{
    logger.warn('The infoUserSMULogged has been added');
  }
};

StarmeUpAddonChromeContent.renderProfile = function(profile){
  var logger = new StarmeUpAddonChromeContent.SMULogger('Render Profile');

  logger.log('Profile to render : ', profile);

  if ($('#StarmeUpAddonChromeContent').length === 0) {
    $('#timeline_top_section').after('<div id="StarmeUpAddonChromeContent" class="profileUserSMU"></div>');
    $('#StarmeUpAddonChromeContent').hide().append('<div id="smuAddonFBHeader" class="clearfix"><i class="fa fa-star fa-star-smu" aria-hidden="true"></i><strong>Starmeup</strong></div><div id="smuAddonFBBody"><i class="fa fa-map-marker" aria-hidden="true"></i> <strong>LOCATION</strong><br><span>'+profile.organizationOfficeName+'</span><br><i class="fa fa-envelope" aria-hidden="true"></i> <strong>EMAIL</strong><br><span>'+profile.identification+'</span><br><i class="fa fa-briefcase" aria-hidden="true"></i> <strong>AREA</strong><br><span>'+profile.area+'</span><br><i class="fa fa-suitcase" aria-hidden="true"></i> <strong>PROJECT</strong><br><span>'+profile.project+'</span><br><i class="fa fa-folder-open" aria-hidden="true"></i>  <strong>ACCOUNT</strong><br><span>'+profile.account+'</span><br><p><a href="https://qa.starmeup.com/#profile/' + profile.uid + '" target="_blank">Give a Star</a></p></div>');
    $('#StarmeUpAddonChromeContent').slideDown();
    logger.info('The profile has added succesfully in #timeline_top_section :)');
  }else{
    logger.warn('The profile has been added');
  }
};

StarmeUpAddonChromeContent.removeProfile = function(){
  var logger = new StarmeUpAddonChromeContent.SMULogger('Remove Profile');
  $('#StarmeUpAddonChromeContent').slideUp(function(){
    $('#StarmeUpAddonChromeContent').remove();
    logger.warn('StarmeUpAddonChromeContent removed');
  });
};

StarmeUpAddonChromeContent.enableIntegration = function(message){
  var logger = new StarmeUpAddonChromeContent.SMULogger('Enable Integration');
  localStorage.setItem('TokenUserSMULogged', message.token);
  localStorage.setItem('ProfileUserSMULogged', message.profileUserSMULogged);
  localStorage.setItem('AppIntegrationEnabled', 'true');
  if ('AppIntegrationEnabled' in localStorage) {
    StarmeUpAddonChromeContent.lookUpRenderElements(['#pagelet_navigation', '#timeline_top_section']);
  }
};

StarmeUpAddonChromeContent.disableIntegration = function () {
  var logger = new StarmeUpAddonChromeContent.SMULogger('Disable Integration');
  localStorage.removeItem('AppIntegrationEnabled');
  logger.warn('App Integration has been disabled');
  StarmeUpAddonChromeContent.removeProfile();
};

StarmeUpAddonChromeContent.closeSession = function(){
  var logger = new StarmeUpAddonChromeContent.SMULogger('Disable Integration');

  localStorage.removeItem('AppIntegrationEnabled');
  localStorage.removeItem('InfoUserSMULogged');
  localStorage.removeItem('ProfileUserSMULogged');
  localStorage.removeItem('ProfileUsersSMU');
  localStorage.removeItem('TokenUserSMULogged');
  localStorage.removeItem('UserSMUIsLogged');

  StarmeUpAddonChromeContent.disableIntegration();
  logger.warn('Closed user session in content');
};

chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
  var logger = new StarmeUpAddonChromeContent.SMULogger('onMessage');
  logger.log('message: ', message);

  switch(message.type){
    case 'logIn':
      localStorage.setItem('UserSMUIsLogged', 'true');
      localStorage.setItem('TokenUserSMULogged', message.token);
      localStorage.setItem('InfoUserSMULogged', message.infoUserSMULogged);
    break;

    case 'appIntegrationEnabled':
      StarmeUpAddonChromeContent.enableIntegration(message);
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

    case 'logOut':
      StarmeUpAddonChromeContent.closeSession();
    break;
  }

});
