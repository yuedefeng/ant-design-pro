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
  sysmodule: state.sysmodule,
}))
@Form.create()

export default class modules extends PureComponent {
  componentWillMount() {
    const { dispatch, location } = this.props;
    dispatch({
      type: 'sysmodule/getTree',
      payload: {
        ...(location.query),
      },
    });
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
    const { sysmodule: { treeData } } = this.props;
    const loop = (data) => {
      return data.map((item) => {
        if (item.children && item.children.length > 0) {
          return <TreeNode key={item.id} title={item.fullName}>{loop(item.children)}</TreeNode>;
        }
        return <TreeNode key={item.id} title={item.fullName} />;
      });
    };
    const actions = (
      <ButtonGroup>
        <Button disabled>数据集权限</Button>
        <Button onClick={this.configClick.bind(this, 'role')}>归属角色</Button>
        <Button onClick={this.configClick.bind(this, 'permission')}>操作权限</Button>
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
          { treeData ? <Tree>{ loop(treeData) }</Tree> : 'loading tree' }
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
