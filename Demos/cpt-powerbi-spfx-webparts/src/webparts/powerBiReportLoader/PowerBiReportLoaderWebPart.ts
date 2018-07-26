import {
  BaseClientSideWebPart,
  IPropertyPaneConfiguration,
  PropertyPaneTextField,
  PropertyPaneDropdown,
  IPropertyPaneDropdownOption
} from '@microsoft/sp-webpart-base';

import './PowerBiReportLoaderWebPart.scss';

import { PowerBiWorkspace, PowerBiReport } from './../../models/PowerBiModels';
import { PowerBiService } from './../../services/PowerBiService';
import { PowerBiEmbeddingService } from './../../services/PowerBiEmbeddingService';

export interface IPowerBiReportLoaderWebPartProps {
  workspaceId: string;
  reportId: string;
}

export default class PowerBiReportLoaderWebPart extends BaseClientSideWebPart<IPowerBiReportLoaderWebPartProps> {

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

  private reportOptions: IPropertyPaneDropdownOption[];
  private reportsFetched: boolean = false;

  private fetchReportOptions(): Promise<IPropertyPaneDropdownOption[]> {
    return PowerBiService.GetReports(this.context.serviceScope, this.properties.workspaceId).then((workspaces: PowerBiWorkspace[]) => {
      var options: Array<IPropertyPaneDropdownOption> = new Array<IPropertyPaneDropdownOption>();
      workspaces.map((report: PowerBiReport) => {
        options.push({ key: report.id, text: report.name });
      });
      return options;
    });
  }


  public render(): void {

    if (this.properties.workspaceId === "") {
      this.domElement.innerHTML = "<div class='message-container'>Select a workspace from the web part property pane</div>";
    }
    else {
      if (this.properties.reportId === "") {
        this.domElement.innerHTML = "<div class='message-container'>Select a report from the web part property pane</div>";
      }
      else {

        // here we go
        this.context.statusRenderer.displayLoadingIndicator(this.domElement, 'Calling Power BI Service API to get report info');

        PowerBiService.GetReport(this.context.serviceScope, this.properties.workspaceId, this.properties.reportId).then(

          (report: PowerBiReport) => {
            this.context.statusRenderer.clearLoadingIndicator(this.domElement);
            //this.domElement.innerHTML = "<div id='embed-container' ></div>";
            this.domElement.style.height = "480px";

            PowerBiEmbeddingService.embedReport(report, this.domElement);

          });
      }
    }
  }


  protected onPropertyPaneConfigurationStart(): void {

    console.log("onPropertyPaneConfigurationStart 1");

    if (this.workspacesFetched && this.reportsFetched) {
      console.log("onPropertyPaneConfigurationStart 2");
      return;
    }

    if (this.workspacesFetched && !this.reportsFetched) {
      console.log("onPropertyPaneConfigurationStart 3");
      this.context.statusRenderer.displayLoadingIndicator(this.domElement, 'Calling Power BI Service API to get reports');
      this.fetchReportOptions().then((options: IPropertyPaneDropdownOption[]) => {
        console.log("onPropertyPaneConfigurationStart 4");
        this.reportOptions = options;
        this.reportsFetched = true;
        this.context.propertyPane.refresh();
        this.context.statusRenderer.clearLoadingIndicator(this.domElement);
        this.render();
      });
      return;
    }

    console.log("onPropertyPaneConfigurationStart 5");
    this.context.statusRenderer.displayLoadingIndicator(this.domElement, 'Calling Power BI Service API to get workspaces');

    console.log("onPropertyPaneConfigurationStart 6");
    this.fetchWorkspaceOptions().then((options: IPropertyPaneDropdownOption[]) => {
      console.log("onPropertyPaneConfigurationStart 7");
      this.workspaceOptions = options;
      this.workspacesFetched = true;
      this.context.propertyPane.refresh();
      this.context.statusRenderer.clearLoadingIndicator(this.domElement);
      this.render();
    });

  }

  protected onPropertyPaneFieldChanged(propertyPath: string, oldValue: any, newValue: any): void {
    super.onPropertyPaneFieldChanged(propertyPath, oldValue, newValue);

    if (propertyPath === 'workspaceId' && newValue) {
      console.log("Workspace ID updated: " + newValue);
      // reset report settings
      this.properties.reportId = "";
      this.reportOptions = [];
      this.reportsFetched = false;
      // refresh the item selector control by repainting the property pane
      this.context.propertyPane.refresh();
      // communicate loading items
      this.context.statusRenderer.displayLoadingIndicator(this.domElement, 'Calling Power BI Service API to get reports');
      this.fetchReportOptions().then((options: IPropertyPaneDropdownOption[]) => {
        console.log("report options fetched");
        console.log(options);
        this.reportOptions = options;
        this.reportsFetched = true;
        this.context.propertyPane.refresh();
        this.context.statusRenderer.clearLoadingIndicator(this.domElement);
        this.render();
      });
    }

    if (propertyPath === 'reportId' && newValue) {
      this.render();
    }
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {

    return {
      pages: [{
        header: { description: "A CPT Demo Web Part" },
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
              "reportId", {
                label: "Select a Report",
                options: this.reportOptions,
                disabled: !this.reportsFetched
              })
          ]
        }
        ]
      }
      ]
    };
  }
}