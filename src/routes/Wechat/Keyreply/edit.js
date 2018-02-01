import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import { Card, Form, Input, Radio, Button, message, Modal, Select, Row, Col } from 'antd';
import PageHeaderLayout from '../../../layouts/PageHeaderLayout';

const FormItem = Form.Item;
const RadioGroup = Radio.Group;
const { Option } = Select;
const { TextArea } = Input;

@connect(state => ({
  keyreply: state.keyreply,
}))
@Form.create()
export default class edit extends PureComponent {
  state = {
    expandForm: null,
    entityId: null,
  };
  componentWillMount() {
    const { dispatch, location } = this.props;
    if (location.query && location.query.id) {
      this.setState({
        entityId: location.query.id,
      });
      dispatch({
        type: 'keyreply/get',
        payload: {
          ...(location.query),
        },
        callback: (resp) => {
          this.setState({
            expandForm: resp.replyType,
          });
        },
      });
    } else {
      dispatch({
        type: 'keyreply/new',
      }).then(
        this.state.expandForm = 1,
      );
    }
  }

  goBackClick = () => {
    const { dispatch } = this.props;
    dispatch(routerRedux.push('/wechat/keyreply/list'));
  };

  handleSelect = (value) => {
    this.setState({
      expandForm: value,
    });
  };

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      const saveValues = {
        ...this.props.keyreply.entity,
        ...values,
        id: this.state.entityId,
      };
      let dispatchType = 'keyreply/add';
      if (this.state.entityId != null && this.state.entityId > 0) {
        dispatchType = 'keyreply/update';
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
              this.props.dispatch(routerRedux.push('/wechat/keyreply'));
            }
          },
        });
      }
    });
  };
  renderForm() {
    if (this.state.expandForm === 1) {
      return this.renderRestForm();
    } else if (this.state.expandForm === 2) {
      return this.renderTextForm();
    } else {
      return this.renderPictureForm();
    }
  }
  renderRestForm() {
    const { keyreply: { entity } } = this.props;
    const { getFieldDecorator } = this.props.form;
    const formItemLayout = {
      labelCol: { span: 5 },
      wrapperCol: { span: 15 },
    };
    return (
      <Form
        onSubmit={this.handleSubmit}
        style={{ marginTop: 8 }}
      ><p style={{ fontSize: '18px', fontFamily: 'Microsoft YaHei', borderBottom: '1px solid #D4D4D4', paddingBottom: 10 }}>添加关键字</p>
        <FormItem
          label="关键字名称"
          {...formItemLayout}
        >
          {getFieldDecorator('title', {
            initialValue: entity != null ? entity.title : '',
            rules: [{ required: true, message: '关键字不能为空！' }],
          })(
            <Input placeholder="请输入关键字" />
          )}
        </FormItem>
        <FormItem
          label="回复类型"
          {...formItemLayout}
        >
          {getFieldDecorator('replyType', {
            initialValue: entity != null ? entity.replyType : '请选择回复类型',
            rules: [{ required: true, message: '回复类型不能为空' }],
          })(
            <Select
              style={{ width: '32%' }}
              onSelect={this.handleSelect}
            >
              <Option value={1}>请选择回复类型</Option>
              <Option value={2}>文本类型</Option>
              <Option value={3}>图片素材</Option>
            </Select>
          )}
        </FormItem>


      </Form>
    );
  }
  renderPictureForm() {
    const { keyreply: { entity } } = this.props;
    const { getFieldDecorator } = this.props.form;
    const formItemLayout = {
      labelCol: { span: 5 },
      wrapperCol: { span: 15 },
    };
    return (
      <Form
        onSubmit={this.handleSubmit}
        style={{ marginTop: 8 }}
      ><p style={{ fontSize: '18px', fontFamily: 'Microsoft YaHei', borderBottom: '1px solid #D4D4D4', paddingBottom: 10 }}>添加关键字</p>
        <FormItem
          label="关键字名称"
          {...formItemLayout}
        >
          {getFieldDecorator('title', {
            initialValue: entity != null ? entity.title : '',
            rules: [{ required: true, message: '关键字不能为空！' }],
          })(
            <Input placeholder="请输入关键字" />
          )}
        </FormItem>
        <FormItem
          label="回复类型"
          {...formItemLayout}
        >
          {getFieldDecorator('replyType', {
            initialValue: entity != null ? entity.replyType : '图片素材',
            rules: [{ required: true, message: '回复方式不能为空' }],
          })(
            <Select
              style={{ width: '32%' }}
              onSelect={this.handleSelect}
            >
              <Option value={1}>请选择回复类型</Option>
              <Option value={2}>文本类型</Option>
              <Option value={3}>图片素材</Option>
            </Select>
          )}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="素材选择"
        >
          <Row gutter={8}>
            <Col span={4}>
              {(
                <Button type="primary" style={{ marginLeft: 10 }}>选择素材</Button>
              )}
            </Col>
            <Col span={4}>
              <Button type="primary" style={{ marginLeft: 5 }}>清除素材</Button>
            </Col>
          </Row>
          <Row gutter={8} style={{ marginTop: '10px' }}>
            <div style={{ width: '250px', height: '250px', border: '1px solid gray' }} />
          </Row>
        </FormItem>

      </Form>
    );
  }
  renderTextForm() {
    const { keyreply: { entity } } = this.props;
    const { getFieldDecorator } = this.props.form;
    const formItemLayout = {
      labelCol: { span: 5 },
      wrapperCol: { span: 15 },
    };
    return (
      <Form
        onSubmit={this.handleSubmit}
        style={{ marginTop: 8 }}
      ><p style={{ fontSize: '18px', fontFamily: 'Microsoft YaHei', borderBottom: '1px solid #D4D4D4', paddingBottom: 10 }}>添加关键字</p>
        <FormItem
          label="关键字名称"
          {...formItemLayout}
        >
          {getFieldDecorator('title', {
            initialValue: entity != null ? entity.title : '',
            rules: [{ required: true, message: '关键字不能为空！' }],
          })(
            <Input placeholder="请输入关键字" />
          )}
        </FormItem>
        <FormItem
          label="回复类型"
          {...formItemLayout}
        >
          {getFieldDecorator('replyType', {
            initialValue: entity != null ? entity.replyType : '文本类型',
            rules: [{ required: true, message: '回复类型不能为空' }],
          })(
            <Select
              style={{ width: '32%' }}
              onSelect={this.handleSelect}
            >
              <Option value={1}>请选择回复类型</Option>
              <Option value={2}>文本类型</Option>
              <Option value={3}>图片素材</Option>
            </Select>
          )}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="回复内容"
        >
          {getFieldDecorator('replyText', {
            initialValue: entity != null ? entity.replyText : '',
            rules: [{
              required: true, message: '请输入回复内容',
            }],
          })(
            <TextArea style={{ minHeight: 32 }} placeholder="请输入你的内容" rows={4} />
          )}
        </FormItem>

      </Form>
    );
  }

  render() {
    const { submitting, keyreply: { entity } } = this.props;
    const { getFieldDecorator } = this.props.form;
    const formItemLayout = {
      labelCol: { span: 5 },
      wrapperCol: { span: 15 },
    };
    return (
      <PageHeaderLayout title="">
        <Card bordered={false}>
          <div className="">
            { this.state.expandForm ? this.renderForm() : '' }
          </div>
          <Form
            onSubmit={this.handleSubmit}
            style={{ marginTop: 8 }}
          >
            <FormItem
              label="匹配方式"
              {...formItemLayout}
            >
              {getFieldDecorator('matchtype', {
                initialValue: entity != null ? entity.matchtype : '1',
                rules: [{ required: true, message: '匹配方式' }],
              })(
                <RadioGroup>
                  <Radio value={1}>模糊匹配</Radio>
                  <Radio value={0}>完全匹配</Radio>
                </RadioGroup>
              )}
            </FormItem>
            <FormItem
              label="排序"
              extra="序号越小越靠前"
              {...formItemLayout}
            >
              {getFieldDecorator('ordnum', {
                initialValue: entity != null ? entity.ordnum : '',
                rules: [{ required: true, message: '排序不能为空！' }],
              })(
                <Input placeholder="请输入序号" />
              )}
            </FormItem>
            <FormItem
              label="状态"
              {...formItemLayout}
            >
              {getFieldDecorator('islock', {
                initialValue: entity != null ? entity.islock : '1',
                rules: [{ required: true, message: '是否锁定' }],
              })(
                <RadioGroup>
                  <Radio value={1}>启用</Radio>
                  <Radio value={0}>锁定</Radio>
                </RadioGroup>
              )}
            </FormItem>
            <FormItem {...formItemLayout} style={{ marginTop: 32 }}>
              <Button type="primary" htmlType="submit" style={{ marginLeft: 250 }} loading={submitting}>
                提交
              </Button>
              <Button htmlType="button" style={{ marginLeft: 8 }} loading={submitting} onClick={() => this.goBackClick()}>返回</Button>
            </FormItem>
          </Form>
        </Card>

      </PageHeaderLayout>
    );
  }
}
