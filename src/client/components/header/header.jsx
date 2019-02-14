import React from 'react';
import {createContainer} from 'meteor/react-meteor-data';

import {Helpers} from '/src/client/helpers.js';
import {NavBar, NavGroup, NavItem} from '/src/client/components/navbar/navbar.jsx';
import {Rights} from "/src/lib/rights.js";

class Header_ extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    let isAdmin = !!this.props.user && Rights.isAdmin(this.props.user._id);
    return <NavBar>
      <NavGroup left activeKey={this.props.selectedHeaderPage || "votes"}>
        <NavItem key="votes" href="/">Votes</NavItem>
        { !this.props.user ? null : <NavItem key="results" href="/results">Results</NavItem> }
        <NavItem key="rules" href="/rules">Rules</NavItem>
        <NavItem key="about" href="/about">About</NavItem>
        { !isAdmin ? null :
          <NavItem key="admin" href="/admin">Admin</NavItem>
        }
      </NavGroup>
      <NavGroup right>
        { !this.props.user
            ? <NavItem onClick={Helpers.facebookLogin}>Log in</NavItem>
            : <NavItem onClick={() => {Meteor.logout(); FlowRouter.go("/"); }}>
          <img className="header-photo"
               src={this.props.user.profile.photo || "/asset/avatar50px.jpg"}/>
          Log out
        </NavItem>
        }
      </NavGroup>
    </NavBar>;
  }
}


export const Header = createContainer(() => {
  return {
    user: Meteor.user(),
  };
}, Header_);

Header.propTypes = {
  selectedHeaderPage: React.PropTypes.string,
};
