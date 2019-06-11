
export interface PowerBiDashboardTile {
  dashboardId: string;
  tileId: string;
  title: string;
  embedUrl: string;
}

export interface PowerBiDashboard {
  displayName: string;
  embedUrl: string;
  id: string;
}

export interface PowerBiReport {
  id: string;
  embedUrl: string;
  name: string;
  webUrl: string;
  datasetId: string;
}


export interface PowerBiDataset {
  name: string;
  embedUrl: string;
  id: string;
}

export interface EmbedResources {
  dashboards: PowerBiDashboard[];
  reports: PowerBiReport[];
  datasets: PowerBiDataset[];
}

export interface EmbedDataNewReport {
  workspaceId: string;
  datasetId: string;
  embedUrl: string;
  accessToken: string;
}