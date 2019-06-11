import * as React from 'react';
import { withRouter, RouteComponentProps, Link } from 'react-router-dom'

import { PowerBiDashboard } from "./../../models/PowerBiModels";
import PowerBiEmbeddingService from "./../../services/PowerBiEmbeddingService";

interface EmbeddedDashboardProperties {
  dashboards: PowerBiDashboard[];
}

interface EmbeddedDashboardRouteParams {
  id: string;
}

type EmbeddedDashboardPropertiesWithRouter =
  EmbeddedDashboardProperties &
  RouteComponentProps<EmbeddedDashboardRouteParams>;

class EmbeddedDashboard extends React.Component<EmbeddedDashboardPropertiesWithRouter, any> {

  render() {
    let dashboardIdRouteParam: string = this.props.match.params.id;
    let noDashboardId = (dashboardIdRouteParam === undefined);
    let dashboard: PowerBiDashboard | undefined = this.props.dashboards.find((dashboard: PowerBiDashboard) => dashboard.id == dashboardIdRouteParam);
    let badDashboardId: boolean = (dashboardIdRouteParam != "") && (dashboard === undefined)
    if (noDashboardId) {
      return (
        <div className="message-body" >
          click a report to embed it on this page
        </div>);
    }
    if (badDashboardId) {
      return (
        <div className="message-body" >
          <div>'{dashboardIdRouteParam}' is not a valid dashboard id</div>
        </div>);
    }
    return (
      <div id="embedded-report" >
        <div id='embed-container' ></div>
      </div>);
  }


  componentDidUpdate() {
    this.updateEmbeddedDashboard();
  }
  componentDidMount() {
    this.updateEmbeddedDashboard();
  }

  updateEmbeddedDashboard() {
    let dashboardIdRouteParam: string = this.props.match.params.id;
    let dashboard: PowerBiDashboard | undefined = this.props.dashboards.find((dashboard: PowerBiDashboard) => dashboard.id == dashboardIdRouteParam);
    if (dashboard) {
      var embedContainer: HTMLElement = document.getElementById('embed-container')!;
      PowerBiEmbeddingService.embedDashboard(dashboard!, embedContainer);
    }
  }


}

export default withRouter<EmbeddedDashboardPropertiesWithRouter>(EmbeddedDashboard);
