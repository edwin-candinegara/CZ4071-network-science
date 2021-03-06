function GraphDataFactory($rootScope, $http, Upload, URL, EVENTS) {
    var factory = {};

    let graphData = {
        guiNetworkFormat: "",
        analyzedNetworkProperties: "",
        theoreticalScaleFreeNetworkProperties: "",
        theoreticalRandomNetworkProperties: ""
    };

    function _updateGraphData(newGraphData) {
        graphData = newGraphData;
        $rootScope.$broadcast(EVENTS.NEW_GRAPH_DATA);
    }

    factory.getGraphData = function() {
        return graphData;
    };

    factory.getGraphGuiFormat = function() {
        return graphData.guiNetworkFormat;
    };

    factory.getRealNetworkProperties = function() {
        return graphData.analyzedNetworkProperties;
    };

    factory.getScaleFreeNetworkProperties = function() {
        return graphData.theoreticalScaleFreeNetworkProperties;
    };

    factory.getRandomNetworkProperties = function() {
        return graphData.theoreticalRandomNetworkProperties;
    };

    factory.haveImage = function() {
        return !graphData.isTooBig;
    };

    factory.computeGraphProperties = function(file) {
        return Upload.upload({
            url: URL.NETWORK_UPLOAD_URL,
            data: { file: file },
            method: 'POST'
        }).then(function(response) {
            _updateGraphData(response.data);
        }, function(response) {
            if (response.status > 0) {
                console.error(response.status + ': ' + response.data);
            }
        });
    };

    factory.getExampleGraphData = function() {
        return $http({
            method: 'GET',
            url: URL.GET_EXAMPLE_NETWORK_URL
        }).then(function success(response) {
            _updateGraphData(response.data);
        }, function failure(response) {
            if (response.status > 0) {
                console.error(response.status + ': ' + response.data);
            }
        });
    };

    factory.getImageData = function(fileName) {
        return $http({
            method: 'GET',
            url: URL.GET_IMAGE_URL + fileName
        }).then(function success(response) {
            console.log("Image downloaded!");
        }, function failure(response) {
            if (response.status > 0) {
                console.error(response.status + ': ' + response.data);
            }
        });
    };

    factory.getRandomGraphData = function(jsonData) {
        return $http({
            data: JSON.stringify(jsonData),
            method: 'POST',
            url: URL.RANDOM_NETWORK_URL,
            headers: { 'Content-Type': 'application/json;charset=utf-8' }
        }).then(function success(response) {
            _updateGraphData(response.data);
        }, function failure(response) {
            if (response.status > 0) {
                console.error(response.status + ':' + response.data);
            }
        });
    };

    return factory;
}

export default ['$rootScope', '$http', 'Upload', 'URL', 'EVENTS', GraphDataFactory];