import * as React from 'react';
import IUserAction from "./../models/IUserAction"
import {
  PowerBiDashboard,
  PowerBiReport,
  PowerBiDataset,
  EmbedResources
} from "./../models/PowerBiModels";

import { AppView } from "./App";

import SpaAuthService from "./../services/SpaAuthService";
import PowerBiService from "./../services/PowerBiService";
import PowerBiEmbeddingService from "./../services/PowerBiEmbeddingService";

import './LeftNav.css';

export interface LeftNavProperties {
  view: AppView;
  embedResources: EmbedResources;
}

export default class LeftNav extends React.Component<LeftNavProperties, any> {

  
  render() {
    let target = document.getElementById('embed-container');
    if (target) PowerBiEmbeddingService.reset(target);  
    return (
      <div>
        <div id="left-nav">

          {this.props.view == "Dashboards" ? (
            <div>
              <div id="left-nav-header">Embed Dashboard</div>
              <ul>
                {this.props.embedResources.dashboards.map((dashboard: PowerBiDashboard, indexKey: number) => {
                  return <li key={indexKey}><a href="javascript:void(0)" onClick={() => {
                    var embedContainer: HTMLElement = document.getElementById('embed-container')!;
                    PowerBiEmbeddingService.embedDashboard(dashboard, embedContainer);
                  }} >{dashboard.displayName}</a></li>
                })}
              </ul>
            </div>) : null}

          {this.props.view == "Reports" ? (
            <div>
              <div id="left-nav-header">Embed Report</div>
              <ul>
                {this.props.embedResources.reports.map((report: PowerBiReport, indexKey: number) => {
                  return <li key={indexKey}><a href="javascript:void(0)" onClick={() => {
                    var embedContainer: HTMLElement = document.getElementById('embed-container')!;
                    PowerBiEmbeddingService.embedReport(report, embedContainer);
                  }} >{report.name}</a></li>
                })}
              </ul>
            </div>) : null}

          {this.props.view == "New Report" ? (
            <div>
              <div id="left-nav-header">Embed New Report</div>
              <ul>
                {this.props.embedResources.datasets.map((dataset: PowerBiDataset, indexKey: number) => {
                  return <li key={indexKey}><a href="javascript:void(0)" onClick={() => {
                    var embedContainer: HTMLElement = document.getElementById('embed-container')!;
                    PowerBiEmbeddingService.embedNewReport(dataset, embedContainer);
                  }} >{dataset.name}</a></li>
                })}
              </ul>
            </div>) : null}

          {this.props.view == "Tiles" ? (
            <div>
              <div id="left-nav-header">Embed Dashboard Tiles</div>
              <ul>
                {this.props.embedResources.dashboards.map((dashboard: PowerBiDashboard, indexKey: number) => {
                  return <li key={indexKey}><a href="javascript:void(0)" onClick={() => {
                    var embedContainer: HTMLElement = document.getElementById('embed-container')!;
                    PowerBiEmbeddingService.embedDashboardTiles(dashboard, embedContainer);
                  }} >{dashboard.displayName}</a></li>
                })}
              </ul>
            </div>) : null}

          {this.props.view == "Q&A" ? (
            <div>
              <div id="left-nav-header">Embed Q&A</div>
              <ul>
                {this.props.embedResources.datasets.map((dataset: PowerBiDataset, indexKey: number) => {
                  return <li key={indexKey}><a href="javascript:void(0)" onClick={() => {
                    var embedContainer: HTMLElement = document.getElementById('embed-container')!;
                    PowerBiEmbeddingService.embedQnA(dataset, embedContainer);
                  }} >{dataset.name}</a></li>
                })}
              </ul>
            </div>) : null}
        </div>
      </div>
    );
  }
}