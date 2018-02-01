import React, { PureComponent } from 'react';
import moment from 'moment';
import { Row, Col, Card, Form, Input, Button, DatePicker } from 'antd';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import PageHeaderLayout from '../../../layouts/PageHeaderLayout';
import CommonTable from '../../../components/CommonTable';
import styles from './style.less';

const FormItem = Form.Item;
const { RangePicker } = DatePicker;
const ButtonGroup = Button.Group;
@connect(state => ({
  permission: state.permission,
}))
@Form.create()
export default class permission extends PureComponent {
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
      type: 'permission/fetch',
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
        type: 'permission/fetch',
        payload: params,
      }).then(() => {
        this.setCustomState(params);
      });
    });
  };
  handleNewClick = () => {
    const { dispatch } = this.props;
    dispatch(routerRedux.push('/system/permission/edit'));
  };
  treeTable = () => {
    const { dispatch } = this.props;
    dispatch(routerRedux.push('/system/permission/treelist'));
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
              <Button>表格</Button>
              <Button onClick={() => this.treeTable()}>树型表格</Button>
            </ButtonGroup>
          </Col>
        </Row>
      </Form>
    );
  }
  render() {
    const { dispatch, permission: { loading: permissionLoading, data } } = this.props;

    const columns = [
      {
        title: '用户名ID',
        dataIndex: 'parentID',
        width: 150,
      },
      {
        title: '全称',
        dataIndex: 'fullName',
        width: 150,
      },
      {
        title: '编码',
        dataIndex: 'code',
        width: 150,
      },
      {
        title: '描述',
        dataIndex: 'description',
        width: 150,
      },
      {
        title: '创建人',
        dataIndex: 'createdBy',
        width: 150,
      },
      {
        title: '是否有权限',
        dataIndex: 'isScope',
        render: val => <span>{val === 1 ? '是' : '否'}</span>,
        width: 180,
      },
      {
        title: '是否禁用',
        dataIndex: 'enabled',
        render: val => <span>{val === 1 ? '是' : '否'}</span>,
        width: 150,
      },
      {
        title: '允许编辑',
        dataIndex: 'allowEdit',
        render: val => <span>{val === 1 ? '是' : '否'}</span>,
        width: 150,
      },
      {
        title: '允许删除',
        dataIndex: 'allowDelete',
        render: val => <span>{val === 1 ? '是' : '否'}</span>,
        width: 150,
      },
      {
        title: '创建时间',
        dataIndex: 'createdDate',
        sorter: true,
        render: val => <span>{moment(val).format('YYYY-MM-DD HH:mm:ss')}</span>,
        width: 280,
      },
      {
        title: '最后更新时间',
        dataIndex: 'lastModifiedDate',
        sorter: true,
        render: val => <span>{moment(val).format('YYYY-MM-DD HH:mm:ss')}</span>,
        width: 280,
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
              loading={permissionLoading}
              data={data}
              columns={columns}
              scroll={{ x: 1300 }}
              isCustomerOp={false}
              dispatch={dispatch}
              queryList={this.state.queryList}
              setCustomState={this.setCustomState}
              preType="permission"
              prePath="/system/permission"
            />
          </div>
        </Card>
      </PageHeaderLayout>
    );
  }
}

