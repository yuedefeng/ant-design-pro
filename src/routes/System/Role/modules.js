import React, { PureComponent } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import { routerRedux } from 'dva/router';
import { Form, Card, Button, Tree, Modal, message } from 'antd';
import PageHeaderLayout from '../../../layouts/PageHeaderLayout';
import FooterToolbar from '../../../components/FooterToolbar';
import DescriptionList from '../../../components/DescriptionList';

const { TreeNode } = Tree;
const { Description } = DescriptionList;
const ButtonGroup = Button.Group;

@connect(state => ({
  sysrole: state.sysrole,
  sysmodule: state.sysmodule,
}))
@Form.create()

export default class modules extends PureComponent {
  state = {
    roleId: null,
    treeDatas: null,
    defaultCheckedKeys: null,
    checkedKeys: [],
  };
  componentWillMount() {
    const { dispatch, location } = this.props;

    if (location.query && location.query.id) {
      this.setState({
        roleId: location.query.id,
      });
      dispatch({
        type: 'sysmodule/getAllTargetId',
        payload: {
          ...(location.query),
        },
        callback: (res) => {
          this.setState({
            defaultCheckedKeys: res,
          });
        },
      });
      dispatch({
        type: 'sysmodule/getTree',
        payload: {
          ...(location.query),
        },
        callback: (res) => {
          this.setState({
            treeDatas: res,
          });
        },
      });
    }
  }

  onCheck = (checkedKeys) => {
    this.setState({
      checkedKeys,
    });
  };
  goBackClick = () => {
    const { dispatch } = this.props;
    dispatch(routerRedux.push('/system/role'));
  };
  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      const rolePermissionScopeList = [];
      this.state.checkedKeys.map((nodeKey) => {
        rolePermissionScopeList.push({
          resourceID: this.state.roleId,
          resourceCategory: 'Role',
          permissionId: '',
          lastModifiedDate: '',
          targetID: nodeKey,
          targetCategory: 'Module',
          description: '0',
          enabled: 1,
          createdBy: '',
          createdDate: moment(values.createdDate).format('YYYY-MM-DD'),
        });
        return true;
      });
      const saveValues = {
        ...values,
        roleId: this.state.roleId,
        baseResourcePermissionScopeDTOs: rolePermissionScopeList,
      };
      if (this.state.roleId != null && this.state.roleId <= 0) {
        Modal.warning({
          title: '警告',
          content: '角色不存在，不允许保存1！',
          okText: '确定',
        });
        return false;
      }
      if (!err) {
        this.props.dispatch({
          type: 'sysmodule/saveScope',
          payload: saveValues,
          callback: (resp) => {
            if (resp.returnCode !== 200) {
              Modal.warning({
                title: '警告',
                content: resp.returnMsg,
                okText: '确定',
              });
            } else {
              message.success('保存成功');
              this.props.dispatch(routerRedux.push('/system/role'));
            }
          },
        });
      }
    });
  };
  configClick = (pathType) => {
    const { dispatch } = this.props;
    dispatch(routerRedux.push({
      pathname: `/system/role/${pathType}`,
      query: {
        id: this.state.entityId,
      },
    }));
  };

  render() {
    const { sysrole: { entity } } = this.props;

    const loop = (data) => {
      return data.map((item) => {
        if (item.children && item.children.length > 0) {
          return <TreeNode key={item.id} title={`${item.fullName}_${item.id}`}>{loop(item.children)}</TreeNode>;
        }
        return <TreeNode key={item.id} title={`${item.fullName}_${item.id}`} />;
      });
    };

    const actions = (
      <ButtonGroup>
        <Button disabled >模块访问权限</Button>
        <Button onClick={this.configClick.bind(this, 'permissions')}>操作权限</Button>
      </ButtonGroup>
    );
    const description = entity ? (
      <DescriptionList size="small" col="3">
        <Description term="角色ID">{`${entity.id}`}</Description>
        <Description term="类别">{`${entity.category}`}</Description>
        <Description term="角色编码">{`${entity.code}`}</Description>
      </DescriptionList>
    ) : '';
    return (
      <PageHeaderLayout
        title="模块访问权限"
        content={description}
        action={actions}
      >
        <Card bordered={false}>
          <form onSubmit={this.handleSubmit}>
            { this.state.treeDatas && this.state.defaultCheckedKeys ?
              (
                <Tree
                  checkable
                  onCheck={this.onCheck}
                  defaultCheckedKeys={this.state.defaultCheckedKeys || []}
                  defaultExpandAll
                >{ loop(this.state.treeDatas) }
                </Tree>
              ) : 'loading tree' }
            <FooterToolbar style={{ width: '100%' }}>
              <Button type="primary" htmlType="submit">
                提交
              </Button>
              <Button htmlType="button" style={{ marginLeft: 15 }} onClick={() => this.goBackClick()}>
                返回
              </Button>
            </FooterToolbar>
          </form>
        </Card>
      </PageHeaderLayout>
    );
  }
}
