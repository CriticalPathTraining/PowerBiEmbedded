import { IWebPartContext } from "@microsoft/sp-webpart-base";
import { ServiceScope } from "@microsoft/sp-core-library";

export interface IPowerBiReactDashboardProps {
  webPartContext: IWebPartContext;
  serviceScope: ServiceScope;
  defaultWorkspaceId: string;
  defaultDashboardId: string;
  defaultWidthToHeight: number;
}

export interface IPowerBiReactDashboardState {
  loading: boolean;
  workspaceId: string;
  dashboardId: string;
  widthToHeight: number;
}

