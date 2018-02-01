import React, { PureComponent } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import { routerRedux } from 'dva/router';
import { Row, Col, Card, Form, Input, Button } from 'antd';
import UserTable from '../../../components/OrganizeTable';
import PageHeaderLayout from '../../../layouts/PageHeaderLayout';

import styles from './style.less';

const ButtonGroup = Button.Group;
const FormItem = Form.Item;

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
      type: 'organize/fetch',
      payload: { ...this.state.queryList },
    });
  }
  setCustomState = (queryList) => {
    this.setState({
      ...this.state,
      queryList,
    });
  };
  handleClick = () => {
    const { dispatch } = this.props;
    dispatch(routerRedux.push('/system/organize/list'));
  };
  handleTree = () => {
    const { dispatch } = this.props;
    dispatch(routerRedux.push('/system/organize/treeTable'));
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
        type: 'organize/fetch',
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
          {/* <Col md={10} sm={24}> */}
          {/* <FormItem label="创建日期"> */}
          {/* {getFieldDecorator('createdDate')( */}
          {/* <RangePicker style={{ width: 260 }} placeholder={['开始', '结束']} /> */}
          {/* )} */}
          {/* </FormItem> */}
          {/* </Col> */}
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
              <Button onClick={() => this.handleClick()}>列表表格</Button>
              <Button onClick={() => this.handleTree()}>树形表格</Button>
            </ButtonGroup>
          </Col>
        </Row>
      </Form>
    );
  }

  render() {
    const { dispatch, organize: { loading: organizeLoading, data } } = this.props;
    const columns = [
      {
        title: '部门全称',
        dataIndex: 'fullName',
        width: 150,
      },
      {
        title: '类型',
        dataIndex: 'category',
        width: 150,
      },
      {
        title: '固定电话',
        dataIndex: 'outerPhone',
        width: 150,
      },
      {
        title: '移动电话',
        dataIndex: 'innerPhone',
        width: 150,
      },
      {
        title: '地址',
        dataIndex: 'address',
        width: 150,
      },
      {
        title: '后台通知地址',
        dataIndex: 'web',
        width: 170,
      },
      {
        title: '联系人',
        dataIndex: 'manager',
        width: 150,
      },
      {
        title: '是否可用',
        dataIndex: 'enabled',
        width: 150,
      },
      {
        title: '创建时间',
        dataIndex: 'createdDate',
        sorter: true,
        render: val => <span>{moment(val).format('YYYY-MM-DD HH:mm:ss')}</span>,
        width: 260,
      },
      {
        title: '更新时间',
        dataIndex: 'lastModifiedDate',
        sorter: true,
        render: val => <span>{moment(val).format('YYYY-MM-DD HH:mm:ss')}</span>,
        width: 260,
      },
    ];

    return (
      <PageHeaderLayout title="">
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>
              {this.renderSimpleForm()}
            </div>
            <UserTable
              loading={organizeLoading}
              data={data}
              columns={columns}
              scroll={{ x: 1300 }}
              isCustomerOp={false}
              dispatch={dispatch}
              queryList={this.state.queryList}
              setCustomState={this.setCustomState}
              preType="organize"
              prePath="/system/organize"
            />
          </div>
        </Card>
      </PageHeaderLayout>
    );
  }
}
