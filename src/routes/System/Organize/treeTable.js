import React, { PureComponent } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import { routerRedux } from 'dva/router';
import { Row, Col, Modal, message, Card, Form, Input, Button, Table, Divider, Menu, Dropdown, Icon } from 'antd';
import PageHeaderLayout from '../../../layouts/PageHeaderLayout';
import styles from './style.less';

const ButtonGroup = Button.Group;
const FormItem = Form.Item;
const { confirm } = Modal;
@connect(state => ({
  organize: state.organize,
}))

@Form.create()
export default class organize extends PureComponent {
  state = {
    queryList: {
      filterList: {},
      pageable: {
        page: 1,
        size: 10,
        sort: [{
          direction: 'desc',
          sortProperty: 'id',
        }],
      },
    },
  };
  componentWillMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'organize/getTree',
      payload: {
        ...(location.query),
      },
    });
  }
  setCustomState = (queryList) => {
    this.setState({
      ...this.state,
      queryList,
    });
  };
  handleTreeClick = () => {
    const { dispatch } = this.props;
    dispatch(routerRedux.push('/system/organize/list'));
  };
  handleMenuClick = (e) => {
    const { dispatch, queryList } = this.props;
    const opKey = e.key.split('_');

    switch (opKey[0]) {
      case 'edit':
        dispatch(routerRedux.push({
          pathname: '/system/organize/treeEdit',
          query: {
            id: opKey[1],
          },
        }));
        break;
      case 'delete':
        confirm({
          title: '删除确认?',
          content: '确定删除操作吗？',
          onOk: () => {
            dispatch({
              type: 'organize/removeTree',
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
                    type: 'organize/getTree',
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
  handleTree = () => {
    const { dispatch } = this.props;
    dispatch(routerRedux.push('/system/organize/edit'));
  };
  handleSearch = (e) => {
    e.preventDefault();
    const { dispatch, form } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      const { pageable } = this.state.queryList;
      const params = {
        filterList: { ...fieldsValue },
        pageable: {
          ...pageable,
          page: 1,
        },
      };
      dispatch({
        type: 'organize/getTree',
        payload: params,
      }).then(() => {
        this.setCustomState(params);
      });
    });
  };

  handleNewClick = () => {
    const { dispatch } = this.props;
    dispatch(routerRedux.push('/system/organize/edit'));
  };
  renderSimpleForm() {
    const { getFieldDecorator } = this.props.form;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 4, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="部门名称">
              {getFieldDecorator('fullName')(
                <Input placeholder="请输入" />
              )}
            </FormItem>
          </Col>
          <Col md={2} sm={12} style={{ textAlign: 'right' }}>
            <Button type="primary" htmlType="submit">查询</Button>
          </Col>
          <Col md={4} sm={12} style={{ textAlign: 'left' }}>
            <Button icon="plus" onClick={() => this.handleNewClick()}>新建</Button>
          </Col>
          <Col md={6} sm={40} style={{ textAlign: 'right' }}>
            <ButtonGroup>
              <Button onClick={() => this.handleTreeClick()}>列表表格</Button>
              <Button onClick={() => this.handleTree()}>树形表格</Button>
            </ButtonGroup>
          </Col>
        </Row>
      </Form>
    );
  }
  render() {
    const { organize: { treeData } } = this.props;
    const menu = record => (
      <Menu onClick={this.handleMenuClick}>
        <Menu.Item key={`edit_${record.record.id}`}>编辑</Menu.Item>
        <Menu.Item key={`delete_${record.record.id}`}>删除</Menu.Item>
      </Menu>
    );
    const MoreBtn = record => (
      <Dropdown overlay={menu(record)} trigger={['click']}>
        <a className="ant-dropdown-link">
          更多 <Icon type="down" />
        </a>
      </Dropdown>
    );
    // const rowSelection = {
    //   onChange: (selectedRowKeys, selectedRows) => {
    //     console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
    //   },
    //   onSelect: (record, selected, selectedRows) => {
    //     console.log(record, selected, selectedRows);
    //   },
    //   onSelectAll: (selected, selectedRows, changeRows) => {
    //     console.log(selected, selectedRows, changeRows);
    //   },
    // };
    const columns = [
      {
        title: '部门全称',
        dataIndex: 'fullName',
        width: 300,
      },
      {
        title: '地址',
        dataIndex: 'address',
        width: 150,
      },
      {
        title: '固定电话',
        dataIndex: 'outerPhone',
        width: 150,
      },
      {
        title: '联系人',
        dataIndex: 'manager',
        width: 150,
      },
      {
        title: '是否可用',
        dataIndex: 'enabled',
        render: val => <span>{val === 1 ? '是' : '否'}</span>,
        width: 150,
      },
      {
        title: '创建时间',
        dataIndex: 'createdDate',
        sorter: true,
        render: val => <span>{moment(val).format('YYYY-MM-DD HH:mm:ss')}</span>,
        width: 300,
      },
      {
        title: '更新时间',
        dataIndex: 'lastModifiedDate',
        sorter: true,
        render: val => <span>{moment(val).format('YYYY-MM-DD HH:mm:ss')}</span>,
        width: 260,
      },
      {
        title: '操作',
        render: record => (
          <div>
            <Divider type="vertical" />
            <MoreBtn record={record} />
          </div>
        ),
        fixed: 'right',
        width: 125,
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
              columns={columns}
              dataSource={treeData}
              pagination={false}
              rowKey={record => record.id}
              preType="organize"
              prePath="/system/organize"
              preSetPath="/system/config"
            />
          </div>
        </Card>
      </PageHeaderLayout>
    );
  }
}
