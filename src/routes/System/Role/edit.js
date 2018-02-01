import React, { PureComponent } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import { routerRedux } from 'dva/router';
import { Card, Form, Input, Radio, Button, message, Modal } from 'antd';
import PageHeaderLayout from '../../../layouts/PageHeaderLayout';
import FooterToolbar from '../../../components/FooterToolbar';

const FormItem = Form.Item;
const RadioGroup = Radio.Group;

@connect(state => ({
  sysrole: state.sysrole,
}))
@Form.create()
export default class edit extends PureComponent {
  state = {
    entityId: null,
  };

  componentWillMount() {
    const { dispatch, location } = this.props;
    if (location.query && location.query.id) {
      this.setState({
        entityId: location.query.id,
      });
      dispatch({
        type: 'sysrole/get',
        payload: {
          ...(location.query),
        },
      });
    } else {
      dispatch({
        type: 'sysrole/new',
      });
    }
  }

  goBackClick = () => {
    const { dispatch } = this.props;
    dispatch(routerRedux.push('/system/role'));
  };

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      const saveValues = {
        ...this.props.sysrole.entity,
        ...values,
        createdDate: moment(values.createdDate).format('YYYY-MM-DD'),
        id: this.state.entityId,
        userOnLine: 0,
        isStaff: 0,
        isVisible: 1,
        deleteMark: 0,
        enabled: 1,
      };
      let dispatchType = 'sysrole/add';
      if (this.state.entityId != null && this.state.entityId > 0) {
        dispatchType = 'sysrole/update';
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
              this.props.dispatch(routerRedux.push('/system/role'));
            }
          },
        });
      }
    });
  };

  checkUsernameRepeat = (rule, value, callback) => {
    this.props.dispatch({
      type: 'sysrole/checkRepeat',
      payload: value,
      callback: (resp) => {
        if (resp.returnData === false) {
          callback();
          return;
        }
        callback('此姓名已经存在！');
      },
    });
  }

  render() {
    const { submitting, sysrole: { entity } } = this.props;
    const { getFieldDecorator } = this.props.form;
    const formItemLayout = {
      labelCol: { span: 5 },
      wrapperCol: { span: 15 },
    };
    return (
      <PageHeaderLayout title="">
        <Card bordered={false}>
          <Form
            onSubmit={this.handleSubmit}
            style={{ marginTop: 8 }}
          >
            <FormItem
              label="类别"
              {...formItemLayout}
            >
              {getFieldDecorator('category', {
                initialValue: entity ? entity.category : '',
                rules: [{ required: true, message: '请选择' }],
              })(
                <RadioGroup>
                  <Radio value="role">角色</Radio>
                  <Radio value="workgroup">工作组</Radio>
                </RadioGroup>
              )}
            </FormItem>
            <FormItem
              label="编码"
              {...formItemLayout}
            >
              {getFieldDecorator('code', {
                initialValue: entity != null ? entity.code : '',
                rules: [{ required: true, message: '编码' }],
              })(
                <Input placeholder="请输入" />
              )}
            </FormItem>
            <FormItem
              label="角色姓名"
              {...formItemLayout}
            >
              {getFieldDecorator('realname', {
                initialValue: entity != null ? entity.realname : '',
                rules: [{ required: true, message: '角色姓名' }],
              })(
                <Input placeholder="请输入" />
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
              label="是否启用"
              {...formItemLayout}
            >
              {getFieldDecorator('enabled', {
                initialValue: entity ? entity.enabled : '',
                rules: [{ required: true, message: '请选择' }],
              })(
                <RadioGroup>
                  <Radio value={1}>是</Radio>
                  <Radio value={0}>否</Radio>
                </RadioGroup>
              )}
            </FormItem>
            <FormItem
              label="是否允许修改"
              {...formItemLayout}
            >
              {getFieldDecorator('allowEdit', {
                initialValue: entity ? entity.allowEdit : '',
                rules: [{ required: true, message: '请选择' }],
              })(
                <RadioGroup>
                  <Radio value={1}>是</Radio>
                  <Radio value={0}>否</Radio>
                </RadioGroup>
              )}
            </FormItem>
            <FormItem
              label="是否允许删除"
              {...formItemLayout}
            >
              {getFieldDecorator('allowDelete', {
                initialValue: entity ? entity.allowDelete : '',
                rules: [{ required: true, message: '请选择' }],
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
