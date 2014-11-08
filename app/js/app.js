var app = angular.module('myApp', ['ngResource']);

app.controller('ContactsCtrl', ['$scope', '$resource', '$window', function($scope, $resource, $window) {

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

  // Google contacts api..


  /*
  //in this needed?!
  $scope.updateContactById = function(contactId) {
    var updateContactById = $resource('http://bjarnason.to:8080/api/contacts/:id', {id: contactId}, { 'update': { method:'PUT' }},  {});
    $scope.contact = updateContactById.get();

    $scope.updateContact = function() {
      updateContactById.update($scope.contact);
    };
  };
  */


  /**
   ng-click="getContactInfo($event, contact._id, contact.name, contact.email, contact.phone)"
  $scope.getContactInfo = function($event, contactId, contactName, contactEmail, contactPhone) {
    $window.alert("_id: " + contactId + '\n' + "name: " + contactName + '\n' + "email: " + contactEmail + '\n' + "phone: " + contactPhone);
  }
   **/





}]);