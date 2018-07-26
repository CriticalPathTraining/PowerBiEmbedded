import * as React from 'react';
import * as ReactDom from 'react-dom';

import {
  BaseClientSideWebPart,
  IPropertyPaneConfiguration,
  PropertyPaneTextField,
  PropertyPaneDropdown,
  IPropertyPaneDropdownOption,
  PropertyPaneSlider
} from '@microsoft/sp-webpart-base';

import PowerBiReactDashboard from './components/PowerBiReactDashboard';
import { IPowerBiReactDashboardProps } from './components/IPowerBiReactDashboardProps';

import { ServiceScope } from '@microsoft/sp-core-library';

import { PowerBiWorkspace, PowerBiReport } from './../../models/PowerBiModels';
import { PowerBiService } from './../../services/PowerBiService';
import { PowerBiDashboard } from '../../../lib/models/PowerBiModels';


export interface IPowerBiReactDashboardWebPartProps {
  workspaceId: string;
  dashboardId: string;
  widthToHeight: number;
}

export default class PowerBiReactDashboardWebPart extends BaseClientSideWebPart<IPowerBiReactDashboardWebPartProps> {

  private powerBiReactDashboard: PowerBiReactDashboard;

  private workspaceOptions: IPropertyPaneDropdownOption[];
  private workspacesFetched: boolean = false;

  private fetchWorkspaceOptions(): Promise<IPropertyPaneDropdownOption[]> {
    return PowerBiService.GetWorkspaces(this.context.serviceScope).then((workspaces: PowerBiWorkspace[]) => {
      var options: Array<IPropertyPaneDropdownOption> = new Array<IPropertyPaneDropdownOption>();
      workspaces.map((workspace: PowerBiWorkspace) => {
        options.push({ key: workspace.id, text: workspace.name });
      });
      return options;
    });
  }

  private dashboardOptions: IPropertyPaneDropdownOption[];
  private dashboardsFetched: boolean = false;

  private fetchDashboardOptions(): Promise<IPropertyPaneDropdownOption[]> {
    return PowerBiService.GetDashboards(this.context.serviceScope, this.properties.workspaceId).then((dashboards: PowerBiDashboard[]) => {
      var options: Array<IPropertyPaneDropdownOption> = new Array<IPropertyPaneDropdownOption>();
      dashboards.map((dashboard: PowerBiDashboard) => {
        options.push({ key: dashboard.id, text: dashboard.displayName });
      });
      return options;
    });
  }

  public render(): void {

    console.log("PowerBiReactReportWebPart.render");
    const element: React.ReactElement<IPowerBiReactDashboardProps> = React.createElement(
      PowerBiReactDashboard, {
        webPartContext: this.context,
        serviceScope: this.context.serviceScope,
        defaultWorkspaceId: this.properties.workspaceId,
        defaultDashboardId: this.properties.dashboardId,
        defaultWidthToHeight: this.properties.widthToHeight
      }
    );
    this.powerBiReactDashboard = <PowerBiReactDashboard>ReactDom.render(element, this.domElement);
  }

  protected onPropertyPaneConfigurationStart(): void {
    console.log("onPropertyPaneConfigurationStart");
    if (this.workspacesFetched && this.dashboardsFetched) {
      return;
    }

    if (this.workspacesFetched && !this.dashboardsFetched) {
      this.powerBiReactDashboard.setState({ loading: true });
      this.fetchDashboardOptions().then((options: IPropertyPaneDropdownOption[]) => {
        this.dashboardOptions = options;
        this.dashboardsFetched = true;
        this.powerBiReactDashboard.setState({ loading: false });
        this.context.propertyPane.refresh();
        this.render();
      });
      return;
    }

    this.powerBiReactDashboard.setState({ loading: true });
    this.fetchWorkspaceOptions().then((options: IPropertyPaneDropdownOption[]) => {
      this.workspaceOptions = options;
      this.workspacesFetched = true;
      this.powerBiReactDashboard.setState({ loading: false });
      this.context.propertyPane.refresh();
      this.render();
    });
  }

  protected onPropertyPaneFieldChanged(propertyPath: string, oldValue: any, newValue: any): void {
    super.onPropertyPaneFieldChanged(propertyPath, oldValue, newValue);
    console.log("onPropertyPaneFieldChanged");
    if (propertyPath === 'workspaceId' && newValue) {
      console.log("Workspace ID updated: " + newValue);
      // reset report settings
      this.properties.dashboardId = "";
      this.dashboardOptions = [];
      this.dashboardsFetched = false;
      // refresh the item selector control by repainting the property pane
      this.context.propertyPane.refresh();
      // communicate loading items      
      this.powerBiReactDashboard.setState({ loading: true, workspaceId: this.properties.workspaceId });
      this.fetchDashboardOptions().then((options: IPropertyPaneDropdownOption[]) => {
        this.dashboardOptions = options;
        this.dashboardsFetched = true;
        this.powerBiReactDashboard.setState({ loading: false });
        this.context.propertyPane.refresh();
      });
    }

    if (propertyPath === 'dashboardId' && newValue) {
      this.powerBiReactDashboard.setState({ dashboardId: this.properties.dashboardId });
    }
    
    if (propertyPath === 'widthToHeight' && newValue) {
      this.powerBiReactDashboard.setState({ widthToHeight: this.properties.widthToHeight });
    }
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    console.log("getPropertyPaneConfiguration");
    return {
      pages: [{
        header: { description: "A gratuitous demo of embeding Power BI reports using a React Web Part" },
        groups: [{
          groupName: "Power BI Configuration",
          groupFields: [
            PropertyPaneDropdown(
              "workspaceId", {
                label: "Select a Workspace",
                options: this.workspaceOptions,
                disabled: !this.workspacesFetched
              }),
            PropertyPaneDropdown(
              "dashboardId", {
                label: "Select a Dashboard",
                options: this.dashboardOptions,
                disabled: !this.dashboardsFetched
              }),
              PropertyPaneSlider("widthToHeight", {
                label: "Width to Height Perentage",
                min: 25,
                max: 400
              })]
        }]
      }]
    };
  }
}
