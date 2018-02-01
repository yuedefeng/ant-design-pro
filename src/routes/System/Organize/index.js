import React, { PureComponent } from 'react';
import { Form } from 'antd';
import list from './list';
import edit from './edit';
import treeTable from './treeTable';
import treeEdit from './treeEdit';

@Form.create()
export default class Organize extends PureComponent {
  getCurrentStep() {
    const { location } = this.props;
    const { pathname } = location;
    const pathList = pathname.split('/');
    switch (pathList[pathList.length - 1]) {
      case 'list': return 0;
      case 'edit': return 1;
      case 'treeTable': return 2;
      case 'treeEdit': return 3;
      default: return 0;
    }
  }
  getCurrentComponent() {
    const componentMap = {
      0: list,
      1: edit,
      2: treeTable,
      3: treeEdit,
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
