import * as React from 'react';

import './EmbeddedReportToolbar.css';

import * as powerbi from "powerbi-client";
import * as pbimodels from "powerbi-models";

interface EmbeddedReportToolbarProperties {
  embeddedReport: powerbi.Report
}

export default class EmbeddedReport extends React.Component<EmbeddedReportToolbarProperties, any> {

  render() {
    return (
      <div id="embedded-report-toolbar" >
        <div>
          <button onClick={() => this.toggleReportEditMode()}>TOGGLE EDIT</button>
          <button onClick={() => this.enterFullScreenMode()} >FULLSCREEN</button>
          <button onClick={() => this.printReport()} >PRINT</button>
        </div>
      </div>);
  }

  private viewMode = "view";

  toggleReportEditMode() {
    this.viewMode = (this.viewMode == "view") ? "edit" : "view";
    this.props.embeddedReport.switchMode(this.viewMode);
    // show filter pane when entering edit mode   
    var showFilterPane = (this.viewMode == "edit");
    this.props.embeddedReport.updateSettings({
      "filterPaneEnabled": showFilterPane
    });
  };

  enterFullScreenMode() {
    this.props.embeddedReport.fullscreen();
  }

  printReport() {
    this.props.embeddedReport.print();
  }

}
