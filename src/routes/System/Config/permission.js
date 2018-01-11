import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import { Form, Card, Button, Tree } from 'antd';
import PageHeaderLayout from '../../../layouts/PageHeaderLayout';
import FooterToolbar from '../../../components/FooterToolbar';
import DescriptionList from '../../../components/DescriptionList';

const { TreeNode } = Tree;
const { Description } = DescriptionList;
const ButtonGroup = Button.Group;

@connect(state => ({
  sysuser: state.sysuser,
}))
@Form.create()
export default class permission extends PureComponent {
  state = {
    entityId: null,
  };

  componentWillMount() {
    const { dispatch, location } = this.props;
    if (location.query && location.query.id) {
      this.setState({
        entityId: location.query.id,
      });
      dispatch({
        type: 'sysuser/get',
        payload: {
          ...(location.query),
        },
      });
    } else {
      dispatch({
        type: 'sysuser',
      });
    }
  }

  goBackClick = () => {
    const { dispatch } = this.props;
    dispatch(routerRedux.push('/system/user'));
  };

  configClick = (pathType) => {
    const { dispatch } = this.props;
    dispatch(routerRedux.push({
      pathname: `/system/config/${pathType}`,
      query: {
        id: this.state.entityId,
      },
    }));
  };

  render() {
    const { sysuser: { entity } } = this.props;
    const actions = (
      <ButtonGroup>
        <Button onClick={this.configClick.bind(this, 'modules')}>模块访问权限</Button>
        <Button disabled>数据集权限</Button>
        <Button onClick={this.configClick.bind(this, 'role')}>归属角色</Button>
      </ButtonGroup>
    );
    const description = (
      <DescriptionList size="small" col="3">
        <Description term="用户名">{entity != null ? entity.userName : ''}</Description>
        <Description term="真实姓名">{entity != null ? entity.realName : ''}</Description>
        <Description term="默认角色">{entity != null ? entity.roleId : ''}</Description>
      </DescriptionList>
    );

    return (
      <PageHeaderLayout
        title="操作权限"
        content={description}
        action={actions}
      >
        <Card bordered={false}>
          <Tree
            checkable
            defaultExpandedKeys={['0-0-0', '0-0-1']}
            defaultSelectedKeys={['0-0-0', '0-0-1']}
            defaultCheckedKeys={['0-0-0', '0-0-1']}
            onSelect={this.onSelect}
            onCheck={this.onCheck}
          >
            <TreeNode title="parent 1" key="0-0">
              <TreeNode title="parent 1-0" key="0-0-0" disabled>
                <TreeNode title="leaf" key="0-0-0-0" disableCheckbox />
                <TreeNode title="leaf" key="0-0-0-1" />
              </TreeNode>
              <TreeNode title="parent 1-1" key="0-0-1">
                <TreeNode title={<span style={{ color: '#1890ff' }}>sss</span>} key="0-0-1-0" />
              </TreeNode>
            </TreeNode>
          </Tree>
        </Card>
        <FooterToolbar style={{ width: '100%' }}>
          <Button type="primary" htmlType="submit">
            提交
          </Button>
          <Button htmlType="button" style={{ marginLeft: 15 }} onClick={() => this.goBackClick()}>
            返回
          </Button>
        </FooterToolbar>
      </PageHeaderLayout>
    );
  }
}
