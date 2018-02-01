import React, { PureComponent } from 'react';
import { Row, Col, Card, Form, Button, Table, message, Menu, Dropdown, Icon, Modal, Radio } from 'antd';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import PageHeaderLayout from '../../../layouts/PageHeaderLayout';
import styles from './style.less';

const { confirm } = Modal;
@connect(state => ({
  sysmodule: state.sysmodule,
}))
@Form.create()
export default class sysmodule extends PureComponent {
  state = {
    treeData: [],
    queryList: {
      filterList: {},
    },
  };
  componentWillMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'sysmodule/getTree',
      payload: {
        ...(location.query),
      },
    });
  }
  componentDidMount() {
    const { dispatch } = this.props;
    this.getTreelist = (e) => {
      e.preventDefault();
      const { treeDate } = this.props;
      treeDate.validateFields((err, fieldsValue) => {
        if (err) return;
        const params = {
          filterList: { ...fieldsValue },
        };
        dispatch({
          type: 'sysmodule/getTree',
          payload: params,
        }).then((data) => {
          const pagination = { ...this.state.pagination };
          pagination.total = 200;
          this.setState({
            loading: false,
            treeData: data.results,
            pagination,
          });
          this.dataSource(params);
        });
      });
    };
  }
  setCustomState = (queryList) => {
    this.setState({
      ...this.state,
      queryList,
    });
  };
  handleSearch = (e) => {
    e.preventDefault();
    const { dispatch, form } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      const params = {
        filterList: { ...fieldsValue },
      };
      dispatch({
        type: 'sysmodule/fetch',
        payload: params,
      }).then(() => {
        this.setCustomState(params);
      });
    });
  };
  handleNewClick = () => {
    const { dispatch } = this.props;
    dispatch(routerRedux.push('/system/module/treeedit'));
  };
  handleTableClick = () => {
    const { dispatch } = this.props;
    dispatch(routerRedux.push('/system/module'));
  };
  handleMenuClick = (e) => {
    const { dispatch, queryList } = this.props;
    const opKey = e.key.split('_');

    switch (opKey[0]) {
      case 'edit':
        dispatch(routerRedux.push({
          pathname: '/system/module/treeedit',
          query: {
            id: opKey[1],
          },
        }));
        break;
      case 'createchildren':
        dispatch(routerRedux.push({
          pathname: '/system/module/treeedit',
          query: {
            parentID: opKey[1],
          },
        }));
        break;
      case 'delete':
        confirm({
          title: '删除确认?',
          content: '确定删除操作吗？',
          onOk: () => {
            dispatch({
              type: 'sysmodule/remove',
              payload: { id: opKey[1] },
              callback: (resp) => {
                if (resp.returnCode !== 200) {
                  Modal.warning({
                    title: '警告',
                    content: resp.returnMsg,
                    okText: '确定',
                  });
                } else {
                  dispatch({
                    type: 'sysmodule/getTree',
                    payload: { ...queryList },
                  });
                  message.success('删除成功');
                }
              },
            });
          },
        });
        break;
      default:
        break;
    }
  };

  renderSimpleForm() {
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 4, lg: 24, xl: 48 }}>
          <Col md={2} sm={16} style={{ textAlign: 'left' }}>
            <Button icon="plus" onClick={() => this.handleNewClick()}>新建</Button>
          </Col>
          <Radio.Group>
            <Radio.Button onClick={() => this.handleTableClick()}>表格</Radio.Button>
            <Radio.Button >树形</Radio.Button>
          </Radio.Group>
        </Row>
      </Form>
    );
  }

  render() {
    const { sysmodule: { customOp, scroll, loading, treeData } } = this.props;
    const menu = record => (
      <Menu onClick={this.handleMenuClick}>
        <Menu.Item key={`edit_${record.record.id}`}>编辑</Menu.Item>
        <Menu.Item key={`createchildren_${record.record.id}`}>添加子节点</Menu.Item>
        <Menu.Item key={`delete_${record.record.id}`}>删除</Menu.Item>
      </Menu>
    );

    const MoreBtn = record => (
      <Dropdown overlay={menu(record)} trigger={['click']}>
        <a className="ant-dropdown-link">
          操作 <Icon type="down" />
        </a>
      </Dropdown>
    );

    const columns = [
      {
        title: '父节点',
        dataIndex: 'fullName',
        key: 'fullName',
      },
      {
        title: '编码',
        dataIndex: 'code',
        width: '12%',
        key: 'code',
      },
      {
        title: '描述',
        dataIndex: 'description',
        width: '30%',
        key: 'description',
      },
      {
        title: '创建人',
        dataIndex: 'createdBy',
        width: '30%',
        key: 'createdBy',
      },
    ];

    const myColumns = [
      ...columns,
      {
        title: '操作',
        render: record => (
          <div>
            <MoreBtn record={record} />
          </div>
        ),
        fixed: 'right',
        width: 80,
      },
    ];
    return (
      <PageHeaderLayout title="">
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>
              {this.renderSimpleForm()}
            </div>
            <Table
              loading={loading}
              dataSource={treeData}
              rowKey={record => record.id}
              columns={customOp ? columns : myColumns}
              scroll={scroll}
              pagination={false}
              onChange={this.handleTableChange}
              preType="sysmodule"
              prePath="/system/module"
            />
          </div>
        </Card>
      </PageHeaderLayout>
    );
  }
}

