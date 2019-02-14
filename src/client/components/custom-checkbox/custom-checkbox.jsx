import React from 'react';


export class CustomCheckbox extends React.Component {

  render() {
    let checkedClass = !this.props.checked ? "unchecked" : "checked";

    if (this.props.disabled) {
      return <div className="custom-checkbox">
        <span className={`glyphicon glyphicon-tint ${checkedClass}`}/>
      </div>;
    }

    return <div className="custom-checkbox custom-checkbox-enabled"
                onClick={() => this.props.onChange() }>
      <span className={`glyphicon glyphicon-tint ${checkedClass}`}/>
    </div>;
  }
}

CustomCheckbox.propTypes = {
  disabled: React.PropTypes.bool,
  onChange: React.PropTypes.func,
};
