var app = angular.module('myApp', ['ngResource', 'jackrabbitsgroup.angular-google-auth']);

app.controller('ContactsCtrl', ['$scope', '$resource', 'jrgGoogleAuth', function($scope, $resource, jrgGoogleAuth) {


  // GET (all) and POST. Id is not needed

  $scope.getAllContacts = function() {
    var getAllContacts = $resource('http://bjarnason.to:8080/api/contacts/',  {});
      $scope.contacts = getAllContacts.query();
  };

  $scope.addContact = function() {
    var addNewContact = $resource('http://bjarnason.to:8080/api/contacts/',  {});
    $scope.contact = addNewContact.save($scope.contact);
  };

  // GET (by id) and DELETE. Id is needed

  $scope.getContactById = function(contactId) {
    var getContactById = $resource('http://bjarnason.to:8080/api/contacts/:id', {id: contactId},  {});
    // shows information in the form input boxes because of two way binding.
    $scope.contact = getContactById.get();
  };

  $scope.deleteContactById = function(contactId) {
    var deleteContactById = $resource('http://bjarnason.to:8080/api/contacts/:id', {id: contactId},  {});
    deleteContactById.delete();
  };


  // Handle Google Contacts stuff..

  // Initialize the authorization
  jrgGoogleAuth.init({
    'client_id':'312681962978-rltlvrq4o92aha7hujml466no12fmsed.apps.googleusercontent.com',
    'scopeHelp':['login', 'email', 'contacts']
  });

  // Log into Google services and get contact info
  $scope.googleLogin = function() {
    jrgGoogleAuth.login({
      'extraInfo': {'user_id':true, 'emails':true},
      'callback': {
        'evtName':"evtGoogleLogin",
        'args': []
      }
    });
  };

  // Define onclick to get Contact Info into the view of the application
  $scope.getContacts =function(opts) {
    var promise = jrgGoogleAuth.getContacts();
    promise.then(function(data) {
      $scope.googleContacts = data.contacts;
    }, function(data) {
      $scope.$emit(
          'evtAppalertAlert',
          {type:'error', msg:'Error getting Google Contacts'}
      );
    });
  };

}]);