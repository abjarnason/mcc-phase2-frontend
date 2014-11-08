var app = angular.module('myApp', ['ngResource', 'jackrabbitsgroup.angular-google-auth']);

app.controller('ContactsCtrl', ['$scope', '$resource', '$window', 'jrgGoogleAuth', function($scope, $resource, $window, jrgGoogleAuth) {

  $scope.getAllContacts = function() {
    var getAllContacts = $resource('http://bjarnason.to:8080/api/contacts/',  {});
      $scope.contacts = getAllContacts.query();
  };

  $scope.addContact = function() {
    var addNewContact = $resource('http://bjarnason.to:8080/api/contacts/',  {});
    $scope.contact = addNewContact.save($scope.contact);
  };

  // :id needed

  $scope.getContactById = function(contactId) {
    //console.log(contactId);
    var getContactById = $resource('http://bjarnason.to:8080/api/contacts/:id', {id: contactId},  {});
    $scope.contact = getContactById.get();
  };

  $scope.deleteContactById = function(contactId) {
    //$window.alert(contactId);
    var deleteContactById = $resource('http://bjarnason.to:8080/api/contacts/:id', {id: contactId},  {});
    deleteContactById.delete();
  };

  // Handle Google Contacts stuff..

  //initialize google auth with client id
  // jrgGoogleAuth.init({'client_id':googleClientId, 'scope':'https://www.googleapis.com/auth/plus.login https://www.googleapis.com/auth/userinfo.email'});
  jrgGoogleAuth.init({'client_id':'312681962978-rltlvrq4o92aha7hujml466no12fmsed.apps.googleusercontent.com', 'scopeHelp':['login', 'email', 'contacts']});

  //do actual login
  var evtGoogleLogin ="evtGoogleLogin";
  $scope.googleLogin =function() {
    jrgGoogleAuth.login({'extraInfo':{'user_id':true, 'emails':true}, 'callback':{'evtName':evtGoogleLogin, 'args':[]} });
  };

  $scope.googleInfo;

  // @param {Object} googleInfo
  // @param {Object} token Fields directly returned from google, with the most important being access_token (but there are others not documented here - see google's documentation for full list)
  // @param {String} access_token
  // @param {Object} [extraInfo]
  // @param {String} [user_id]
  // @param {Array} [emails] Object for each email
  // @param {String} value The email address itself
  // @param {String?} type ?
  // @param {Boolean} primary True if this is the user's primary email address
  // @param {String} [emailPrimary] User's primary email address (convenience field extracted from emails array, if exists)
  $scope.$on(evtGoogleLogin, function(evt, googleInfo) {
    $scope.googleInfo =googleInfo;
  });

  $scope.googleContacts =[];

  $scope.getContacts =function(opts) {
    var promise1 =jrgGoogleAuth.getContacts();
    /*
     @param {Object} data
     @param {Array} contacts
     @param {String} name
     @param {String} email
     @param {String} phone
     */
    promise1.then(function(data) {
      //for now, strip out contacts who don't have an email address (since currently aren't allowing users without an email address to be created / followed)
      var ii;
      var finalContacts =[];
      for(ii =0; ii<data.contacts.length; ii++) {
        if(data.contacts[ii].email !==undefined && data.contacts[ii].email) {
          finalContacts.push(data.contacts[ii]);
        }
      }
      // finalContacts =jrgArray.sort2D(finalContacts, 'name', {});		//sort by name
      $scope.googleContacts = finalContacts;
    }, function(data) {
      $scope.$emit('evtAppalertAlert', {type:'error', msg:'Error getting Google Contacts'});
    });
  };

}]);