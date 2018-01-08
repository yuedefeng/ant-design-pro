import React, { PureComponent } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import { routerRedux } from 'dva/router';
import { Card, Form, DatePicker, Input, Radio, Button, message, Modal } from 'antd';
import PageHeaderLayout from '../../../layouts/PageHeaderLayout';
import FooterToolbar from '../../../components/FooterToolbar';

const FormItem = Form.Item;
const RadioGroup = Radio.Group;

@connect(state => ({
  sysuser: state.sysuser,
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
        type: 'sysuser/get',
        payload: {
          ...(location.query),
        },
      });
    } else {
      dispatch({
        type: 'sysuser/new',
      });
    }
  }

  goBackClick = () => {
    const { dispatch } = this.props;
    dispatch(routerRedux.push('/system/user'));
  };

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      const saveValues = {
        ...this.props.sysuser.entity,
        ...values,
        birthday: moment(values.birthday).format('YYYY-MM-DD'),
        id: this.state.entityId,
        userOnLine: 0,
        isStaff: 0,
        isVisible: 1,
        deleteMark: 0,
        enabled: 1,
      };
      let dispatchType = 'sysuser/add';
      if (this.state.entityId != null && this.state.entityId > 0) {
        dispatchType = 'sysuser/update';
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
              this.props.dispatch(routerRedux.push('/system/user'));
            }
          },
        });
      }
    });
  };

  checkUsernameRepeat = (rule, value, callback) => {
    this.props.dispatch({
      type: 'sysuser/checkRepeat',
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
    const { submitting, sysuser: { entity } } = this.props;
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
              label="用户名"
              {...formItemLayout}
            >
              {getFieldDecorator('userName', {
                initialValue: entity != null ? entity.userName : '',
                rules: [{ required: true, message: '用户名不能为空！' }, { validator: this.checkUsernameRepeat }],
              })(
                <Input placeholder="请输入" />
              )}
            </FormItem>
            <FormItem
              label="用户姓名"
              {...formItemLayout}
            >
              {getFieldDecorator('realName', {
                initialValue: entity != null ? entity.realName : '',
                rules: [{ required: true, message: '用户姓名' }],
              })(
                <Input placeholder="请输入" />
              )}
            </FormItem>
            <FormItem
              label="公司"
              {...formItemLayout}
            >
              {getFieldDecorator('company', {
                initialValue: entity != null ? entity.company : '',
                rules: [{ required: true, message: '公司' }],
              })(
                <Input placeholder="请输入" />
              )}
            </FormItem>
            <FormItem
              label="部门"
              {...formItemLayout}
            >
              {getFieldDecorator('department', {
                initialValue: entity != null ? entity.department : '',
                rules: [{ required: true, message: '部门' }],
              })(
                <Input placeholder="请输入" />
              )}
            </FormItem>
            <FormItem
              label="工作组"
              {...formItemLayout}
            >
              {getFieldDecorator('workgroup', {
                initialValue: entity != null ? entity.workgroup : '',
                rules: [{ required: true, message: '工作组' }],
              })(
                <Input placeholder="请输入" />
              )}
            </FormItem>
            <FormItem
              label="职责"
              {...formItemLayout}
            >
              {getFieldDecorator('duty', {
                initialValue: entity != null ? entity.duty : '',
                rules: [{ required: true, message: '职责' }],
              })(
                <Input placeholder="请输入" />
              )}
            </FormItem>
            <FormItem
              label="称谓"
              {...formItemLayout}
            >
              {getFieldDecorator('title', {
                initialValue: entity != null ? entity.title : '',
                rules: [{ required: true, message: '称谓' }],
              })(
                <Input placeholder="请输入" />
              )}
            </FormItem>
            <FormItem
              label="电子邮箱"
              {...formItemLayout}
            >
              {getFieldDecorator('email', {
                initialValue: entity != null ? entity.email : '',
                rules: [{ required: true, message: '电子邮箱' }],
              })(
                <Input placeholder="请输入" />
              )}
            </FormItem>
            <FormItem
              label="出生日期"
              {...formItemLayout}
            >
              {getFieldDecorator('birthday', {
                initialValue: entity && entity.birthday ? moment(entity.birthday, 'YYYY-MM-DD') : null,
                rules: [{ required: true, message: '出生日期' }],
              })(
                <DatePicker placeholder="出生日期" />
              )}
            </FormItem>
            <FormItem
              label="性别"
              {...formItemLayout}
            >
              {getFieldDecorator('sex', {
                initialValue: entity != null ? entity.sex : '1',
                rules: [{ required: true, message: '性别' }],
              })(
                <RadioGroup>
                  <Radio value="1">男</Radio>
                  <Radio value="0">女</Radio>
                </RadioGroup>
              )}
            </FormItem>
            <FormItem
              label="家庭住址"
              {...formItemLayout}
            >
              {getFieldDecorator('homeAddress', {
                initialValue: entity != null ? entity.homeAddress : '',
                rules: [{ required: true, message: '家庭住址' }],
              })(
                <Input placeholder="请输入" />
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
