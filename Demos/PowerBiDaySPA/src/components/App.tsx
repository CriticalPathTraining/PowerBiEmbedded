import * as React from 'react';
import { Link, Route, Switch } from 'react-router-dom';

import Banner from "./Banner";
import TopNav from "./Topnav";
import Login from "./Login";

import ViewHome from './ViewHome/ViewHome';
import ViewDashboards from './ViewDashboards/ViewDashboards'
import EmbeddedReport from './ViewReports/EmbeddedReport'
import ViewReports from './ViewReports/ViewReports';
import ViewDatasets from './ViewDatasets/ViewDatasets';

import SpaAuthService from "./../services/SpaAuthService";
import PowerBiService from "./../services/PowerBiService";

import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap';
import './App.css';

import IUser from "./../models/IUser";

import {
  PowerBiDashboard,
  PowerBiReport,
  PowerBiDataset,
  EmbedResources
} from "./../models/PowerBiModels";

export interface AppState {
  user: IUser;
  dashboards: PowerBiDashboard[];
  dashboardsInCache: boolean;
  reports: PowerBiReport[];
  reportsInCache: boolean;
  datasets: PowerBiDataset[];
  datasetsInCache: boolean
}

export default class App extends React.Component<any, AppState> {

  state: AppState = {
    dashboards: [],
    reports: [],
    datasets: [],
    dashboardsInCache: false,
    reportsInCache: false,
    datasetsInCache: false,
    user: {
      IsAuthenticated: false,
      DisplayName: "",
      login: () => { this.loginUser(); },
      logout: () => { this.logoutUser(); }
    }
  };

  loginUser = () => {
    SpaAuthService.login();
  };

  logoutUser = () => {
    SpaAuthService.logout();
    this.setState({
      user: {
        IsAuthenticated: false,
        DisplayName: "",
        login: this.state.user.login,
        logout: this.state.user.logout
      }
    });
  };


  render() {

    return (
      <div id="page-container" className="container">

        <Banner appTitle="React Power BI Embedding" >
          {this.state.user.IsAuthenticated ? <TopNav /> : null}
          <Login user={this.state.user} />
        </Banner>

        <Switch>
          <Route path="/" exact component={ViewHome} />
          <Route path="/dashboards/:id?" render={() => <ViewDashboards app={this} />} />
          <Route path="/reports/:id?" render={() => <ViewReports app={this} />} />
          <Route path="/datasets/:id?" render={() => <ViewDatasets app={this} />} />
        </Switch>

      </div>);
  }

  componentDidMount() {

    SpaAuthService.uiUpdateCallback = (userIsAuthenticated: boolean) => {
      if (SpaAuthService.userIsAuthenticated) {
        console.log(SpaAuthService.userName + " has been authenticated");
        this.setState({
          user: {
            IsAuthenticated: true,
            DisplayName: SpaAuthService.userDisplayName,
            login: this.state.user.login,
            logout: this.state.user.logout
          }
        });
      }
    };
    SpaAuthService.init();
  }

} 