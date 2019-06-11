import * as React from 'react';
import { withRouter, RouteComponentProps, Route, Switch, Link, match } from 'react-router-dom'

import PowerBiService from "./../../services/PowerBiService";

import App from './../App'
import EmbeddedReport from './EmbeddedReport';

import {
  PowerBiReport
} from "./../../models/PowerBiModels";

interface ViewReportsProperties {
  app: App
}

interface EmbeddedReportRouteParams {
  id: string;
}

type ViewReportsPropertiesWithRouter =
  ViewReportsProperties &
  RouteComponentProps<EmbeddedReportRouteParams>;

interface ViewReportsState {
  loadingReports: boolean
}

class ViewReports extends React.Component<ViewReportsPropertiesWithRouter, ViewReportsState> {

  state = {
    loadingReports: false
  }

  render() {
    return (
      <div id="view-reports" >
        <div className="row">
          <div id="left-nav-col" className="col col-2">
            <div id="left-nav">
              <div id="left-nav-header">Embed Report</div>
              {this.state.loadingReports ? <div>loading...</div> : null}
              <ul>
                {this.props.app.state.reports.map((report: PowerBiReport, indexKey: number) => {
                  return <li key={indexKey}><a href="javascript:void(0)" onClick={() => {
                    this.props.history.push(`/reports/${report.id}`);
                  }} >{report.name}</a></li>
                })}
              </ul>
            </div>
          </div>
          <div id="content-col" className="col col-10">
            <EmbeddedReport reports={this.props.app.state.reports} />
          </div>
        </div>
      </div>
    );
  }

  componentDidMount() {
    this.getReports();
  }

  getReports = () => {
    if (!this.props.app.state.reportsInCache) {
      this.setState({ loadingReports: true })
      PowerBiService.GetReports().then((reports: PowerBiReport[]) => {
        this.props.app.setState({
          reports: reports,
          reportsInCache: true,
        })
        this.setState({ loadingReports: false })
      });
    }
  }

}

export default withRouter<ViewReportsPropertiesWithRouter>(ViewReports);