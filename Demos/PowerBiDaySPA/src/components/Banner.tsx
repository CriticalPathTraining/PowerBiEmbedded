import * as React from 'react';
import { Link, NavLink } from 'react-router-dom';

import './Banner.css';

interface BannerProperties {
  appTitle: string;
}

export default class Banner extends React.Component<BannerProperties, any> {
  render() {
    return (
      <div id="banner" className="row navbar navbar-expand-sm navbar-dark bg-dark" role="navigation" >
        <NavLink exact to="/" className="navbar-link" activeClassName="active-nav-link" >
          <div id="app-icon"  ></div>
          <div id="app-title">{this.props.appTitle}</div>
        </NavLink>
        {this.props.children}
      </div>
    );
  }
}
