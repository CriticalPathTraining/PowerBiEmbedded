import * as React from 'react';
import './ViewHome.css';

export default class ViewHome extends React.Component<any, any> {
  render() {
    return (
      <div id="view-home" className="content-body" >
        <div className="row">
          <div className="jumbotron col">
            <h3>React Power BI Demo App</h3>
            <p>This is a demo of a single page application (SPA) that use React.js and Power BI Embedding.</p>
          </div>
        </div>
        <div className="row">
          <div className="col">
            <h4>React.js is awesome</h4>
            <div>If you don't know how to develop using <strong>react.js</strong>, you should learn about this popular JavaScript library because it
                provides a powerful yet relatively simple way to develop single page applications with client-side behaviors.
            </div>
          </div>
          <div className="col">
            <h4>Power BI Embedded is game changing</h4>
            <div>Learning how to develop with Power BI embedding will help you integrate professional looking reports and dashboards into your custom applications.</div>
          </div>
        </div>
      </div>
    );
  }
}
