import React, { PureComponent } from 'react';
import { Form } from 'antd';
import limit from './list';
import edit from './edit';
import treelist from './treelist';
import treeedit from './treeedit';

@Form.create()
export default class Limit extends PureComponent {
  getCurrentStep() {
    const { location } = this.props;
    const { pathname } = location;
    const pathList = pathname.split('/');
    switch (pathList[pathList.length - 1]) {
      case 'limit': return 0;
      case 'edit': return 1;
      case 'treelist': return 2;
      case 'treeedit': return 3;
      default: return 0;
    }
  }
  getCurrentComponent() {
    const componentMap = {
      0: limit,
      1: edit,
      2: treelist,
      3: treeedit,
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
