app.register.service('google-map',function(){
    var option = {
        id:'map-show',
        zoom:15,
        locationList:[],
        bounds:null,
        markers:[]
    };
    var self = this;
    var map = null;
    var setmarkers = function(locationList){
        for (var i in locationList) {
            var marker = new google.maps.Marker({
                position: locationList[i].position,
                map: map,
                icon:locationList[i].icon ? getImage(locationList[i].icon,locationList[i].iconWidth,locationList[i].iconHeight) : null
            });
            option.markers.push(marker);
        }
    };

    var setPostion = function(driverPosition,selfPosition){
        option.locationList = [];
        if(driverPosition) option.locationList.push(driverPosition);
        if(selfPosition) option.locationList.push(selfPosition);

    };

    var clean = function(){
        if(option.markers.length > 0){
            for (var i = 0; i < option.markers.length; i++) {
                option.markers[i].setMap(null);
            }
            option.markers = [];
        }
    };

    var setLocationList = function(locationList){
        var southWest = {lat:null,lng:null};
        var northEast = {lat:null,lng:null};
        for(var i in locationList){
            var lat = locationList[i].lat;
            var lng = locationList[i].lng;
            if(!northEast.lat && !southWest.lat){
                northEast.lat = southWest.lat = lat;
                northEast.lng = southWest.lng = lng;
            }else{
                lat > northEast.lat ? (northEast.lat = lat) : (lat < southWest.lat ? (southWest.lat = lat) : null);
                lng > northEast.lng ? (northEast.lng = lng) : (lng < southWest.lng ? (southWest.lng = lng) : null);
            }

            locationList[i].position = new google.maps.LatLng(locationList[i].lat,locationList[i].lng);
        }
        southWest = new google.maps.LatLng(southWest.lat, southWest.lng);
        northEast = new google.maps.LatLng(northEast.lat, northEast.lng);
        option.bounds = new google.maps.LatLngBounds(southWest, northEast);
    };

    var getImage = function(url,width,height){
        var image = {
            url: url,
            size: new google.maps.Size(width/2, height/2),
            scaledSize: new google.maps.Size(width/2, height/2)
        };

        return image;
    };

    this.getPostion = function(lat,lng){
        return new google.maps.LatLng(lat, lng);
    };

    this.updateMap = function(driverPosition,selfPosition){
        log("update google-map");

        clean();

        setPostion(driverPosition,selfPosition);

        setLocationList(option.locationList);

        if(option.locationList.length > 1){
            map.fitBounds(option.bounds);
        }else if(option.locationList.length == 1){
            map.setCenter(option.locationList[0].position);
        }

        setmarkers(option.locationList);

        if(map.zoom > 18) map.setZoom(18);
    };

    this.getDistance = function(startPosition,endPosition,callBack){
        var service = new google.maps.DistanceMatrixService();
        service.getDistanceMatrix({
            origins: [startPosition],
            destinations: [endPosition],
            travelMode: google.maps.TravelMode.DRIVING
        },function(response, status){
            var code = 0;
            var distance = 0;
            var duration = 0;
            if (status == google.maps.DistanceMatrixStatus.OK) {
                var results = response.rows[0].elements[0];
                if(results.status == "OK"){
                    code = 1;
                    distance = results.distance;
                    duration = results.duration;
                }
            }
            callBack(code,distance,duration);
        });

        return this;
    };

    this.setDistance = function(startPosition,endPosition,callBack){
        var directionsService = new google.maps.DirectionsService();
        var directionsDisplay = new google.maps.DirectionsRenderer();
        var request = {
            origin: startPosition,
            destination: endPosition,
            travelMode: google.maps.TravelMode.DRIVING
        };
        directionsDisplay.setMap(map);
        directionsService.route(request, function(response, status) {
            var code = 0;
            if (status == google.maps.DirectionsStatus.OK) {
                directionsDisplay.setDirections(response);
            }
            callBack(code);
        });
    };

    this.init = function(driverPosition,selfPosition,options){
        log("init google-map");
        if(options) self.option = app.extend(option,options);

        map = new google.maps.Map(document.getElementById(option.id),{zoom: option.zoom,center:new google.maps.LatLng(0, 0)});

        self.updateMap(driverPosition,selfPosition);
    };
    this.path = 'https://maps.googleapis.com/maps/api/js?v=3.exp&signed_in=true&callback=app.loadMap';
});
