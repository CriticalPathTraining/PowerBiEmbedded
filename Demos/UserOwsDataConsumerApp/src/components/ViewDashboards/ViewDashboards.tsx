import * as React from 'react';
import { withRouter, RouteComponentProps, Route, Switch, Link, match } from 'react-router-dom'

import PowerBiService from "./../../services/PowerBiService";

import App from './../App'
import EmbeddeDashboard from './EmbeddedDashboard';

import {
  PowerBiDashboard
} from "./../../models/PowerBiModels";
import EmbeddedDashboard from './EmbeddedDashboard';

interface ViewDashboardsProperties {
  app: App
}

interface EmbeddedDashboardRouteParams {
  id: string;
}

type ViewDashboardsPropertiesWithRouter =
  ViewDashboardsProperties &
  RouteComponentProps<EmbeddedDashboardRouteParams>;

interface ViewDashboardsState {
  loadingDashboards: boolean
}

class ViewDashboards extends React.Component<ViewDashboardsPropertiesWithRouter, ViewDashboardsState> {

  state = {
    loadingDashboards: false
  };

  render() {
    return (
      <div id="view-dashboards" >
        <div className="row">
          <div id="left-nav-col" className="col col-2">
            <div id="left-nav">
              <div id="left-nav-header">Embed Dashboards</div>
              {this.state.loadingDashboards ? <div>loading...</div> : null}
              <ul>
                {this.props.app.state.dashboards.map((dashboard: PowerBiDashboard, indexKey: number) => {
                  return <li key={indexKey}><a href="javascript:void(0)" onClick={() => {
                    this.props.history.push(`/dashboards/${dashboard.id}`);
                  }} >{dashboard.displayName}</a></li>
                })}
              </ul>
            </div>
          </div>
          <div id="content-col" className="col col-10">
            <EmbeddedDashboard dashboards={this.props.app.state.dashboards} />
          </div>
        </div>
      </div>
    );
  }


  componentDidMount() {
    this.getDashboards();
  }

  getDashboards = () => {
    if (!this.props.app.state.dashboardsInCache) {
      this.setState({ loadingDashboards: true });
      PowerBiService.GetDashboards().then((dashboards: PowerBiDashboard[]) => {
        this.props.app.setState({
          dashboards: dashboards,
          dashboardsInCache: true
        });
        this.setState({ loadingDashboards: false });
      });
    }
  }
}

export default withRouter<ViewDashboardsPropertiesWithRouter>(ViewDashboards);