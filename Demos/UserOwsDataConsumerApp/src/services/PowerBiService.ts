import AppSettings from './../AppSettings'

import {
  PowerBiDashboard,
  PowerBiReport,
  PowerBiDataset,
  PowerBiDashboardTile
}
  from "./../models/PowerBiModels";

import SpaAuthService from "./SpaAuthService";

export default class PowerBiService {

  static appId = AppSettings.appId;  
  static apiRoot: string = "https://api.powerbi.com/v1.0/myorg/";
  static appApiRoot = PowerBiService.apiRoot + "apps/" + PowerBiService.appId + "/";

  static GetReports = (): Promise<PowerBiReport[]> => {
    var restUrl = PowerBiService.appApiRoot + "Reports/";
    return fetch(restUrl, {
      headers: {
        "Accept": "application/json;odata.metadata=minimal;",
        "Authorization": "Bearer " + SpaAuthService.accessToken
      }
    }).then(response => response.json())
      .then(response => { return response.value; });
  }

  static GetDashboards = (): Promise<PowerBiDashboard[]> => {
    var restUrl = PowerBiService.appApiRoot + "Dashboards/";
    return fetch(restUrl, {
      headers: {
        "Accept": "application/json;odata.metadata=minimal;",
        "Authorization": "Bearer " + SpaAuthService.accessToken
      }
    }).then(response => response.json())
      .then(response => { return response.value; });
  }

  static GetDashboardTiles = (dashboardId: string): Promise<PowerBiDashboardTile[]> => {
    var restUrl = PowerBiService.appApiRoot + "Dashboards/" + dashboardId + "/tiles/";
    return fetch(restUrl, {
      headers: {
        "Accept": "application/json;odata.metadata=minimal;",
        "Authorization": "Bearer " + SpaAuthService.accessToken
      }
    }).then(response => response.json())
      .then(response => { return response.value; });
  }
}
