import React, { PureComponent } from 'react';
import { Row, Col, Card, Form, Input, Button, DatePicker, Table, Menu, Icon, Dropdown, message, Modal } from 'antd';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import PageHeaderLayout from '../../../layouts/PageHeaderLayout';
import styles from './style.less';

const FormItem = Form.Item;
const { RangePicker } = DatePicker;
const ButtonGroup = Button.Group;
const { confirm } = Modal;
@connect(state => ({
  permission: state.permission,
}))
@Form.create()
export default class permission extends PureComponent {
  state = {
    treeData: [],
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
      type: 'permission/getTree',
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
        type: 'permission/getTree',
        payload: params,
      }).then(() => {
        this.setCustomState(params);
      });
    });
  };
  handleNewClick = () => {
    const { dispatch } = this.props;
    dispatch(routerRedux.push('/system/permission/treeedit'));
  };
  list = () => {
    const { dispatch } = this.props;
    dispatch(routerRedux.push('/system/permission/list'));
  };

  handleMenuClick = (e) => {
    const { dispatch, queryList } = this.props;
    const opKey = e.key.split('_');
    switch (opKey[0]) {
      case 'edit':
        dispatch(routerRedux.push({
          pathname: 'system/permission/treeedit',
          query: {
            id: opKey[1],
          },
        }));
        break;
      case 'addChildren':
        dispatch(routerRedux.push({
          pathname: 'system/permission/treeedit',
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
              type: 'permission/removeTree',
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
                    type: 'permission/getTree',
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
    const { getFieldDecorator } = this.props.form;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 4, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="创建日期">
              {getFieldDecorator('createdDate')(
                <RangePicker style={{ width: 200 }} placeholder={['开始', '结束']} />
              )}
            </FormItem>
          </Col>
          <Col md={7} sm={24}>
            <FormItem label="编码">
              {getFieldDecorator('code')(
                <Input placeholder="请输入" />
              )}
            </FormItem>
          </Col>
          <Col md={2} sm={8} style={{ textAlign: 'right' }}>
            <Button type="primary" htmlType="submit">查询</Button>
          </Col>
          <Col md={2} sm={8} style={{ textAlign: 'left' }}>
            <Button icon="plus" onClick={() => this.handleNewClick()}>新建</Button>
          </Col>
          <Col md={5} sm={8} style={{ textAlign: 'right' }}>
            <ButtonGroup>
              <Button onClick={() => this.list()}>表格</Button>
              <Button >树型表格</Button>
            </ButtonGroup>
          </Col>
        </Row>
      </Form>
    );
  }
  render() {
    const { permission: { treeData } } = this.props;

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
        width: '10%',
        key: 'description',
      },
      // {
      //   title: '创建人',
      //   dataIndex: 'createdBy',
      //   width: 150,
      // },
      // {
      //   title: '是否有权限',
      //   dataIndex: 'isScope',
      //   render: val => <span>{val === 1 ? '是' : '否'}</span>,
      //   width: 180,
      // },
      {
        title: '是否禁用',
        dataIndex: 'enabled',
        render: val => <span>{val === 1 ? '是' : '否'}</span>,
        width: '12%',
        key: 'enabled',
      },
      {
        title: '允许编辑',
        dataIndex: 'allowEdit',
        render: val => <span>{val === 1 ? '是' : '否'}</span>,
        width: '12%',
        key: 'allowEdit',
      },
      {
        title: '允许删除',
        dataIndex: 'allowDelete',
        render: val => <span>{val === 1 ? '是' : '否'}</span>,
        width: '12%',
        key: 'allowDelete',
      },
      // {
      //   title: '创建时间',
      //   dataIndex: 'createdDate',
      //   sorter: true,
      //   render: val => <span>{moment(val).format('YYYY-MM-DD HH:mm:ss')}</span>,
      //   width: 280,
      // },
      // {
      //   title: '最后更新时间',
      //   dataIndex: 'lastModifiedDate',
      //   sorter: true,
      //   render: val => <span>{moment(val).format('YYYY-MM-DD HH:mm:ss')}</span>,
      //   width: 300,
      // },
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
    const menu = record => (
      <Menu onClick={this.handleMenuClick}>
        <Menu.Item key={`edit_${record.record.id}`}>编辑</Menu.Item>
        <Menu.Item key={`addChildren_${record.record.id}`}>添加子节点</Menu.Item>
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
            />
          </div>
        </Card>
      </PageHeaderLayout>
    );
  }
}

