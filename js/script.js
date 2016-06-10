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

//app module
var app = angular.module('app', ['ngRoute']);

//creating a weatherService; returns data
app.factory('weatherService', function($http){
  var APPID = '0eec4393061dd3bf6597febdb72c50c4';
  return {
    getByCityID: function(List, callback){
      $http({
        url: 'http://api.openweathermap.org/data/2.5/group',
        params: {
          id: List,
          units: 'imperial',
          APPID: APPID
        }
      }).success(callback);
    } // end getByCityID method
  }; // end return
}); // end app.factory(weatherService)

//creating a googleMap service to display the map, and icons and infowindow
app.factory('googleMap', function(){
  //puts map up
  var centerLatLng = {lat: 39.099727, lng: -94.578567};
  var mapOptions = {
    center: centerLatLng,
    zoom: 4
  };
  var map = new google.maps.Map(document.getElementById('map'), mapOptions);

  return{
    plotData: plotData
  };
  function plotData(result){
    var infowindows = [];

    //add markers
    var markers = result.map(function(result) {
      //image icons base
      var iconBase = 'http://openweathermap.org/img/w/';
      //get coordinates
      var position = { lat: result.coord.lat, lng: result.coord.lon };

      var marker = new google.maps.Marker({
        position: position,
        title: result.name,
        animation: google.maps.Animation.DROP,
        anchorPoint: new google.maps.Point(0, -8),
        map: map,
        // icon: image
        icon: {
          url: iconBase + result.weather[0].icon + '.png',
          size: new google.maps.Size(50, 50),
          origin: new google.maps.Point(0, 0),
          anchor: new google.maps.Point(25, 25)
        }
      });

      //when you click on a city on the sidebar the infor window for the city will open on the map
      result.informarker = function(){
        hideAllInfoWindows();
        infowindow.open(map, marker);
      };


      console.log(result);

      //info window
      var infoContent =
      '<div class="infoContent">' +
        '<h2>' + result.name + '</h2>' +
        '<p>Current Temp: ' + result.main.temp + '°F</p>' +
        '<p>High: ' + result.main.temp_max + '°F</p>' +
        '<p>Low: ' + result.main.temp_min + '°F</p>' +
        '<p>Pressure:' + result.main.pressure + 'hPa</p>' +
        '<p>Humidity: ' + result.main.humidity + '%</p>' +
        '<p>Wind: ' + result.wind.deg + '°</p>' +
        '<p>Wind Gust: ' + result.wind.gust + '</p>' +
        '<p>Wind Speed: ' + result.wind.speed + ' mph</p>' +
        '<p> Ctiy ID ' + result.id + '</p>' +
        '<a href="#/' + result.id + '"> More Details  </a>' +
      '</div>';
      var infowindow = new google.maps.InfoWindow({
        content: infoContent
      });

      function hideAllInfoWindows(){
        infowindows.forEach(function(infowindow){
          infowindow.close();
        });
      }

      //event listener to handle clicking of a marker and infor window
      marker.addListener('click', function() {
        hideAllInfoWindows();
        infowindow.open(map, marker);
      });

      infowindows.push(infowindow);


      return marker;
    });
    console.log(markers);

  }
});


app.controller('MapController', function($scope, weatherService, googleMap) {
  $scope.List = cityIds.join(',');

  //returns data from the weather api call
  weatherService.getByCityID($scope.List, function(data){
    $scope.data = data;
    $scope.result = data.list;
    console.log(data);

    //call to the googleMap factory method - plotData to show the google maps and plot the img and infowindows
    googleMap.plotData(data.list);
  });


}); // end app.controller




 // getFiveDayForcast: function(cityId){
 //   $http({
 //     url: 'api.openweathermap.org/data/2.5/forecast',
 //     params: {
 //       id: cityId
 //     }
 //   }).success(callback);
 // } //end getFiveDayForcast method
 //
 // /*  DetailsController
 //     Shows 5 Day Forcast for a particular city
 // */
 app.config(function($routeProvider){
   $routeProvider
     .when('/', {
       controller: 'MapController',
       templateUrl: 'overview.html'
     })
     .when('/:cityId', {
       controller: "ForcastController",
       templateUrl: 'fiveDayForcast.html'
     });
 });
app.controller("ForcastController", function($scope, $routeParams, $http){
  var APPID = '0eec4393061dd3bf6597febdb72c50c4';
  // a request to the 5dayforcast api
  $http({
    url: 'http://api.openweathermap.org/data/2.5/forecast',
    params: {
      id: $routeParams.cityId,
      APPID: APPID
    }
  })
    .success(function(details){
      $scope.details = details.list;
      console.log("city id " , $scope.details);
    });
  });
