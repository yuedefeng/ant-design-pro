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
  sysmodule: state.sysmodule,
}))
@Form.create()
export default class treeedit extends PureComponent {
  state = {
    entityId: null,
  };

  componentWillMount() {
    const { dispatch, location } = this.props;
    dispatch({
      type: 'sysmodule/getTree',
      payload: {
        ...(location.query),
      },
    });
    if (location.query && location.query.id) {
      this.setState({
        entityId: location.query.id,
      });
      dispatch({
        type: 'sysmodule/get',
        payload: {
          ...(location.query),
        },
      });
    } else if (location.query && location.query.parentID) {
      dispatch({
        type: 'sysmodule/newchildren',
        payload: {
          parentID: location.query.parentID,
        },
      });
    } else {
      dispatch({
        type: 'sysmodule/new',
      });
    }
  }

  goBackClick = () => {
    const { dispatch } = this.props;
    dispatch(routerRedux.push('/system/module/treetable'));
  };

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      const saveValues = {
        ...this.props.sysmodule.entity,
        ...values,
        id: this.state.entityId,
        isGroup: 0,
        isPublic: 0,
        isMenu: 1,
        expand: 0,
        enabled: 1,
      };
      let dispatchType = 'sysmodule/add';
      if (this.state.entityId != null && this.state.entityId > 0) {
        dispatchType = 'sysmodule/update';
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
              this.props.dispatch(routerRedux.push('/system/module/treetable'));
            }
          },
        });
      }
    });
  };

  render() {
    const { submitting, sysmodule: { entity, treeData } } = this.props;
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
              label="父节点"
              {...formItemLayout}
            >
              {getFieldDecorator('parentID', {
                initialValue: entity != null ? (`${entity.parentID}`) : '',
                rules: [{ required: true, message: '父节点' }],
              })(
                treeData
                  ? <TreeSelect placeholder="请选择树" treeDefaultExpandAll ><treeNode key="0" value="0" title="根节点">{ loop(treeData) }</treeNode></TreeSelect>
                  : <input />
              )}
            </FormItem>
            <FormItem
              label="全称"
              {...formItemLayout}
            >
              {getFieldDecorator('fullName', {
                initialValue: entity != null ? entity.fullName : '',
                rules: [{ required: true, message: '全称不能为空！' }],
              })(
                <Input placeholder="请输入" />
              )}
            </FormItem>
            <FormItem
              label="编码"
              {...formItemLayout}
            >
              {getFieldDecorator('code', {
                initialValue: entity != null ? entity.code : '',
                rules: [{ required: true, message: '编码不能为空！' }],
              })(
                <Input placeholder="请输入" />
              )}
            </FormItem>
            <FormItem
              label="导航Url"
              {...formItemLayout}
            >
              {getFieldDecorator('navigateUrl', {
                initialValue: entity != null ? entity.navigateUrl : '',
                rules: [{ required: true, message: '导航Url' }],
              })(
                <Input placeholder="请输入" />
              )}
            </FormItem>
            <FormItem
              label="分类编码"
              {...formItemLayout}
            >
              {getFieldDecorator('sortCode', {
                initialValue: entity != null ? entity.sortCode : '',
                rules: [{ required: true, message: '导航Url' }],
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
            <FormItem
              label="描述"
              {...formItemLayout}
            >
              {getFieldDecorator('description', {
                initialValue: entity != null ? entity.description : '',
                rules: [{ required: true, message: '描述' }],
              })(
                <Input placeholder="请输入" />
              )}
            </FormItem>
            <FormItem
              label="允许编辑"
              {...formItemLayout}
            >
              {getFieldDecorator('allowEdit', {
                initialValue: entity != null ? entity.allowEdit : '1',
                rules: [{ required: true, message: '允许编辑' }],
              })(
                <RadioGroup>
                  <Radio value={1}>是</Radio>
                  <Radio value={0}>否</Radio>
                </RadioGroup>
              )}
            </FormItem>
            <FormItem
              label="允许删除"
              {...formItemLayout}
            >
              {getFieldDecorator('allowDelete', {
                initialValue: entity != null ? entity.allowDelete : '1',
                rules: [{ required: true, message: '允许删除' }],
              })(
                <RadioGroup>
                  <Radio value={1}>是</Radio>
                  <Radio value={0}>否</Radio>
                </RadioGroup>
              )}
            </FormItem>
            <FooterToolbar style={{ width: '100%' }}>
              <Button type="primary" htmlType="submit" loading={submitting}>
                提交
              </Button>
              <Button htmlType="button" style={{ marginLeft: 5 }} loading={submitting} onClick={() => this.goBackClick()}>
                返回
              </Button>
            </FooterToolbar>
          </Form>
        </Card>

      </PageHeaderLayout>
    );
  }
}
