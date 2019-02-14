import React from 'react';

export class NavBar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      opened: false,
    };
  }

  render() {
    let insideClasses = ["nav-insidebar"];
    if (!this.state.opened) insideClasses.push("nav-hidden");

    return <nav className="nav-bar">
      <div className="nav-opensidebar" onClick={() => this.setState({opened: !this.state.opened})}>
        <span className="glyphicon glyphicon-menu-hamburger" aria-hidden="true"/>
      </div>
      <div className={insideClasses.join(" ")}>
        <div className="nav-closesidebar" onClick={() => this.setState({opened: false})}>
          <span className="glyphicon glyphicon-remove" aria-hidden="true"/>
        </div>
        {this.props.children.map((child, index) => React.cloneElement(child, {
          key: index,
          onItemClicked: () => this.setState({opened: false}),
          activeKey: this.props.activeKey || child.props.activeKey,
        }))}
      </div>
    </nav>
  }
}

export class NavGroup extends React.Component {
  render() {
    let classes = ["nav-group"];
    if (this.props.left) classes.push("nav-group-left");
    if (this.props.right) classes.push("nav-group-right");

    return <div className={classes.join(" ")}>
      { React.Children.map(this.props.children, (child, index) => {
        if (!child) return null;
        return React.cloneElement(child, {
          key: index,
          isActive: (!!child.key && child.key === this.props.activeKey),
          onItemClicked: this.props.onItemClicked,
        });
      })}
    </div>
  }
}

NavGroup.propTypes = {
  left: React.PropTypes.bool,
  right: React.PropTypes.bool,
};


export class NavItem extends React.Component {
  handleClick(ev) {
    ev.preventDefault();
    if (this.props.onClick) this.props.onClick();
    this.props.onItemClicked();
  }

  render() {
    let classes = ["nav-item"];
    if (this.props.isActive) classes.push("nav-item-active");
    let className = classes.join(" ");

    if (this.props.href) {
      return <a className={className} href={this.props.href} onClick={ev => this.handleClick(ev)}>
        {this.props.children}
      </a>;
    }
    return <div className={className} onClick={ev => this.handleClick(ev)}>
      {this.props.children}
    </div>;
  }
}


NavGroup.propTypes = {
  href: React.PropTypes.string,
  onClick: React.PropTypes.func,
};
