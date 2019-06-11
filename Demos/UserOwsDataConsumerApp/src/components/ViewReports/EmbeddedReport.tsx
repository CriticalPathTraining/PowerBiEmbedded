import * as React from 'react';
import { withRouter, RouteComponentProps, Link } from 'react-router-dom'

import { PowerBiReport } from "./../../models/PowerBiModels";
import PowerBiEmbeddingService from "./../../services/PowerBiEmbeddingService";

import EmbeddedReportToolbar from './EmbeddedReportToolbar';

import * as powerbi from "powerbi-client";
import * as pbimodels from "powerbi-models";

interface EmbeddedReportProperties {
  reports: PowerBiReport[]
}

interface EmbeddedReportRouteParams {
  id: string;
}

type EmbeddedReportPropertiesWithRouter =
  EmbeddedReportProperties &
  RouteComponentProps<EmbeddedReportRouteParams>;

interface EmbeddedReportState {
  embeddedReport: powerbi.Report | undefined
}

class EmbeddedReport extends React.Component<EmbeddedReportPropertiesWithRouter, EmbeddedReportState> {

  state: EmbeddedReportState = {
    embeddedReport: undefined
  }

  render() {
    let reportIdRouteParam: string = this.props.match.params.id;
    let noReportId = (reportIdRouteParam === undefined);
    let report: PowerBiReport | undefined = this.props.reports.find((report: PowerBiReport) => report.id == reportIdRouteParam);
    let badReportId: boolean = (this.props.reports.length > 0) && (reportIdRouteParam != "") && (report === undefined)
    if (noReportId) {
      return (
        <div className="message-body" >
          click report in left nav to open it
        </div>);
    }
    if (badReportId) {
      return (
        <div className="message-body" >
          <div>'{reportIdRouteParam}' is not a valid report id</div>
        </div>);
    }
    return (
      <div id="embedded-report" >
        {(this.state.embeddedReport !== undefined ? <EmbeddedReportToolbar embeddedReport={this.state.embeddedReport} /> : null)}
        <div id='embed-container' ></div>
      </div>);
  }


  componentWillUpdate() {

  }

  componentDidUpdate(previousProps: EmbeddedReportPropertiesWithRouter, PreviousState: any) {
    console.log("componentDidUpdate");
    console.log(previousProps);
    console.log(this.props);
    let routeHasChanged: boolean = (this.props.match.params.id != previousProps.match.params.id);
    let reportsRefreshed = this.props.reports !== previousProps.reports;
    if (routeHasChanged || reportsRefreshed) {
      this.updateEmbeddedReport();
    }
  }

  componentDidMount() {
    console.log("componentDidMount");
    //this.updateEmbeddedReport();
  }

  updateEmbeddedReport() {
    let reportIdRouteParam: string = this.props.match.params.id;
    let report: PowerBiReport | undefined = this.props.reports.find((report: PowerBiReport) => report.id == reportIdRouteParam);
    if (report) {
      var embedContainer: HTMLElement = document.getElementById('embed-container')!;
      var embeddedReport: powerbi.Report = PowerBiEmbeddingService.embedReport(report!, embedContainer);
      this.setState({ embeddedReport: embeddedReport });
    }
  }
}

export default withRouter<EmbeddedReportPropertiesWithRouter>(EmbeddedReport);