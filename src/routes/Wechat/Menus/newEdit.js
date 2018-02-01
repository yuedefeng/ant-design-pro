import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import { Card, Form, Input, Button, message, Modal, Select, TreeSelect } from 'antd';
import PageHeaderLayout from '../../../layouts/PageHeaderLayout';

const FormItem = Form.Item;
const { Option } = Select;
const ButtonGroup = Button.Group;
const { TreeNode } = TreeSelect;


@connect(state => ({
  wechatmenu: state.wechatmenu,
}))
@Form.create()
export default class edit extends PureComponent {
  state = {
    entityId: null,
    renderVisibleForm: 0,
  };
  componentWillMount() {
    const { dispatch, location } = this.props;
    if (location.query && location.query.id) {
      this.setState({
        entityId: location.query.id,
      });
      dispatch({
        type: 'wechatmenu/get',
        payload: {
          ...(location.query),
        },
      });
    }
  }
  goBackClick = () => {
    const { dispatch } = this.props;
    dispatch(routerRedux.push('/wechat/menus'));
  };
  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      const saveValues = {
        ...values,
        id: null,
        replyId: this.state.entityId,
      };
      let dispatchType = 'wechatmenu/add';
      if (this.state.entityId != null && this.state.entityId > 0 && this.props.tag != null) {
        dispatchType = 'wechatmenu/update';
      }
      if (!err) {
        this.props.dispatch({
          type: dispatchType,
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
              this.props.dispatch(routerRedux.push('/wechat/menus'));
            }
          },
        });
      }
    });
  };
  handleChange = (value) => {
    if (value === 2) {
      this.setState({
        renderVisibleForm: 2,
      });
    } else if (value === 4) {
      this.setState({
        renderVisibleForm: 4,
      });
    } else if (value === 3) {
      this.setState({
        renderVisibleForm: 3,
      });
    } else if (value === 1) {
      this.setState({
        renderVisibleForm: 1,
      });
    } else {
      this.setState({
        renderVisibleForm: 0,
      });
    }
  }
  // checkUsernameRepeat = (rule, value, callback) => {
  //   this.props.dispatch({
  //     type: 'organize/checkRepeat',
  //     payload: value,
  //     callback: (resp) => {
  //       if (resp.returnData === false) {
  //         callback();
  //         return;
  //       }
  //       callback('此用户名已经存在！');
  //     },
  //   });
  // }
  showText() {
    const { getFieldDecorator } = this.props.form;
    const { wechatmenu: { treeData } } = this.props;

    const formItemLayout = {
      labelCol: { span: 5 },
      wrapperCol: { span: 15 },
    };
    const loop = (data) => {
      return data.map((item) => {
        if (item.children && item.children.length > 0) {
          return <TreeNode key={item.id} value={`${item.id}`} title={item.title}>{loop(item.children)}</TreeNode>;
        }
        return <TreeNode key={item.id} value={`${item.id}`} title={item.title} />;
      });
    };
    return (
      <Form
        onSubmit={this.handleSubmit}
        style={{ marginTop: 8 }}
      >
        <Card title="添加菜单" bordered={false} style={{ width: 1000, marginTop: 4 }}>
          <FormItem
            label="菜单名称"
            {...formItemLayout}
          >
            {getFieldDecorator('title', {
              rules: [{ required: true, message: '菜单名称不能为空！' }],
          })(
            <Input placeholder="请输入菜单名称" style={{ width: 400 }} />
          )}
          </FormItem>
          <FormItem
            label="父级菜单"
            {...formItemLayout}
          >
            {getFieldDecorator('followid', {
              // initialValue: entity != null ? entity.followid : '',
              rules: [{ required: true, message: '父级菜单不能为空！' }],
            })(
              treeData
                ? <TreeSelect style={{ width: 400 }} placeholder="请选择父级菜单" treeDefaultExpandAll >{ loop(treeData) }</TreeSelect>
                : <input />
            )}
          </FormItem>
          <FormItem
            label="菜单类型"
            {...formItemLayout}
          >
            {getFieldDecorator('replyType', {
              initialValue: 2,
            })(
              <Select
                style={{ width: 400 }}
                onSelect={this.handleChange}
              >
                <Option value={0}>请选择菜单类型</Option>
                <Option value={1}>作为一级菜单</Option>
                <Option value={2}>文本消息</Option>
                <Option value={3}>图文素材</Option>
                <Option value={4}>外链</Option>
              </Select>
              )}
          </FormItem>
          <FormItem
            label="消息内容"
            {...formItemLayout}
          >
            {getFieldDecorator('replyText', {
            })(
              <textarea rows={4} style={{ width: 400 }} />
              )}
          </FormItem>
          <FormItem
            label="排序"
            {...formItemLayout}
          >
            {getFieldDecorator('ordnum', {
              initialValue: '0',
            })(
              <Input placeholder="请输入菜单名称" style={{ width: 400 }} />
            )}
            <span className="ant-form-text" />
            <span className="ant-form-text"> 数字越小越靠前</span>
          </FormItem>
          <FormItem style={{ width: '100%', marginLeft: 300 }}>
            <Button type="primary" htmlType="submit" >
            提交
            </Button>
            <Button htmlType="button" style={{ marginLeft: 5 }} onClick={() => this.goBackClick()}>
            返回
            </Button>
          </FormItem>
        </Card>
      </Form>
    );
  }
  showBasic() {
    const { getFieldDecorator } = this.props.form;
    const formItemLayout = {
      labelCol: { span: 5 },
      wrapperCol: { span: 15 },
    };
    return (
      <Form
        onSubmit={this.handleSubmit}
        style={{ marginTop: 8 }}
      >
        <Card title="添加菜单" bordered={false} style={{ width: 1000, marginTop: 4 }}>
          <FormItem
            label="菜单名称"
            {...formItemLayout}
          >
            {getFieldDecorator('title', {
              rules: [{ required: true, message: '菜单名称不能为空！' }],
            })(
              <Input placeholder="请输入菜单名称" style={{ width: 400 }} />
            )}
          </FormItem>
          <FormItem
            label="菜单类型"
            {...formItemLayout}
          >
            <Select
              value={0}
              style={{ width: 400 }}
              onSelect={this.handleChange}
            >
              <Option value={0}>请选择菜单类型</Option>
              <Option value={1}>作为一级菜单</Option>
              <Option value={2}>文本消息</Option>
              <Option value={3}>图文素材</Option>
              <Option value={4}>外链</Option>
            </Select>
          </FormItem>
          <FormItem
            label="排序"
            {...formItemLayout}
          >
            {getFieldDecorator('ordnum', {
              initialValue: '0',
            })(
              <Input placeholder="请输入排序码" style={{ width: 400 }} />
            )}
            <span className="ant-form-text" />
            <span className="ant-form-text"> 数字越小越靠前</span>
          </FormItem>
          <FormItem style={{ width: '100%', marginLeft: 300 }}>
            <Button type="primary" htmlType="submit">
              提交
            </Button>
            <Button htmlType="button" style={{ marginLeft: 5 }} onClick={() => this.goBackClick()}>
              返回
            </Button>
          </FormItem>
        </Card>
      </Form>
    );
  }
  showFirstMenu() {
    const { getFieldDecorator } = this.props.form;
    const formItemLayout = {
      labelCol: { span: 5 },
      wrapperCol: { span: 15 },
    };
    return (
      <Form
        onSubmit={this.handleSubmit}
        style={{ marginTop: 8 }}
      >
        <Card title="添加菜单" bordered={false} style={{ width: 1000, marginTop: 4 }}>
          <FormItem
            label="菜单名称"
            {...formItemLayout}
          >
            {getFieldDecorator('title', {
              rules: [{ required: true, message: '菜单名称不能为空！' }],
            })(
              <Input placeholder="请输入菜单名称" style={{ width: 400 }} />
            )}
          </FormItem>
          <FormItem
            label="菜单类型"
            {...formItemLayout}
          >
            {getFieldDecorator('replyType', {
              initialValue: 1,
            })(
              <Select
                style={{ width: 400 }}
                onSelect={this.handleChange}
              >
                <Option value={0}>请选择菜单类型</Option>
                <Option value={1}>作为一级菜单</Option>
                <Option value={2}>文本消息</Option>
                <Option value={3}>图文素材</Option>
                <Option value={4}>外链</Option>
              </Select>
            )}
          </FormItem>
          <FormItem
            label="排序"
            {...formItemLayout}
          >
            {getFieldDecorator('ordnum', {
              initialValue: '0',
            })(
              <Input placeholder="请输入排序码" style={{ width: 400 }} />
            )}
            <span className="ant-form-text" />
            <span className="ant-form-text"> 数字越小越靠前</span>
          </FormItem>
          <FormItem style={{ width: '100%', marginLeft: 300 }}>
            <Button type="primary" htmlType="submit">
              提交
            </Button>
            <Button htmlType="button" style={{ marginLeft: 5 }} onClick={() => this.goBackClick()}>
              返回
            </Button>
          </FormItem>
        </Card>
      </Form>
    );
  }
  showImgAndText() {
    const { getFieldDecorator } = this.props.form;
    const { wechatmenu: { treeData } } = this.props;

    const formItemLayout = {
      labelCol: { span: 5 },
      wrapperCol: { span: 15 },
    };
    const loop = (data) => {
      return data.map((item) => {
        if (item.children && item.children.length > 0) {
          return <TreeNode key={item.id} value={`${item.id}`} title={item.title}>{loop(item.children)}</TreeNode>;
        }
        return <TreeNode key={item.id} value={`${item.id}`} title={item.title} />;
      });
    };
    return (
      <Form
        onSubmit={this.handleSubmit}
        style={{ marginTop: 8 }}
      >
        <Card title="添加菜单" bordered={false} style={{ width: 1000, marginTop: 4 }}>
          <FormItem
            label="菜单名称"
            {...formItemLayout}
          >
            {getFieldDecorator('title', {
              rules: [{ required: true, message: '菜单名称不能为空！' }],
            })(
              <Input placeholder="请输入菜单名称" style={{ width: 400 }} />
            )}
          </FormItem>
          <FormItem
            label="父级菜单"
            {...formItemLayout}
          >
            {getFieldDecorator('followid', {
              // initialValue: entity != null ? entity.followid : '',
              rules: [{ required: true, message: '父级菜单不能为空！' }],
            })(
              treeData
                ? <TreeSelect style={{ width: 400 }} placeholder="请选择父级菜单" treeDefaultExpandAll >{ loop(treeData) }</TreeSelect>
                : <input />
            )}
          </FormItem>
          <FormItem
            label="菜单类型"
            {...formItemLayout}
          >
            {getFieldDecorator('replyType', {
              initialValue: 3,
            })(
              <Select
                style={{ width: 400 }}
                onSelect={this.handleChange}
              >
                <Option value={0}>请选择菜单类型</Option>
                <Option value={1}>作为一级菜单</Option>
                <Option value={2}>文本消息</Option>
                <Option value={3}>图文素材</Option>
                <Option value={4}>外链</Option>
              </Select>
            )}
          </FormItem>
          <FormItem
            label="素材选择"
            {...formItemLayout}
          >
            <ButtonGroup>
              <Button type="primary" >
                选择素材
              </Button>
              <Button type="primary" >
                清空素材
              </Button>
            </ButtonGroup>
          </FormItem>
          <FormItem
            label="排序"
            {...formItemLayout}
          >
            {getFieldDecorator('ordnum', {
              initialValue: '0',
            })(
              <Input placeholder="请输入菜单名称" style={{ width: 400 }} />
            )}
            <span className="ant-form-text" />
            <span className="ant-form-text"> 数字越小越靠前</span>
          </FormItem>
          <FormItem style={{ width: '100%', marginLeft: 300 }}>
            <Button type="primary" htmlType="submit" >
              提交
            </Button>
            <Button htmlType="button" style={{ marginLeft: 5 }} onClick={() => this.goBackClick()}>
              返回
            </Button>
          </FormItem>
        </Card>
      </Form>
    );
  }
  showLink() {
    const { getFieldDecorator } = this.props.form;
    const { wechatmenu: { treeData } } = this.props;

    const formItemLayout = {
      labelCol: { span: 5 },
      wrapperCol: { span: 15 },
    };
    const loop = (data) => {
      return data.map((item) => {
        if (item.children && item.children.length > 0) {
          return <TreeNode key={item.id} value={`${item.id}`} title={item.title}>{loop(item.children)}</TreeNode>;
        }
        return <TreeNode key={item.id} value={`${item.id}`} title={item.title} />;
      });
    };
    return (
      <Form
        onSubmit={this.handleSubmit}
        style={{ marginTop: 8 }}
      >
        <Card title="添加菜单" bordered={false} style={{ width: 1000, marginTop: 4 }}>
          <FormItem
            label="菜单名称"
            {...formItemLayout}
          >
            {getFieldDecorator('title', {
              rules: [{ required: true, message: '菜单名称不能为空！' }],
            })(
              <Input placeholder="请输入菜单名称" style={{ width: 400 }} />
            )}
          </FormItem>
          <FormItem
            label="父级菜单"
            {...formItemLayout}
          >
            {getFieldDecorator('followid', {
              // initialValue: entity != null ? entity.followid : '',
              rules: [{ required: true, message: '父级菜单不能为空！' }],
            })(
              treeData
                ? <TreeSelect style={{ width: 400 }} placeholder="请选择父级菜单" treeDefaultExpandAll >{ loop(treeData) }</TreeSelect>
                : <input />
            )}
          </FormItem>
          <FormItem
            label="菜单类型"
            {...formItemLayout}
          >
            {getFieldDecorator('replyType', {
              initialValue: 4,
            })(
              <Select
                style={{ width: 400 }}
                onSelect={this.handleChange}
              >
                <Option value={0}>请选择菜单类型</Option>
                <Option value={1}>作为一级菜单</Option>
                <Option value={2}>文本消息</Option>
                <Option value={3}>图文素材</Option>
                <Option value={4}>外链</Option>
              </Select>
            )}
          </FormItem>
          <FormItem
            label="链接网址"
            {...formItemLayout}
          >
            {getFieldDecorator('replyUrl', {
              rules: [{ required: true, message: '菜单名称不能为空！' }],
            })(
              <Input placeholder="" style={{ width: 400 }} />
            )}
          </FormItem>
          <FormItem
            label="排序"
            {...formItemLayout}
          >
            {getFieldDecorator('ordnum', {
              initialValue: '0',
            })(
              <Input placeholder="请输入菜单名称" style={{ width: 400 }} />
            )}
            <span className="ant-form-text" />
            <span className="ant-form-text"> 数字越小越靠前</span>
          </FormItem>
          <FormItem style={{ width: '100%', marginLeft: 300 }}>
            <Button type="primary" htmlType="submit" >
              提交
            </Button>
            <Button htmlType="button" style={{ marginLeft: 5 }} onClick={() => this.goBackClick()}>
              返回
            </Button>
          </FormItem>
        </Card>
      </Form>
    );
  }
  renderForm() {
    if (this.state.renderVisibleForm === 0) {
      return this.showBasic();
    } else if (this.state.renderVisibleForm === 1) {
      return this.showFirstMenu();
    } else if (this.state.renderVisibleForm === 2) {
      return this.showText();
    } else if (this.state.renderVisibleForm === 3) {
      return this.showImgAndText();
    } else if (this.state.renderVisibleForm === 4) {
      return this.showLink();
    }
  }
  render() {
    return (
      <PageHeaderLayout>
        <div>
          {this.renderForm()}
        </div>
      </PageHeaderLayout>
    );
  }
}

