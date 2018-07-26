import * as React from 'react';
import styles from './PowerBiReactDashboard.module.scss';
import { IPowerBiReactDashboardProps, IPowerBiReactDashboardState } from './IPowerBiReactDashboardProps';

import { PowerBiWorkspace, PowerBiDashboard } from './../../../models/PowerBiModels';
import { PowerBiService } from './../../../services/PowerBiService';
import { PowerBiEmbeddingService } from './../../../services/PowerBiEmbeddingService';

export default class PowerBiReactDashboard extends React.Component<IPowerBiReactDashboardProps, IPowerBiReactDashboardState> {
  
  constructor(props: IPowerBiReactDashboardProps) {
    super(props);
  }

  public state: IPowerBiReactDashboardState = {
    workspaceId: this.props.defaultWorkspaceId,
    dashboardId: this.props.defaultDashboardId,
    widthToHeight: this.props.defaultWidthToHeight,
    loading: false
  };

  private dashboardCannotRender(): Boolean {
    console.log("workspaceId", this.state.workspaceId);
    console.log("dashboardId",this.state.dashboardId);
    return ((this.state.workspaceId === undefined) || (this.state.workspaceId === "")) ||
      ((this.state.dashboardId === undefined) || (this.state.dashboardId === ""));
  }

  public render(): React.ReactElement<IPowerBiReactDashboardProps> {
    
    let containerHeight = this.props.webPartContext.domElement.clientWidth / (this.state.widthToHeight/100);
    
    return (
      <div className={styles.powerBiReactDashboard} >
        {this.state.loading ? (
          <div id="loading" className={styles.loadingContainer} >Calling to Power BI Service</div> 
        ) : ( 
          this.dashboardCannotRender() ? 
          <div id="message-container" className={styles.messageContainer} >Select a workspace and dashboard from the web part property pane</div> : 
          <div id="embed-container" className={styles.embedContainer} style={{height: containerHeight }} ></div> 
        )}        
      </div>
    );
  }

  public componentDidMount() {
    console.log("componentDidUpdate");
    this.embedDashboard();
  }


  public componentDidUpdate(prevProps: IPowerBiReactDashboardProps, prevState: IPowerBiReactDashboardState, prevContext: any): void {
    console.log("componentDidUpdate");
    this.embedDashboard();
  }

  private embedDashboard() {
    console.log("embedDashboard");
    console.log("Loading", this.state.loading);
    console.log("dashboardCannotRender", this.dashboardCannotRender());
    let embedTarget: HTMLElement = document.getElementById('embed-container');
    if (!this.state.loading && !this.dashboardCannotRender()) {
      PowerBiService.GetDashboard(this.props.serviceScope, this.state.workspaceId, this.state.dashboardId).then((dashboard: PowerBiDashboard) => {
        console.log("Got dashboard");
        PowerBiEmbeddingService.embedDashboard(dashboard, embedTarget);
      });
    }
  }

}
