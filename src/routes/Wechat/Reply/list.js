import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Form, Layout, Row, Col, Select, Button, message, Modal } from 'antd';
import PageHeaderLayout from '../../../layouts/PageHeaderLayout';

const FormItem = Form.Item;
const { Content } = Layout;
const { Option } = Select;

@connect(state => ({
  sysreply: state.sysreply,
}))
@Form.create()
export default class replyList extends PureComponent {
  state = {
    expandForm: '1',
    visible: false,
    queryList: {

    },
  };
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'sysreply/fetch',
      payload: { ...this.state.queryList },
    });
  }
  handleSelect = (value) => {
    this.setState({
      expandForm: value,
    });
  };
  showModal = () => {
    this.setState({
      visible: true,
    });
  };
  hideModal = () => {
    this.setState({
      visible: false,
    });
  };
  handleSubmit = (e) => {
    e.preventDefault();
    const { dispatch, form } = this.props;
    form.validateFieldsAndScroll((err, values) => {
      if (err) return;
      const saveValues = {
        ...values,
        replyKey: 'attention',
      };
      if (!err) {
        dispatch({
          type: 'sysreply/add',
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
            }
          },
        });
      }
      this.props.form.resetFields();
      this.state.expandForm = '1';
    });
  };
  renderForm() {
    if (this.state.expandForm === '1') {
      return this.renderRestForm();
    } else if (this.state.expandForm === '2') {
      return this.renderTextForm();
    } else {
      return this.renderPictureForm();
    }
  }
  renderRestForm() {
    const { getFieldDecorator } = this.props.form;
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 7 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 12 },
        md: { span: 10 },
      },
    };
    const submitFormLayout = {
      wrapperCol: {
        xs: { span: 24, offset: 0 },
        sm: { span: 10, offset: 7 },
      },
    };
    return (
      <Form
        onSubmit={this.handleSubmit}
        style={{ fontSize: '52px', fontWeight: 500 }}
      >
        <Row gutter={{ md: 24, lg: 24, xl: 48 }}>
          <Col md={18} sm={24}>
            <FormItem
              label="是否启用"
              {...formItemLayout}
            >
              {getFieldDecorator('replyType', {
                initialValue: ['关闭'],
                rules: [{
                  required: true, message: '请选择是否启用',
                }],
              })(
                <Select onSelect={this.handleSelect}>
                  <Option value="1">关闭</Option>
                  <Option value="2">文本回复</Option>
                  <Option value="3">图片素材</Option>
                </Select>
              )}
            </FormItem>
            <FormItem {...submitFormLayout} style={{ marginTop: 32 }}>
              <Button type="primary" htmlType="submit" style={{ marginLeft: 8 }}>保存</Button>
            </FormItem>
          </Col>
        </Row>
      </Form>
    );
  }
  renderTextForm() {
    const { getFieldDecorator } = this.props.form;
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 7 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 12 },
        md: { span: 10 },
      },
    };
    const submitFormLayout = {
      wrapperCol: {
        xs: { span: 24, offset: 0 },
        sm: { span: 10, offset: 7 },
      },
    };
    return (
      <Form
        onSubmit={this.handleSubmit}
        style={{ fontSize: '52px', fontWeight: 500 }}
      >
        <Row gutter={{ md: 24, lg: 24, xl: 48 }}>
          <Col md={18} sm={24}>
            <FormItem
              label="是否启用"
              {...formItemLayout}
            >
              {getFieldDecorator('replyType', {
                initialValue: '文本回复',
                rules: [{
                  required: true, message: '请选择是否启用',
                }],
              })(
                <Select onSelect={this.handleSelect}>
                  <Option value="1" >关闭</Option>
                  <Option value="2">文本回复</Option>
                  <Option value="3">图片素材</Option>
                </Select>
              )}
            </FormItem>
            <FormItem
              label="回复内容"
              {...formItemLayout}
            >
              {getFieldDecorator('replyText', {
                rules: [{
                  required: true, message: '请写回复的内容',
                }],
              })(
                <textarea style={{ width: '100%', border: '1px solid #DCDAD6' }} />
              )}
            </FormItem>
            <FormItem {...submitFormLayout} style={{ marginTop: 32 }}>
              <Button type="primary" htmlType="submit" style={{ marginLeft: 8 }}>保存</Button>
            </FormItem>
          </Col>
        </Row>
      </Form>
    );
  }
  renderPictureForm() {
    const { getFieldDecorator } = this.props.form;
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 7 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 12 },
        md: { span: 10 },
      },
    };
    const submitFormLayout = {
      wrapperCol: {
        xs: { span: 24, offset: 0 },
        sm: { span: 10, offset: 7 },
      },
    };
    return (
      <Form
        onSubmit={this.handleSubmit}
        style={{ fontSize: '52px', fontWeight: 500 }}
      >
        <Row gutter={{ md: 24, lg: 24, xl: 48 }}>
          <Col md={18} sm={24}>
            <FormItem
              label="是否启用"
              {...formItemLayout}
            >
              {getFieldDecorator('replyType', {
                initialValue: ['图片素材'],
                rules: [{
                  required: true, message: '请选择是否启用',
                }],
              })(
                <Select onSelect={this.handleSelect}>
                  <Option value="1" >关闭</Option>
                  <Option value="2">文本回复</Option>
                  <Option value="3">图片素材</Option>
                </Select>
              )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="素材选择"
            >
              <Row gutter={24}>
                <Col span={7}>
                  {(
                    <Button type="primary" onClick={this.showModal}>选择素材</Button>
                  )}
                </Col>
                <Col span={12}>
                  <Button type="primary">清除素材</Button>
                </Col>
              </Row>
              <Row gutter={8} style={{ marginTop: '10px' }}>
                <div style={{ width: '250px', height: '250px', border: '1px solid #DCDAD6' }} />
              </Row>
            </FormItem>
            <FormItem {...submitFormLayout} style={{ marginTop: 32 }}>
              <Button type="primary" htmlType="submit" style={{ marginLeft: 8 }}>保存</Button>
            </FormItem>
          </Col>
        </Row>
      </Form>
    );
  }
  render() {
    return (
      <PageHeaderLayout>
        <Content style={{ background: '#fff', padding: 14, margin: 0, minHeight: 80 }}>
          <p style={{ fontSize: '18px', borderBottom: '1px solid #D4D4D4', paddingBottom: 10 }}>关注回复</p>
          {this.renderForm()}
          <Modal
            title="素材选择"
            visible={this.state.visible}
            onOk={this.hideModal}
            onCancel={this.hideModal}
            okText="确认"
            cancelText="取消"
          >
            <img
              alt="example"
              onClick={this.goBackClick}
              src="https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png"
            />
          </Modal>
        </Content>
      </PageHeaderLayout>
    );
  }
}
