import React, { PureComponent } from 'react';
import { routerRedux } from 'dva/router';
import { connect } from 'dva';
import { Form, Button, Icon, Card, Table, Divider, Dropdown, Menu, message, Modal } from 'antd';
import PageHeaderLayout from '../../../layouts/PageHeaderLayout';
import EditTableCell from './editTableCell';
import styles from './style.less';

const { confirm } = Modal;


@connect(state => ({
  wechatmenu: state.wechatmenu,
}))
@Form.create()
export default class MaterialList extends PureComponent {
  state = {
    // selectedRowss: [],
  };
  componentWillMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'wechatmenu/getTree',
      payload: {
        ...(location.query),
      },
    });
  }
  handleNewClick= () => {
    const { dispatch } = this.props;
    dispatch(routerRedux.push({
      pathname: '/wechat/menus/newEdit',
    }));
  }
  handleReleaseWxMenu= () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'wechatmenu/releaseWxMenu',
      callback: (resp) => {
        if (resp.returnCode !== 200) {
          Modal.warning({
            title: '警告',
            content: resp.returnData,
            okText: '确定',
          });
        } else {
          message.success('发布成功');
          this.componentWillMount();
        }
      },
    });
  }
  handleMenuClick = (e) => {
    const { dispatch } = this.props;
    const opKey = e.key.split('_');
    switch (opKey[0]) {
      case 'edit':
        dispatch(routerRedux.push({
          pathname: '/wechat/menus/edit',
          query: {
            id: opKey[1],
          },
        }));
        break;
      case 'add':
        dispatch(routerRedux.push({
          pathname: '/wechat/menus/newEdit',
          query: {
            id: opKey[1],
            tab: 0,
          },
        }));
        break;
      case 'delete':
        confirm({
          title: '删除确认?',
          content: '确定删除操作吗？',
          onOk: () => {
            dispatch({
              type: 'wechatmenu/removeTree',
              payload: { id: opKey[1] },
              callback: (resp) => {
                if (resp.returnCode !== 200) {
                  Modal.warning({
                    title: '警告',
                    content: resp.returnMsg,
                    okText: '确定',
                  });
                } else {
                  message.success('删除成功');
                  this.componentWillMount();
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
  render() {
    const { wechatmenu: { treeData } } = this.props;
    const menu = record => (
      <Menu onClick={this.handleMenuClick}>
        <Menu.Item key={`add_${record.record.id}`}>添加子节点</Menu.Item>
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
    const onCellChange = (key, dataIndex) => {
      return (value) => {
        const target = treeData.find(item => item.key === key);
        if (target) {
          target[dataIndex] = value;
        }
      };
    };
    const columns = [
      {
        title: '排序',
        dataIndex: 'ordnum',
        width: 150,
        render: (text, record) => (
          <EditTableCell
            value={text}
            onChange={onCellChange(record.key, 'ordnum')}
          />
        ),
      },
      {
        title: '菜单Id',
        dataIndex: 'replyId',
        width: 150,
      },
      {
        title: '菜单名称',
        dataIndex: 'title',
        width: 250,
      },
      {
        title: '类型',
        dataIndex: 'replyType',
        render: val => <span>{val === 1 ? '一级菜单' : val === 2 ? '文本消息' : val === 3 ? '图文素材' : val === 4 ? '外链' : null}</span>,
        width: 300,
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
        width: 145,
      },
    ];
    // const rowSelection = {
    //   onSelect: (record, selected, selectedRows) => {
    //     this.setState({
    //       selectedRowss: selectedRows,
    //     });
    //   },
    // };
    const content = (
      <div className={styles.pageHeaderContent}>
        <div className={styles.contentLink}>
          <Button type="primary" style={{ margin: '0 8px 10px 10px' }} onClick={() => this.handleNewClick()} >
            <Icon type="plus" />添加菜单
          </Button>
          <Button type="primary" style={{ margin: '0 8px 10px 10px' }} onClick={() => this.handleReleaseWxMenu()}>
            <Icon type="file" />发布菜单
          </Button>
          <Button type="primary" style={{ margin: '0 8px 10px 10px' }} onClick={() => this.deleteMenuClick()}>
            <Icon type="delete" />删除菜单
          </Button>
        </div>
      </div>
    );
    return (
      <PageHeaderLayout content={content} >
        <Form>
          <Card bordered={false}>
            <div className={styles.tableList}>
              <div className={styles.tableListForm} />
              <Table
                defaultExpandAllRows
                // rowSelection={rowSelection}
                columns={columns}
                dataSource={treeData}
                pagination={false}
                rowKey={record => record.id}
                // onSelectRow={this.handleSelectRows}
                preType="wechatmenu"
                prePath="/wechat/menus"
              />
            </div>
            <Button type="primary" style={{ margin: '8px 8px 10px 10px' }} onClick={() => this.handleNewClick()} >
              保存排序
            </Button>
          </Card>
        </Form>
      </PageHeaderLayout>
    );
  }
}
