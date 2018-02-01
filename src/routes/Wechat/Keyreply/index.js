import React, { PureComponent } from 'react';
import { Form } from 'antd';
import list from './list';
import edit from './edit';

@Form.create()
export default class keyreply extends PureComponent {
  getCurrentStep() {
    const { location } = this.props;
    const { pathname } = location;
    const pathList = pathname.split('/');
    switch (pathList[pathList.length - 1]) {
      case 'list': return 0;
      case 'edit': return 1;
      default: return 0;
    }
  }
  getCurrentComponent() {
    const componentMap = {
      0: list,
      1: edit,
    };
    return componentMap[this.getCurrentStep()];
  }
  render() {
    const { location } = this.props;
    const CurrentComponent = this.getCurrentComponent();
    return (
      <CurrentComponent location={location} />
    );
  }
}
