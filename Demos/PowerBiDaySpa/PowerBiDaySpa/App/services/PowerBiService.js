var myApp;
(function (myApp) {
    var PowerBiService = /** @class */ (function () {
        function PowerBiService() {
        }
        PowerBiService.apiRoot = "https://api.powerbi.com/v1.0/myorg/";
        PowerBiService.appWorkspaceId = "7f4576c7-039a-472f-b998-546a572d5da2";
        PowerBiService.appWorkspaceApiRoot = PowerBiService.apiRoot + "groups/" + PowerBiService.appWorkspaceId + "/";
        PowerBiService.GetReports = function () {
            // build URL for reports
            var restUrl = PowerBiService.appWorkspaceApiRoot + "Reports/";
            // execute call against Power BI Service API
            return $.ajax({
                url: restUrl,
                headers: {
                    "Accept": "application/json;odata.metadata=minimal;",
                    "Authorization": "Bearer " + myApp.SpaAuthService.accessToken
                }
            });
        };
        PowerBiService.GetDashboards = function () {
            // build URL for dashboards
            var restUrl = PowerBiService.appWorkspaceApiRoot + "Dashboards/";
            // execute call against Power BI Service API
            return $.ajax({
                url: restUrl,
                headers: {
                    "Accept": "application/json;odata.metadata=minimal;",
                    "Authorization": "Bearer " + myApp.SpaAuthService.accessToken
                }
            });
        };
        PowerBiService.GetDatasets = function () {
            // build URL for datasets
            var restUrl = PowerBiService.appWorkspaceApiRoot + "Datasets/";
            // execute call against Power BI Service API
            return $.ajax({
                url: restUrl,
                headers: {
                    "Accept": "application/json;odata.metadata=minimal;",
                    "Authorization": "Bearer " + myApp.SpaAuthService.accessToken
                }
            });
        };
        return PowerBiService;
    }());
    myApp.PowerBiService = PowerBiService;
})(myApp || (myApp = {}));
//# sourceMappingURL=powerBiService.js.map