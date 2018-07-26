export interface PowerBiWorkspace {
  id: string;
  name: string;
}

export interface PowerBiReport {
  id: string;
  embedUrl: string;
  name: string;
  webUrl: string;
  datasetId: string;
  accessToken: string;
}


export interface PowerBiDashboardTile {
  dashboardId: string;
  tileId: string;
  title: string;
  embedUrl: string;
  accessToken: string;
}

export interface PowerBiDashboard {
  displayName: string;
  embedUrl: string;
  id: string;
  accessToken: string;
}

export interface PowerBiReport {
  id: string;
  embedUrl: string;
  name: string;
  webUrl: string;
  datasetId: string;
  accessToken: string;
}


export interface PowerBiDataset {
  id: string;  
  name: string;
  embedUrl: string;
  accessToken: string;
  workspaceId: string;
}

export interface EmbedResources {
  dashboards: PowerBiDashboard[];
  reports: PowerBiReport[];
  datasets: PowerBiDataset[];
}