import * as React from 'react';
import { withRouter, RouteComponentProps, Route, Switch, Link, match } from 'react-router-dom'

import PowerBiService from "./../../services/PowerBiService";

import App from './../App'
import EmbeddedNewReport from './EmbeddedNewReport';

import { PowerBiDataset } from "./../../models/PowerBiModels";

interface ViewDatasetsProperties {
  app: App
}

interface datasetIdRouteParams {
  id: string;
}

type ViewDatasetsPropertiesWithRouter =
  ViewDatasetsProperties &
  RouteComponentProps<datasetIdRouteParams>;

interface ViewDatasetsState {
  loadingDatasets: boolean
}

class ViewDatasets extends React.Component<ViewDatasetsPropertiesWithRouter, ViewDatasetsState> {

  state = {
    loadingDatasets: false
  };

  render() {
    return (
      <div id="view-datasets" >
        <div className="row">
          <div id="left-nav-col" className="col col-2">
            <div id="left-nav">
              <div id="left-nav-header">Embed New Report</div>
              {this.state.loadingDatasets ? <div>loading...</div> : null}
              <ul>
                {this.props.app.state.datasets.map((dataset: PowerBiDataset, indexKey: number) => {
                  return <li key={indexKey}><a href="javascript:void(0)" onClick={() => {
                    this.props.history.push(`/datasets/${dataset.id}`);
                  }} >{dataset.name}</a></li>
                })}
              </ul>
            </div>
          </div>
          <div id="content-col" className="col col-10">
            <EmbeddedNewReport datasets={this.props.app.state.datasets} />
          </div>
        </div>
      </div>
    );
  }

  componentDidMount() {
    this.getDatasets();
  }

  getDatasets = () => {
    if (!this.props.app.state.datasetsInCache) {
      this.setState({ loadingDatasets: true });
      PowerBiService.GetDatasets().then((datasets: PowerBiDataset[]) => {
        this.props.app.setState({
          datasets: datasets,
          datasetsInCache: true
        });
        this.setState({ loadingDatasets: false });
      });
    }
  }

}

export default withRouter<ViewDatasetsPropertiesWithRouter>(ViewDatasets);