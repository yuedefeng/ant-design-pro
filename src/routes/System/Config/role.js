import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import { Form, Card, Button, Table } from 'antd';
import PageHeaderLayout from '../../../layouts/PageHeaderLayout';
import FooterToolbar from '../../../components/FooterToolbar';
import DescriptionList from '../../../components/DescriptionList';

const { Description } = DescriptionList;
const ButtonGroup = Button.Group;

@connect(state => ({
  sysuser: state.sysuser,
}))
@Form.create()
export default class role extends PureComponent {
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
    const dataSource = [{
      key: '1',
      name: '胡彦斌',
      age: 32,
      address: '西湖区湖底公园1号',
    }, {
      key: '2',
      name: '胡彦祖',
      age: 42,
      address: '西湖区湖底公园1号',
    }];

    const columns = [{
      title: '角色名称',
      dataIndex: 'name',
      key: 'name',
    }, {
      title: '描述',
      dataIndex: 'age',
      key: 'age',
    }];

    const actions = (
      <ButtonGroup>
        <Button onClick={this.configClick.bind(this, 'modules')}>模块访问权限</Button>
        <Button disabled>数据集权限</Button>
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
        title="归属角色"
        content={description}
        action={actions}
      >
        <Card bordered={false}>
          <Table dataSource={dataSource} columns={columns} />
        </Card>
        <FooterToolbar style={{ width: '100%' }}>
          <Button type="primary" htmlType="button" style={{ marginLeft: 25 }}>
            添加角色
          </Button>
          <Button htmlType="button" style={{ marginLeft: 15 }} onClick={() => this.goBackClick()}>
            返回
          </Button>
        </FooterToolbar>
      </PageHeaderLayout>
    );
  }
}
