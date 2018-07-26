import * as React from 'react';
import IUserAction from "./../models/IUserAction"
import "./TopNav.css";

interface TopNavProperties {
  userActions: IUserAction[];
}

export default class TopNav extends React.Component<TopNavProperties, any> {

  render() {
    return (
      <div id="top-nav">
        <ul>
          {this.props.userActions.map((userAction: IUserAction, indexKey: number) => {
            return <li key={indexKey}><a href="javascript:void(0)" onClick={userAction.actionFunction} >{userAction.caption}</a></li>
          })}
        </ul>
      </div>
    );
  }

}
