//list of cities
var cityIds = [
  4180439,
  5128638,
  4560349,
  4726206,
  4671654,
  5809844,
  5368361,
  5391811,
  5308655,
  4684888,
  4887398,
  5391959,
  5392171,
  4164138,
  4273837,
  5746545,
  4699066,
  5419384,
  4990729
];

var cityList = cityIds.join(',');

//icon base url + results.weather[0].icon
var iconBase = 'http://openweathermap.org/img/w/';

//app module
var app = angular.module('app', []);

//creating a weather service
app.factory('weather', function($http){
  var APPID = 'eac2948bfca65b78a8c5564ecf91d00e';
  return {
    getByCityName: function(List, callback){
      $http({
        url: 'http://api.openweathermap.org/data/2.5/group',
        params: {
          id: List,
          units: 'imperial',
          APPID: APPID
        }
      }).success(callback);
    }
  };
});

//app controller
app.controller('MapController', function($scope, weather) {
  $scope.List = cityList;//4180439;
  $scope.showWeather = function(){
    weather.getByCityName($scope.List, function(data){
      $scope.data = data;
      //console.log(data);
      console.log(data.list);
      $scope.result = data.list;

    });
  };
});
