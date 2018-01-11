import React, { PureComponent } from 'react';
import { routerRedux } from 'dva/router';
import { Table, Menu, Icon, Dropdown, message, Modal, Divider } from 'antd';
import styles from './index.less';

const { confirm } = Modal;

class UserTable extends PureComponent {
  handleTableChange = (pagination, filtersArg, sorter) => {
    const { dispatch, preType, setCustomState, queryList } = this.props;
    const { filterList } = queryList;
    const curPage = (pagination && pagination.current) ? pagination.current : 1;
    const curSize = (pagination && pagination.pageSize) ? pagination.pageSize : 20;
    const sortResult = [];
    if (sorter && sorter.field) {
      sortResult.push({
        direction: sorter.order,
        sortProperty: sorter.field,
      });
      if (sorter.field !== 'id') {
        sortResult.push({
          direction: 'desc',
          sortProperty: 'id',
        });
      }
    } else {
      sortResult.push({
        direction: 'desc',
        sortProperty: 'id',
      });
    }

    const params = {
      filterList: { ...filterList },
      pageable: {
        page: curPage,
        size: curSize,
        sort: sortResult,
      },
    };

    dispatch({
      type: `${preType}/fetch`,
      payload: params,
    }).then(() => {
      setCustomState(params);
    });
  };

  handleSettingClick = (rowid) => {
    const { dispatch, preSetPath } = this.props;
    dispatch(routerRedux.push({
      pathname: `${preSetPath}/permission`,
      query: {
        id: rowid,
      },
    }));
  };

  handleMenuClick = (e) => {
    const { dispatch, queryList, preType, prePath } = this.props;
    const opKey = e.key.split('_');

    switch (opKey[0]) {
      case 'edit':
        dispatch(routerRedux.push({
          pathname: `${prePath}/edit`,
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
              type: `${preType}/remove`,
              payload: { id: opKey[1] },
            }).then(() => {
              dispatch({
                type: `${preType}/fetch`,
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

  render() {
    const { data: { list, pagination }, columns, customOp, scroll, loading } = this.props;

    const menu = record => (
      <Menu onClick={this.handleMenuClick}>
        <Menu.Item key={`edit_${record.record.id}`}>编辑</Menu.Item>
        <Menu.Item key={`password_${record.record.id}`}>设置密码</Menu.Item>
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

    const myColumns = [
      ...columns,
      {
        title: '操作',
        render: record => (
          <div>
            <a onClick={this.handleSettingClick.bind(this, record.id)}>配置</a>
            <Divider type="vertical" />
            <MoreBtn record={record} />
          </div>
        ),
        fixed: 'right',
        width: 125,
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
      <div className={styles.standardTable}>
        <Table
          loading={loading}
          rowKey={record => record.id}
          dataSource={list}
          columns={customOp ? columns : myColumns}
          scroll={scroll}
          pagination={paginationProps}
          onChange={this.handleTableChange}
        />
      </div>
    );
  }
}

export default UserTable;
