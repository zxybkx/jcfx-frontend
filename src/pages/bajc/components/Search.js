import React from 'react';
import {Form, Row, Col, Button, Select, DatePicker, Icon} from 'antd';
import styles from './Search.less';
import moment from 'moment';
const FormItem = Form.Item;
const Option = Select.Option;

class SearchForm extends React.Component {
  constructor(props) {
    super(props);
    const myDate = new Date();
    const endDate = moment(myDate).format('YYYY-MM-DD');
    this.state = {
      expandForm: false,
      ajlb: ['ZJ'],
      ysay: ['交通肇事罪'],
      start: '2017-10-24',
      end: endDate,
    }
  };

  handleSearch = (e) => {
    e.preventDefault();

    const {dispatch, form, onSearch} = this.props;
    const {start, end} = this.state;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      if (!err) {
        this.setState({
          ajlb: fieldsValue.ajlb,
          ysay: fieldsValue.ysay,
        });
        const values = {
          ajlb: fieldsValue.ajlb,
          ysay: fieldsValue.ysay,
          start: start,
          end: end,
        };
        onSearch(values);
      }
      const values = {
        ...fieldsValue,
        updatedAt: fieldsValue.updatedAt && fieldsValue.updatedAt.valueOf(),
      };

      dispatch({
        type: 'rule/fetch',
        payload: values,
      });
    });
  };

  // 重置
  handleFormReset = () => {
    const {form, dispatch} = this.props;
    form.resetFields();
    dispatch({
      type: 'rule/fetch',
      payload: {},
    });
  };

  // 展开关闭
  toggleForm = () => {
    const {onExpandForm} = this.props;
    this.setState({
      expandForm: !this.state.expandForm,
    });
    onExpandForm(this.state.expandForm);
  };

  renderSimpleForm() {
    const formItemLayout = {
      labelCol: {span: 6},
      wrapperCol: {span: 18},
    };
    const {getFieldDecorator} = this.props.form;
    const {ajlb, ysay} = this.state;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row type="flex" justify="space-around" gutter={16}>
          <Col span={8}>
            <FormItem {...formItemLayout} style={{width: '100%'}} colon={false}
                      label={<span style={{fontWeight: 'normal'}}>案件类别</span>}>
              {getFieldDecorator('ajlb', {initialValue: ajlb})(
                <Select mode="multiple">
                  {/*<Option value={ 'all' }>全部</Option>*/}
                  <Option value={ 'ZJ' }>审查逮捕</Option>
                  <Option value={ 'GS' }>审查起诉</Option>
                  {/*<Option value={ 'GS' }>审查起诉（一审）</Option>*/}
                  {/*<Option value={ 'GS' }>审查起诉（二审上诉）</Option>*/}
                  {/*<Option value={ 'GS' }>审查起诉（二审抗诉）</Option>*/}
                </Select>
              )}
            </FormItem>
          </Col>
          <Col span={8}>
            <FormItem {...formItemLayout} style={{width: '100%'}} colon={false}
                      label={<span style={{fontWeight: 'normal'}}>移送案由</span>}>
              {getFieldDecorator('ysay', {initialValue: ysay})(
                <Select mode="multiple">
                  <Option value={ '交通肇事罪' }>交通肇事罪</Option>
                  <Option value={ '危险驾驶罪' }>危险驾驶罪</Option>
                  <Option value={ '盗窃罪' }>盗窃罪</Option>
                </Select>
              )}
            </FormItem>
          </Col>
          <Col span={8}>
            <span>
              <Button type="primary" htmlType="submit">查询</Button>
              <Button style={{marginLeft: 8}} onClick={this.handleFormReset}>重置</Button>
              <a style={{marginLeft: 8}} onClick={this.toggleForm}>
                展开 <Icon type="down"/>
              </a>
            </span>
          </Col>
        </Row>
      </Form>
    );
  }

  disabledStartDate = (start) => {
    const end = moment(this.state.end);
    if (!start || !end) {
      return false;
    }
    return start.valueOf() > end.valueOf();
  };

  disabledEndDate = (end) => {
    const start = moment(this.state.start);
    if (!end || !start) {
      return false;
    }
    return end.valueOf() <= start.valueOf();
  };

  onChange = (field, value) => {
    const date = value ? moment(value).format('YYYY-MM-DD') : '';
    this.setState({
      [field]: date,
    });
  };

  onStartChange = (value) => {
    this.onChange('start', value);
  };

  onEndChange = (value) => {
    this.onChange('end', value);
  };

  renderAdvancedForm() {
    const formItemLayout = {
      labelCol: {span: 6},
      wrapperCol: {span: 18},
    };
    const {getFieldDecorator} = this.props.form;
    const {ajlb, ysay, start, end} = this.state;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={16}>
          <Col span={8}>
            <FormItem {...formItemLayout} style={{width: '100%'}} colon={false}
                      label={<span style={{fontWeight: 'normal'}}>案件类别</span>}>
              {getFieldDecorator('ajlb', {initialValue: ajlb})(
                <Select mode="multiple">
                  {/*<Option value={ 'all' }>全部</Option>*/}
                  <Option value={ 'ZJ' }>审查逮捕</Option>
                  <Option value={ 'GS' }>审查起诉</Option>
                </Select>
              )}
            </FormItem>
          </Col>
          <Col span={8}>
            <FormItem {...formItemLayout} style={{width: '100%'}} colon={false}
                      label={<span style={{fontWeight: 'normal'}}>移送案由</span>}>
              {getFieldDecorator('ysay', {initialValue: ysay})(
                <Select mode="multiple">
                  <Option value={ '交通肇事罪' }>交通肇事罪</Option>
                  <Option value={ '危险驾驶罪' }>危险驾驶罪</Option>
                  <Option value={ '盗窃罪' }>盗窃罪</Option>
                </Select>
              )}
            </FormItem>
          </Col>
          <Col span={8}>
            <FormItem {...formItemLayout} style={{width: '100%'}} colon={false}
                      label={<span style={{fontWeight: 'normal'}}>时间</span>}>
              <Col span={12}>
                {getFieldDecorator('start', {initialValue: moment(start)})(
                  <DatePicker
                    disabledDate={this.disabledStartDate}
                    onChange={this.onStartChange}
                  />
                )}
              </Col>
              <Col span={12}>
                {getFieldDecorator('end', {initialValue: moment(end)})(
                  <DatePicker
                    disabledDate={this.disabledEndDate}
                    onChange={this.onEndChange}
                  />
                )}
              </Col>
            </FormItem>
          </Col>
        </Row>
        <div style={{overflow: 'hidden', marginTop: 15}}>
            <span style={{float: 'right'}}>
              <Button type="primary" htmlType="submit">查询</Button>
              <Button style={{marginLeft: 8}} onClick={this.handleFormReset}>重置</Button>
              <a style={{marginLeft: 8}} onClick={this.toggleForm}>
                收起 <Icon type="up"/>
              </a>
            </span>
        </div>
      </Form>
    );
  }

  renderForm() {
    return this.state.expandForm ? this.renderAdvancedForm() : this.renderSimpleForm();
  }

  render() {

    return (
      <div className={styles.default}>
        {this.renderForm()}
      </div>
    );
  }
}


export default Form.create()(SearchForm);
