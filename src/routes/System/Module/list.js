import React, { PureComponent } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import { routerRedux } from 'dva/router';
import { Row, Col, Card, Form, Input, Button, DatePicker, Radio } from 'antd';
import CommonTable from '../../../components/CommonTable';
import PageHeaderLayout from '../../../layouts/PageHeaderLayout';
import styles from './style.less';

const FormItem = Form.Item;
const { RangePicker } = DatePicker;

@connect(state => ({
  sysmodule: state.sysmodule,
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
      type: 'sysmodule/fetch',
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
        type: 'sysmodule/fetch',
        payload: params,
      }).then(() => {
        this.setCustomState(params);
      });
    });
  };

  handleNewClick = () => {
    const { dispatch } = this.props;
    dispatch(routerRedux.push('/system/module/edit'));
  };
  handleTableClick = () => {
    const { dispatch } = this.props;
    dispatch(routerRedux.push('/system/module'));
  };
  handleTreeClick = () => {
    const { dispatch } = this.props;
    dispatch(routerRedux.push('/system/module/treetable'));
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
            <FormItem label="全称">
              {getFieldDecorator('fullName')(
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
            <Radio.Group>
              <Radio.Button>表格</Radio.Button>
              <Radio.Button onClick={() => this.handleTreeClick()}>树形</Radio.Button>
            </Radio.Group>
          </Col>
        </Row>
      </Form>
    );
  }
  render() {
    const { dispatch, sysmodule: { loading: sysmoduelLoading, data } } = this.props;
    const columns = [
      {
        title: '全称',
        dataIndex: 'fullName',
        width: 100,
      },
      {
        title: '导航Url',
        dataIndex: 'navigateUrl',
        width: 150,
      },
      {
        title: '分类编码',
        dataIndex: 'sortCode',
        width: 150,
      },
      {
        title: '创建人',
        dataIndex: 'createdBy',
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
        title: '描述',
        dataIndex: 'description',
        width: 220,
      },
      {
        title: '允许编辑',
        dataIndex: 'allowEdit',
        render: val => <span>{ val === 1 ? '是' : '否'}</span>,
        width: 150,
      },
      {
        title: '允许删除',
        dataIndex: 'allowDelete',
        render: val => <span>{ val === 1 ? '是' : '否'}</span>,
        width: 150,
      },
    ];
    return (
      <PageHeaderLayout title="">
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>
              {this.renderSimpleForm()}
            </div>
            <CommonTable
              loading={sysmoduelLoading}
              data={data}
              columns={columns}
              scroll={{ x: 1300 }}
              isCustomerOp={false}
              dispatch={dispatch}
              queryList={this.state.queryList}
              setCustomState={this.setCustomState}
              preType="sysmodule"
              prePath="/system/module"
            />
          </div>
        </Card>
      </PageHeaderLayout>
    );
  }
}
