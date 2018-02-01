import React, { PureComponent } from 'react';
import { Row, Col, Card, Form, Button, Table, Menu, Icon, Dropdown, message, Modal } from 'antd';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import PageHeaderLayout from '../../../layouts/PageHeaderLayout';
import styles from './style.less';

const { confirm } = Modal;

@connect(state => ({
  keyreply: state.keyreply,
}))
@Form.create()
export default class keyreply extends PureComponent {
  state = {
    queryList: {
      filterList: {},
      pageable: {
        page: 1,
        size: 10,
        sort: [{
          direction: 'asc',
          sortProperty: 'ordnum',
        }],
      },
    },
  };
  componentWillMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'keyreply/fetch',
      payload: { ...this.state.queryList },
    });
  }
  // setCustomState = (queryList) => {
  //   this.setState({
  //     ...this.state,
  //     queryList,
  //   });
  // };
  // handleSearch = (e) => {
  //   e.preventDefault();
  //   const { dispatch, form } = this.props;
  //   form.validateFields((err, fieldsValue) => {
  //     if (err) return;
  //     const { pageable } = this.state.queryList;
  //     const params = {
  //       filterList: { ...fieldsValue },
  //       pageable: {
  //         ...pageable,
  //         page: 1,
  //       },
  //     };
  //     dispatch({
  //       type: 'keyreply/fetch',
  //       payload: params,
  //     }).then(() => {
  //       this.setCustomState(params);
  //     });
  //   });
  // };
  handleEditClick = () => {
    const { dispatch } = this.props;
    dispatch(routerRedux.push('/wechat/keyreply/edit'));
  };

  handleMenuClick = (e) => {
    const { dispatch, queryList } = this.props;
    const opKey = e.key.split('_');
    switch (opKey[0]) {
      case 'edit':
        dispatch(routerRedux.push({
          pathname: '/wechat/keyreply/edit',
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
              type: 'keyreply/remove',
              payload: { id: opKey[1] },
            }).then(() => {
              dispatch({
                type: 'keyreply/fetch',
                payload: { ...queryList },
              });
              message.success('删除成功');
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
          <Col md={2} sm={8} style={{ textAlign: 'left' }}>
            <Button type="primary" icon="plus" onClick={() => this.handleEditClick()}>添加关键字</Button>
          </Col>
        </Row>
      </Form>
    );
  }
  render() {
    const { dispatch, keyreply: { loading: keyreplyLoading, data, pagination } } = this.props;
    const menu = record => (
      <Menu onClick={this.handleMenuClick}>
        <Menu.Item key={`edit_${record.record.id}`}><Icon type="edit" />编辑</Menu.Item>
        <Menu.Item key={`delete_${record.record.id}`}><Icon type="delete" />删除</Menu.Item>
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
        title: '排序',
        dataIndex: 'ordnum',
        width: '10%',
      },
      {
        title: '关键字',
        dataIndex: 'title',
        width: '10',
      },
      {
        title: '回复类型',
        dataIndex: 'replyType',
        render: val => <span>{ val === 1 ? '关闭' : val === 2 ? '文本回复' : '图片素材' }</span>,
        width: '10',
      },
      {
        title: '回复内容',
        dataIndex: 'replyText',
        width: '10',
      },
      {
        title: '匹配方式',
        dataIndex: 'matchtype',
        render: val => <span>{ val === 1 ? '模糊匹配' : '完全匹配'}</span>,
        width: '10',
      },
      {
        title: '状态',
        dataIndex: 'islock',
        render: val => <span>{ val === 1 ? '启用' : '锁定'}</span>,
        width: '10',
      },
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
    const showTotal = (total, range) => {
      return `${range[0]}-${range[1]},总共 ${total} 条`;
    };
    const paginationProps = {
      showSizeChanger: true,
      showQuickJumper: true,
      showTotal,
      ...pagination,
    };
    return (
      <PageHeaderLayout title="">
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>
              {this.renderSimpleForm()}
            </div>
            <Table
              loading={keyreplyLoading}
              dataSource={data.list}
              columns={columns}
              dispatch={dispatch}
              scroll={{ x: 1300 }}
              rowKey={record => record.id}
              queryList={this.state.queryList}
              pagination={paginationProps}
              setCustomState={this.setCustomState}
            />
          </div>
        </Card>
      </PageHeaderLayout>
    );
  }
}

