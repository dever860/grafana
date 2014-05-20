define([
  'angular',
  'underscore'
],
function (angular, _) {
  'use strict';

  var module = angular.module('kibana.controllers');
  var getParameterByName = function(name) {
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
        results = regex.exec(location.search);
    return results == null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
  };

  module.controller('InfluxLoginCtrl', function($scope, datasourceSrv) {
    if (!window.influxLoggedIn) {
      $(".influxdb-login").show();      
    }
    var host = getParameterByName("influx_host");
    if (host != "") {
      $("#influxdb_host").val(host);
    }

    $scope.init = function() {
      $scope.datasources = datasourceSrv.listOptions();
    };

    $scope.login = function() {
      var password = $("#influxdb_password").val()
      var database = $("#influxdb_database").val()
      var username = $("#influxdb_user").val()
      var host =     $("#influxdb_host").val()
      var url = host
      if (host.indexOf("http") == 0) {
        url = url + "/db/" + database
      } else {
        url = "https://" + host + ".customers.influxdb.com:8087/db/" + database
      }
      var def = datasourceSrv.datasourceFactory({
        default: true,
        type: 'influxdb',
        url: url,
        urls: [url],
        username: username,
        password: password,
      });
      datasourceSrv.default = def;
      window.influxLoggedIn = true;
      return false
    };
  });
});