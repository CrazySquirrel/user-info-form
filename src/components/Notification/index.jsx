import React, {Component} from 'react';

import './index.scss';

class Notification extends Component {

  constructor(props) {
    super(props);

    if (props.timer) {
      this.state = {
        timer: props.timer
      };

      const startDate = new Date();

      const timer = setInterval(
          () => {
            const timerValue = Math.round(
                Math.max(
                    props.timer - (new Date() - startDate),
                    0
                ) / 1000
            );

            if (timerValue === 0) {
              clearInterval(timer);
            }

            this.setState({
              timer: timerValue
            });
          },
          100
      )
    } else {
      this.state = {
        timer: ""
      };
    }
  }

  render() {
    let className = ["notification"];

    if (this.props.status) {
      className.push(`notification--${this.props.status}`);
    }

    if (this.props.action) {
      setTimeout(
          () => {
            this.props.action();
          },
          this.props.timer || 1
      );
    }

    if (this.state.timer) {
      return (
          <div className={className.join(" ")}>
            {this.props.children}<br/>
            {this.state.timer}s.
          </div>
      );
    } else {
      return (
          <div className={className.join(" ")}>
            {this.props.children}
          </div>
      );
    }
  }
}

export default Notification;