module myApp {


  export class PowerBiService {
    
    static apiRoot: string = "https://api.powerbi.com/v1.0/myorg/";
    static appWorkspaceId = "7f4576c7-039a-472f-b998-546a572d5da2";
    static appWorkspaceApiRoot = PowerBiService.apiRoot + "groups/" + PowerBiService.appWorkspaceId + "/"; 

    static GetReports = () => {
      // build URL for reports
      var restUrl = PowerBiService.appWorkspaceApiRoot + "Reports/";
      // execute call against Power BI Service API
      return $.ajax({
        url: restUrl,
        headers: {
          "Accept": "application/json;odata.metadata=minimal;",
          "Authorization": "Bearer " + SpaAuthService.accessToken
        }
      });
    }

    static GetDashboards = () => {
      // build URL for dashboards
      var restUrl = PowerBiService.appWorkspaceApiRoot + "Dashboards/";
      // execute call against Power BI Service API
      return $.ajax({
        url: restUrl,
        headers: {
          "Accept": "application/json;odata.metadata=minimal;",
          "Authorization": "Bearer " + SpaAuthService.accessToken
        }
      });
    }

    static GetDatasets = () => {
      // build URL for datasets
      var restUrl = PowerBiService.appWorkspaceApiRoot + "Datasets/";
      // execute call against Power BI Service API
      return $.ajax({
        url: restUrl,
        headers: {
          "Accept": "application/json;odata.metadata=minimal;",
          "Authorization": "Bearer " + SpaAuthService.accessToken
        }
      });
    }

    
  }
  
}