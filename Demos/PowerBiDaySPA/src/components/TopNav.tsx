import * as React from 'react';
import { Link, NavLink } from 'react-router-dom';

import "./TopNav.css";

export default class TopNav extends React.Component<any, any> {

  render() {
    return (
      <div id="top-nav" className="navbar-collapse collapse" >
        <nav>
          <ul className="nav navbar-nav" >
            <li className="nav-item" >
              <NavLink exact to="/dashboards" className="navbar-link" activeClassName="active-nav-link" >
                Dashboards
              </NavLink>
            </li>
            <li className="nav-item" >
              <NavLink exact to="/reports" className="navbar-link" activeClassName="active-nav-link" >
                Reports
              </NavLink>
            </li>
            <li className="nav-item" >
              <NavLink exact to="/datasets" className="navbar-link" activeClassName="active-nav-link" >
                Datasets
              </NavLink>
            </li>
          </ul>
        </nav>
      </div>
    );
  }

}
