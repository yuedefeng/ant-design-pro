import React, { PureComponent } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import { routerRedux } from 'dva/router';
import { Row, Col, Card, Form, Radio, Input, Button } from 'antd';
import RoleTable from '../../../components/RoleTable';
import PageHeaderLayout from '../../../layouts/PageHeaderLayout';
import styles from './role.less';

const FormItem = Form.Item;
const RadioGroup = Radio.Group;
@connect(state => ({
  sysrole: state.sysrole,
  resourcepermission: state.resourcepermission,
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
      type: 'sysrole/fetch',
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
        type: 'sysrole/fetch',
        payload: params,
      }).then(() => {
        this.setCustomState(params);
      });
    });
  };
  handleNewClick = () => {
    const { dispatch } = this.props;
    dispatch(routerRedux.push('/system/role/edit'));
  };
  renderSimpleForm() {
    const { getFieldDecorator } = this.props.form;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 4, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="类别">
              {getFieldDecorator('category', {
                rules: [{ message: '请选择' }],
              })(
                <RadioGroup>
                  <Radio value="role">角色</Radio>
                  <Radio value="workgroup">工作组</Radio>
                </RadioGroup>
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="编码">
              {getFieldDecorator('code')(
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
    const { dispatch, sysrole: { loading: sysroleLoading, data } } = this.props;
    const columns = [
      {
        title: '类别',
        dataIndex: 'category',
        render: val => <span>{ val === 'role' ? '角色' : '工作组' }</span>,
        width: 130,
      },
      {
        title: '编码',
        dataIndex: 'code',
        width: 150,
      },
      {
        title: '角色姓名',
        dataIndex: 'realname',
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
        width: 140,
      },
      {
        title: '创建时间',
        dataIndex: 'createdDate',
        sorter: true,
        render: val => <span>{moment(val).format('YYYY-MM-DD HH:mm:ss')}</span>,
        width: 300,
      },
      {
        title: '最后修改人',
        dataIndex: 'lastModifiedBy',
        width: 180,
      },
      {
        title: '更新时间',
        dataIndex: 'lastModifiedDate',
        sorter: true,
        render: val => <span>{moment(val).format('YYYY-MM-DD HH:mm:ss')}</span>,
        width: 300,
      },
      {
        title: '是否启用',
        dataIndex: 'enabled',
        render: val => <span>{ val === 1 ? '是' : '否' }</span>,
        width: 150,
      },
      {
        title: '是否允许修改',
        dataIndex: 'allowEdit',
        render: val => <span>{ val === 1 ? '是' : '否' }</span>,
        width: 210,
      },
      {
        title: '是否允许删除',
        dataIndex: 'allowDelete',
        render: val => <span>{ val === 1 ? '是' : '否' }</span>,
        width: 240,
      },

    ];
    return (
      <PageHeaderLayout title="">
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>
              {this.renderSimpleForm()}
            </div>
            <RoleTable
              loading={sysroleLoading}
              data={data}
              columns={columns}
              scroll={{ x: 1300 }}
              isCustomerOp={false}
              dispatch={dispatch}
              queryList={this.state.queryList}
              setCustomState={this.setCustomState}
              preType="sysrole"
              prePath="/system/role"
              SetPath="/system/role"
            />
          </div>
        </Card>
      </PageHeaderLayout>
    );
  }
}
