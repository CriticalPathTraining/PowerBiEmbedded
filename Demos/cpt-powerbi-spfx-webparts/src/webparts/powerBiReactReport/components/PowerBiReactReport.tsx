import * as React from 'react';
import styles from './PowerBiReactReport.module.scss';
import { IPowerBiReactReportProps, IPowerBiReactReportState } from './IPowerBiReactReportProps';

import { PowerBiWorkspace, PowerBiReport } from './../../../models/PowerBiModels';
import { PowerBiService } from './../../../services/PowerBiService';
import { PowerBiEmbeddingService } from './../../../services/PowerBiEmbeddingService';

export default class PowerBiReactReport extends React.Component<IPowerBiReactReportProps, IPowerBiReactReportState> {

  constructor(props: IPowerBiReactReportProps) {
    super(props);
  }

  public state: IPowerBiReactReportState = {
    workspaceId: this.props.defaultWorkspaceId,
    reportId: this.props.defaultReportId,
    widthToHeight: this.props.defaultWidthToHeight,
    loading: false
  };

  private reportCannotRender(): Boolean {
    return ((this.state.workspaceId === undefined) || (this.state.workspaceId === "")) ||
      ((this.state.reportId === undefined) || (this.state.reportId === ""));
  }

  public render(): React.ReactElement<IPowerBiReactReportProps> {

    let containerHeight = this.props.webPartContext.domElement.clientWidth / (this.state.widthToHeight/100);
    
    console.log("PowerBiReactReport.render");
    return (
      <div className={styles.powerBiReactReport}  >
        {this.state.loading ? (
          <div id="loading" className={styles.loadingContainer} >Calling to Power BI Service</div> 
        ) : ( 
          this.reportCannotRender() ? 
          <div id="message-container" className={styles.messageContainer} >Select a workspace and report from the web part property pane</div> : 
          <div id="embed-container" className={styles.embedContainer} style={{height: containerHeight }} ></div> 
        )}        
      </div>
    );
  }

  public componentDidMount() {
    console.log("componentDidUpdate");
    this.embedReport();
  }


  public componentDidUpdate(prevProps: IPowerBiReactReportProps, prevState: IPowerBiReactReportState, prevContext: any): void {
    console.log("componentDidUpdate");
    this.embedReport();
  }

  private embedReport() {
    let embedTarget: HTMLElement = document.getElementById('embed-container');
    if (!this.state.loading && !this.reportCannotRender()) {
      PowerBiService.GetReport(this.props.serviceScope, this.state.workspaceId, this.state.reportId).then((report: PowerBiReport) => {
        PowerBiEmbeddingService.embedReport(report, embedTarget);
      });
    }
  }

}
