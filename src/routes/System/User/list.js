import React, { PureComponent } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import { routerRedux } from 'dva/router';
import { Row, Col, Card, Form, Input, Button, DatePicker } from 'antd';
import UserTable from '../../../components/UserTable';
import PageHeaderLayout from '../../../layouts/PageHeaderLayout';

import styles from './style.less';

const FormItem = Form.Item;
const { RangePicker } = DatePicker;

@connect(state => ({
  sysuser: state.sysuser,
}))
@Form.create()
export default class list extends PureComponent {
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
      type: 'sysuser/fetch',
      payload: { ...this.state.queryList },
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
        type: 'sysuser/fetch',
        payload: params,
      }).then(() => {
        this.setCustomState(params);
      });
    });
  };

  handleNewClick = () => {
    const { dispatch } = this.props;
    dispatch(routerRedux.push('/system/user/edit'));
  };

  renderSimpleForm() {
    const { getFieldDecorator } = this.props.form;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 4, lg: 24, xl: 48 }}>
          <Col md={10} sm={24}>
            <FormItem label="创建日期">
              {getFieldDecorator('createTime')(
                <RangePicker style={{ width: 260 }} placeholder={['开始', '结束']} />
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="租户名称">
              {getFieldDecorator('companyName')(
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
        </Row>
      </Form>
    );
  }

  render() {
    const { dispatch, sysuser: { loading: sysuserLoading, data } } = this.props;
    const columns = [
      {
        title: '用户名',
        dataIndex: 'userName',
        width: 100,
      },
      {
        title: '姓名',
        dataIndex: 'realName',
        width: 150,
      },
      {
        title: '部门',
        dataIndex: 'department',
        width: 150,
      },
      {
        title: '工作组',
        dataIndex: 'workgroup',
        width: 150,
      },
      {
        title: '职务',
        dataIndex: 'title',
        width: 150,
      },
      {
        title: '职责',
        dataIndex: 'duty',
        width: 150,
      },
      {
        title: '创建时间',
        dataIndex: 'createdDate',
        sorter: true,
        render: val => <span>{moment(val).format('YYYY-MM-DD HH:mm:ss')}</span>,
        width: 220,
      },
      {
        title: '更新时间',
        dataIndex: 'lastModifiedDate',
        sorter: true,
        render: val => <span>{moment(val).format('YYYY-MM-DD HH:mm:ss')}</span>,
        width: 220,
      },
      {
        title: '描述',
        dataIndex: 'description',
        width: 220,
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
              loading={sysuserLoading}
              data={data}
              columns={columns}
              scroll={{ x: 1300 }}
              isCustomerOp={false}
              dispatch={dispatch}
              queryList={this.state.queryList}
              setCustomState={this.setCustomState}
              preType="user"
              prePath="/system/user"
              preSetPath="/system/config"
            />
          </div>
        </Card>
      </PageHeaderLayout>
    );
  }
}
