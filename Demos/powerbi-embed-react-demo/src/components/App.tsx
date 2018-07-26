import * as React from 'react';
import './App.css';

import IUser from "./../models/IUser";
import IUserAction from "./../models/IUserAction";

import {
    PowerBiDashboard,
    PowerBiReport,
    PowerBiDataset,
    EmbedResources
} from "./../models/PowerBiModels";

import ICustomer from "./../models/ICustomer";
import MockCustomersService from "./../services/MockCustomersService";
import CustomerService from "./../services/CustomerService";
import SpaAuthService from "./../services/SpaAuthService";
import PowerBiService from "./../services/PowerBiService";

import Banner from "./Banner";
import TopNav from "./Topnav";
import Login from "./Login";
import LeftNav from "./LeftNav";

interface AppProperties {
    appTitle?: string;
}

export type AppView = "Home" | "Dashboards" | "Reports" | "New Report" | "Tiles" | "Q&A";

interface AppState {
    user: IUser;
    view: AppView;
    dashboards: PowerBiDashboard[];
    dashboardsInCache: boolean;
    reports: PowerBiReport[];
    reportsInCache: boolean;
    datasets: PowerBiDataset[];
    datasetsInCache: boolean;
}

export default class App extends React.Component<AppProperties, AppState> {

    private actionsTopNav: IUserAction[];
    private actionsCustomersView: IUserAction[];

    constructor(props: AppProperties) {
        super(props);
        this.actionsTopNav = [
            { caption: "Reports", actionFunction: () => { this.getReports("Reports"); } },
            { caption: "Datasets", actionFunction: () => { this.getDatasets("New Report"); } },
            { caption: "Dashboards", actionFunction: () => { this.getDashboards("Dashboards"); } },
            { caption: "Tiles", actionFunction: () => { this.getDashboards("Tiles"); } },
            { caption: "Q&A", actionFunction: () => { this.getDashboards("Q&A"); } }
        ];
    }

    public static defaultProps: Partial<AppProperties> = {
        appTitle: "PBIE with React"
    };

    state: AppState = {
        view: "Home",
        dashboards: [],
        reports: [],
        datasets: [],
        dashboardsInCache: false,
        reportsInCache: false,
        datasetsInCache: false,
        user: {
            IsAuthenticated: false,
            login: () => { this.loginUser(); },
            logout: () => { this.logoutUser(); }
        }
    };

    loginUser = () => {
        SpaAuthService.login();
    };

    logoutUser = () => {
        SpaAuthService.logout();
        this.setState({ user: { IsAuthenticated: false, DisplayName: "", login: this.state.user.login, logout: this.state.user.logout } });
    };

    viewHome = () => { }
    viewDashboards = () => { }
    viewReports = () => { }
    viewNewReports = () => { }
    viewTitles = () => { }
    viewQnA = () => { }

    getDashboards = (view: AppView) => {
        if (this.state.dashboardsInCache) {
            this.setState({ view: view });
        } else {
            PowerBiService.GetDashboards().then((dashboards: PowerBiDashboard[]) => {
                this.setState({
                    dashboards: dashboards,
                    dashboardsInCache: true,
                    view: view
                })
            });
        }
    }



    getReports = (view: AppView) => {
        if (this.state.reportsInCache) {
            this.setState({ view: view });
        } else {
            PowerBiService.GetReports().then((report: PowerBiReport[]) => {
                this.setState({
                    reports: report,
                    reportsInCache: true,
                    view: view
                })
            });
        }
    }

    getDatasets = (view: AppView) => {
        if (this.state.datasetsInCache) {
            this.setState({ view: view });
        } else {
            PowerBiService.GetDatasets().then((dataset: PowerBiDataset[]) => {
                this.setState({
                    datasets: dataset,
                    datasetsInCache: true,
                    view: view
                })
            });
        }
    }

    render() {
        var embedResources: EmbedResources = {
            dashboards: this.state.dashboards,
            reports: this.state.reports,
            datasets: this.state.datasets
        };

        return (
            <div id="page-container">

                <Banner appTitle={this.props.appTitle!} >
                    {this.state.user.IsAuthenticated ? <TopNav userActions={this.actionsTopNav} /> : null}
                    <Login user={this.state.user} />
                </Banner>

                {this.state.view == "Home" ? (
                    <div className="content-body">
                        <h2>Welcome to the Power BI Embedded React Demo</h2>
                    </div>
                ) : (
                        <div>
                            <LeftNav view={this.state.view} embedResources={embedResources!} />
                            <div id="embed-container" />
                        </div>)
                }
            </div>
        );
    }

    componentDidMount() {
        console.log("App.componentDidMount");

        SpaAuthService.uiUpdateCallback = () => {
            this.setState({
                user: {
                    IsAuthenticated: true,
                    DisplayName: SpaAuthService.userName,
                    login: this.state.user.login,
                    logout: this.state.user.logout
                }
            });

        };

        SpaAuthService.init();
    }

    componentWillMount() {
        console.log("App.componentWillMount");
    }

    componentWillUpdate() {
        console.log("App.componentWillUpdate");
    }
}