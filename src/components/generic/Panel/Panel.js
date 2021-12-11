import { Component } from 'react';
import './Panel.scss';

class Panel extends Component {
  render() {
    const { className } = this.props;
    return <div className={['relative rounded p-4', className].join(" ")}>{this.props.children}</div>;
  }
}

export default Panel;