import React, { PureComponent } from 'react';
import { routerRedux } from 'dva/router';
import { connect } from 'dva';
import { Form, Button, Card, Icon, Col, Row, Input, Upload, message, Modal } from 'antd';
// 引入编辑器以及编辑器样式
import BraftEditor from 'braft-editor';
import 'braft-editor/dist/braft.css';
import PageHeaderLayout from '../../../layouts/PageHeaderLayout';
import FooterToolbar from '../../../components/FooterToolbar';
import { getToken } from '../../../utils/token';

const FormItem = Form.Item;
const { TextArea } = Input;

@connect(state => ({
  wechatmp: state.wechatmp,
  submitting: state.loading.effects['wechatmp/create'],
}))
@Form.create()
export default class edit extends PureComponent {
  state = {
    mediaNewsId: null,
    thumbMediaId: null,
    imageUrl: null,
    content: null,
  };
  onUploadChange = (info) => {
    if (info.file.status === 'done') {
      this.setState({
        imageUrl: info.file.response.returnData.url,
        thumbMediaId: info.file.response.returnData.mediaId,
      });
      message.success(`${info.file.name} 文件上传成功`);
    } else if (info.file.status === 'error') {
      message.error(`${info.file.name} 文件上传失败.`);
    }
  };
  beforeUpload = (file) => {
    const isJPG = file.type === 'image/jpeg';
    if (!isJPG) {
      message.error('You can only upload JPG file!');
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error('Image must smaller than 2MB!');
    }
    return isJPG && isLt2M;
  };
  richUploadFn = (param) => {
    const serverURL = '/api/wechatmp/upload-material';
    const xhr = new XMLHttpRequest();
    const fd = new FormData();
    const successFn = () => {
      const resp = JSON.parse(xhr.responseText);
      param.success({
        url: resp.returnData.url,
      });
    };
    xhr.addEventListener('load', successFn, false);
    fd.append('file', param.file);
    xhr.open('POST', serverURL, true);
    xhr.setRequestHeader('Authorization', `Bearer ${getToken()}`);
    xhr.send(fd);
  };
  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      const saveValues = {
        ...values,
        thumbMediaId: this.state.thumbMediaId,
        mediaUrl: this.state.imageUrl,
        showCoverPic: true,
        content: this.state.content,
      };
      let dispatchType = 'wechatmp/create';
      if (this.state.mediaNewsId != null && this.state.mediaNewsId > 0) {
        dispatchType = 'wechatmp/update';
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
              this.props.dispatch(routerRedux.push('/wechat/material'));
            }
          },
        });
      }
    });
  };
  goBackClick = () => {
    const { dispatch } = this.props;
    dispatch(routerRedux.push('/wechat/material'));
  };
  handleHTMLChange = (html) => {
    this.setState({
      content: html,
    });
  };
  render() {
    const { submitting } = this.props;
    const { getFieldDecorator } = this.props.form;
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 4 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 20 },
      },
    };
    const gridStyle = {
      width: '100%',
      textAlign: 'center',
    };
    const uploadButton = (
      <div>
        <Icon type="plus" />
        <div className="ant-upload-text">Upload</div>
      </div>
    );
    const curHeaders = ({
      Authorization: `Bearer ${getToken()}`,
    });
    const editorProps = {
      height: 300,
      contentFormat: 'html',
      initialContent: '',
      onHTMLChange: this.handleHTMLChange,
      media: {
        uploadFn: this.richUploadFn,
      },
    };
    return (
      <PageHeaderLayout>
        <Row gutter={16}>
          <Col span={8}>
            <Card
              hoverable
              cover={
                <img
                  alt="example"
                  onClick={this.goBackClick}
                  src="https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png"
                />
              }
              actions={[<Icon type="plus" />, <Icon type="ellipsis" />]}
            >
              <Card.Grid style={gridStyle} onClick={this.goBackClick}>Content</Card.Grid>
              <Card.Grid style={gridStyle}>Content</Card.Grid>
              <Card.Grid style={gridStyle}>Content</Card.Grid>
              <Card.Grid style={gridStyle}>Content</Card.Grid>
            </Card>
          </Col>
          <Col span={16}>
            <Card title="" bordered={false}>
              <Form
                onSubmit={this.handleSubmit}
                style={{ marginTop: 8 }}
              >
                <FormItem
                  {...formItemLayout}
                  label="标题"
                >
                  {getFieldDecorator('title', {
                    rules: [{
                      required: true, message: '请输入标题',
                    }],
                  })(
                    <Input placeholder="请输入标题" />
                  )}
                </FormItem>
                <FormItem
                  {...formItemLayout}
                  label="封面"
                >
                  <Upload
                    name="avatar"
                    listType="picture-card"
                    className="avatar-uploader"
                    showUploadList={false}
                    action="/api/wechatmp/upload-material"
                    headers={curHeaders}
                    beforeUpload={this.beforeUpload}
                    onChange={this.onUploadChange}
                  >
                    {this.state.imageUrl ? <img src={this.state.imageUrl} alt="" /> : uploadButton}
                  </Upload>
                </FormItem>
                <FormItem
                  {...formItemLayout}
                  label="原文链接"
                >
                  {getFieldDecorator('contentUrl', {
                    rules: [{
                      required: true, message: '请输入原文链接',
                    }],
                  })(
                    <Input placeholder="请输入原文链接" />
                  )}
                </FormItem>
                <FormItem
                  {...formItemLayout}
                  label="摘要"
                >
                  {getFieldDecorator('digest', {
                    rules: [{
                      required: true, message: '请输入摘要',
                    }],
                  })(
                    <TextArea placeholder="请输入摘要" autosize={{ minRows: 2, maxRows: 6 }} />
                  )}
                </FormItem>
                <FooterToolbar style={{ width: '100%' }}>
                  <Button id="aaa" name="aaa" type="primary" htmlType="submit" loading={submitting}>
                    保存素材
                  </Button>
                  <Button htmlType="button" style={{ marginLeft: 5 }} onClick={() => this.goBackClick()} loading={submitting}>
                    返回
                  </Button>
                </FooterToolbar>
              </Form>
              <Form>
                <FormItem
                  {...formItemLayout}
                  label="正文"
                >
                  {getFieldDecorator('content', {
                    rules: [{
                      required: true, message: '请输入正文',
                    }],
                  })(
                    <BraftEditor {...editorProps} />
                  )}
                </FormItem>
              </Form>
            </Card>
          </Col>
        </Row>
      </PageHeaderLayout>
    );
  }
}
