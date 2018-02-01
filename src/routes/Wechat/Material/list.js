import React, { PureComponent } from 'react';
import { routerRedux } from 'dva/router';
import { connect } from 'dva';
import { Form, Card, Button, Icon, List, Pagination } from 'antd';

import PageHeaderLayout from '../../../layouts/PageHeaderLayout';
import Ellipsis from '../../../components/Ellipsis';

import styles from './style.less';

@connect(state => ({
  wechatmp: state.wechatmp,
}))
@Form.create()
export default class MaterialList extends PureComponent {
  componentDidMount() {
    this.props.dispatch({
      type: 'wechatmp/fetch',
      payload: {
        offset: 0,
        pageSize: 20,
      },
    });
  }

  handleEditClick = () => {
    const { dispatch } = this.props;
    dispatch(routerRedux.push({
      pathname: '/wechat/material/edit',
    }));
  }

  render() {
    const { wechatmp: { loading, list } } = this.props;
    const content = (
      <div className={styles.pageHeaderContent}>
        <div className={styles.contentLink}>
          <Button type="primary" onClick={this.handleEditClick}>
            <Icon type="plus-circle-o" /> 新增素材
          </Button>
        </div>
      </div>
    );
    return (
      <PageHeaderLayout content={content}>
        <div className={styles.cardList}>
          <List
            rowKey="id"
            loading={loading}
            grid={{ gutter: 24, lg: 3, md: 2, sm: 1, xs: 1 }}
            dataSource={['', ...list]}
            renderItem={item => (item ? (
              <List.Item key={item.id}>
                <Card
                  hoverable
                  className={styles.card}
                  actions={[<a>修改</a>, <a>删除</a>]}
                >
                  <Card.Meta
                    avatar={<img alt="" className={styles.cardAvatar} src={item.avatar} />}
                    title={<a href="#">{item.title}</a>}
                    description={(
                      <Ellipsis className={styles.item} lines={3}>{item.description}</Ellipsis>
                      )}
                  />
                </Card>
              </List.Item>
              ) : (
                <List.Item>
                  <Button type="dashed" className={styles.newButton} onClick={this.handleEditClick}>
                    <Icon type="plus" /> 新增产品
                  </Button>
                </List.Item>
              )
            )}
          />
          <Pagination
            total={85}
            showTotal={(total, range) => `${range[0]}-${range[1]} of ${total} items`}
            pageSize={20}
            defaultCurrent={1}
          />
        </div>
      </PageHeaderLayout>
    );
  }
}
