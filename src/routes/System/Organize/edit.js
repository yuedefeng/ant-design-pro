import React, { PureComponent } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import { routerRedux } from 'dva/router';
import { Card, Form, DatePicker, Input, Radio, Button, message, Modal, TreeSelect } from 'antd';
import PageHeaderLayout from '../../../layouts/PageHeaderLayout';
import FooterToolbar from '../../../components/FooterToolbar';

const FormItem = Form.Item;
const RadioGroup = Radio.Group;
const { TreeNode } = TreeSelect;

@connect(state => ({
  organize: state.organize,
}))
@Form.create()
export default class edit extends PureComponent {
  state = {
    entityId: null,
  };

  componentWillMount() {
    const { dispatch, location } = this.props;
    dispatch({
      type: 'organize/getTree',
      payload: {
        ...(location.query),
      },
    });
    if (location.query && location.query.id) {
      this.setState({
        entityId: location.query.id,
      });
      dispatch({
        type: 'organize/get',
        payload: {
          ...(location.query),
        },
      });
    } else {
      dispatch({
        type: 'organize/new',
      });
    }
  }
  goBackClick = () => {
    const { dispatch } = this.props;
    dispatch(routerRedux.push('/system/organize'));
  };
  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      const saveValues = {
        ...this.props.organize.entity,
        ...values,
        id: this.state.entityId,
      };
      let dispatchType = 'organize/add';
      if (this.state.entityId != null && this.state.entityId > 0) {
        dispatchType = 'organize/update';
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
              this.props.dispatch(routerRedux.push('/system/organize'));
            }
          },
        });
      }
    });
  };

  checkUsernameRepeat = (rule, value, callback) => {
    this.props.dispatch({
      type: 'organize/checkRepeat',
      payload: value,
      callback: (resp) => {
        if (resp.returnData === false) {
          callback();
          return;
        }
        callback('此用户名已经存在！');
      },
    });
  }

  render() {
    const { organize: { entity, treeData } } = this.props;
    const { getFieldDecorator } = this.props.form;
    const formItemLayout = {
      labelCol: { span: 5 },
      wrapperCol: { span: 15 },
    };
    const loop = (data) => {
      return data.map((item) => {
        if (item.children && item.children.length > 0) {
          return <TreeNode key={item.id} value={`${item.id}`} title={item.fullName}>{loop(item.children)}</TreeNode>;
        }
        return <TreeNode key={item.id} value={`${item.id}`} title={item.fullName} />;
      });
    };
    return (
      <PageHeaderLayout title="">
        <Card bordered={false}>
          <Form
            onSubmit={this.handleSubmit}
            style={{ marginTop: 8 }}
          >
            <FormItem
              label="层级编码"
              {...formItemLayout}
            >
              {getFieldDecorator('code', {
                initialValue: entity != null ? entity.code : '',
                rules: [{ required: true, message: '层级编码不能为空！' }],
              })(
                <Input placeholder="请输入" />
              )}
            </FormItem>
            <FormItem
              label="父级部门"
              {...formItemLayout}
            >
              {getFieldDecorator('parentID', {
                initialValue: entity != null ? entity.parentID : '',
                rules: [{ required: true, message: '父级部门不能为空！' }],
              })(
                treeData
                  ? <TreeSelect placeholder="请选择树" treeDefaultExpandAll >{ loop(treeData) }</TreeSelect>
                  : <input />
              )}
            </FormItem>
            <FormItem
              label="部门名称"
              {...formItemLayout}
            >
              {getFieldDecorator('fullName', {
                initialValue: entity != null ? entity.fullName : '',
                rules: [{ required: true, message: '部门名称不能为空！' }],
              })(
                <Input placeholder="请输入" />
              )}
            </FormItem>
            <FormItem
              label="类型"
              {...formItemLayout}
            >
              {getFieldDecorator('category', {
                initialValue: entity != null ? entity.category : '',
                rules: [{ required: true, message: '类型' }],
              })(
                <Input placeholder="请输入" />
              )}
            </FormItem>
            <FormItem
              label="固定电话"
              {...formItemLayout}
            >
              {getFieldDecorator('outerPhone', {
                initialValue: entity != null ? entity.outerPhone : '',
                rules: [{ required: true, message: '固定电话' }],
              })(
                <Input placeholder="请输入" />
              )}
            </FormItem>
            <FormItem
              label="移动电话"
              {...formItemLayout}
            >
              {getFieldDecorator('innerPhone', {
                initialValue: entity != null ? entity.innerPhone : '',
                rules: [{ required: true, message: '移动电话' }],
              })(
                <Input placeholder="请输入" />
              )}
            </FormItem>
            <FormItem
              label="地址"
              {...formItemLayout}
            >
              {getFieldDecorator('address', {
                initialValue: entity != null ? entity.address : '',
                rules: [{ required: true, message: '地址' }],
              })(
                <Input placeholder="请输入" />
              )}
            </FormItem>
            <FormItem
              label="后台通知地址"
              {...formItemLayout}
            >
              {getFieldDecorator('web', {
                initialValue: entity != null ? entity.web : '',
                rules: [{ required: true, message: '后台通知地址' }],
              })(
                <Input placeholder="请输入" />
              )}
            </FormItem>
            <FormItem
              label="联系人"
              {...formItemLayout}
            >
              {getFieldDecorator('manager', {
                initialValue: entity != null ? entity.manager : '',
                rules: [{ required: true, message: '联系人' }],
              })(
                <Input placeholder="请输入" />
              )}
            </FormItem>
            <FormItem
              label="是否可用"
              {...formItemLayout}
            >
              {getFieldDecorator('enabled', {
                initialValue: entity != null ? entity.enabled : '',
                rules: [{ required: true, message: '是否可用' }],
              })(
                <RadioGroup>
                  <Radio value={1}>是</Radio>
                  <Radio value={0}>否</Radio>
                </RadioGroup>
              )}
            </FormItem>
            <FormItem
              label="组织"
              {...formItemLayout}
            >
              {getFieldDecorator('isInnerOrganize', {
                initialValue: entity != null ? entity.isInnerOrganize : '',
                rules: [{ required: true, message: '组织' }],
              })(
                <Input placeholder="请输入" />
              )}
            </FormItem>
            <FormItem
              label="创建时间"
              {...formItemLayout}
            >
              {getFieldDecorator('createdDate', {
                initialValue: entity && entity.createdDate ? moment(entity.createdDate, 'YYYY-MM-DD') : null,
                rules: [{ required: true, message: '创建时间' }],
              })(
                <DatePicker placeholder="创建时间" />
              )}
            </FormItem>
            {/* <FormItem */}
            {/* label="家庭住址" */}
            {/* {...formItemLayout} */}
            {/* > */}
            {/* {getFieldDecorator('homeAddress', { */}
            {/* initialValue: entity != null ? entity.homeAddress : '', */}
            {/* rules: [{ required: true, message: '家庭住址' }], */}
            {/* })( */}
            {/* <Input placeholder="请输入" /> */}
            {/* )} */}
            {/* </FormItem> */}
            <FooterToolbar style={{ width: '100%' }}>
              <Button type="primary" htmlType="submit" >
                提交
              </Button>
              <Button htmlType="button" style={{ marginLeft: 5 }} onClick={() => this.goBackClick()}>
                返回
              </Button>
            </FooterToolbar>
          </Form>
        </Card>

      </PageHeaderLayout>
    );
  }
}
