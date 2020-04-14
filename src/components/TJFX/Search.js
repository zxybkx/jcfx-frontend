import React from 'react';
import { Form, Row, Col, Button, Select, DatePicker, Icon } from 'antd';
import styles from './Search.less';
import moment from 'moment';
const RangePicker = DatePicker.RangePicker;
const FormItem = Form.Item;
const Option = Select.Option;

class SearchForm extends React.Component {
  state = {
    addInputValue: '',
    modalVisible: false,
    expandForm: false,
    selectedRows: [],
    formValues: {},
  };

  handleSearch = (e) => {
    e.preventDefault();

    const { dispatch, form, onSearch } = this.props;

    form.validateFields((err, fieldsValue) => {

      if (err) return;
      if (!err) {
        const myDate=new Date();
        const sasj_startDate = fieldsValue.sasj ? moment(fieldsValue.sasj[0]).format("YYYY-MM-DD") : '2017-11-01';
        const sasj_endDate = fieldsValue.sasj ? moment(fieldsValue.sasj[1]).format("YYYY-MM-DD") : moment(myDate).format('YYYY-MM-DD');
        const values = {
          sasj_startDate: sasj_startDate,
          sasj_endDate: sasj_endDate,
          ysay: fieldsValue.ysay?fieldsValue.ysay:['交通肇事罪'],
        }
        onSearch(values);
      }
      const values = {
        ...fieldsValue,
        updatedAt: fieldsValue.updatedAt && fieldsValue.updatedAt.valueOf(),
      };

      this.setState({
        formValues: values,
      });

      dispatch({
        type: 'rule/fetch',
        payload: values,
      });
    });
  }

  // 重置
  handleFormReset = () => {
    const { form, dispatch } = this.props;
    form.resetFields();
    dispatch({
      type: 'rule/fetch',
      payload: {},
    });
  }

  // 展开关闭
  toggleForm = () => {
    const { onExpandForm } = this.props;
    this.setState({
      expandForm: !this.state.expandForm,
    });
    onExpandForm(this.state.expandForm);
  }

  renderSimpleForm() {
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 18 },
    };
    const { getFieldDecorator } = this.props.form;
    const myDate=new Date();
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row type="flex" justify="space-around">
          <Col xxl={8} xl={10} lg={10} md={24}>
            <FormItem {...formItemLayout} style={{ width: '100%' }} colon={false} label={<span style={{fontWeight:'normal'}}>移送案由</span>} >
              {getFieldDecorator('ysay',{initialValue: ['交通肇事罪']})(
                <Select mode="multiple" >
                  <Option  value={ '交通肇事罪' } >交通肇事罪</Option>
                  <Option  value={ '危险驾驶罪' } >危险驾驶罪</Option>
                </Select>
              )}
            </FormItem>
          </Col>
          <Col xxl={7} xl={9} lg={9} md={24}>
            <FormItem {...formItemLayout} style={{ width: '100%' }} colon={false} label={<span style={{fontWeight:'normal'}}>受案时间</span>} >
              {getFieldDecorator('sasj',{initialValue: [moment('2017-11-01'),moment(myDate)]})(
                <RangePicker />
              )}
            </FormItem>
          </Col>
          <Col xxl={8} xl={4} lg={4} md={24}>
            <span className={styles.submitButtons}>
              <Button type="primary" htmlType="submit">查询</Button>
              <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>重置</Button>
              {/*<a style={{ marginLeft: 8 }} onClick={this.toggleForm}>*/}
                {/*展开 <Icon type="down" />*/}
              {/*</a>*/}
            </span>
          </Col>
        </Row>
      </Form>
    );
  }

  renderAdvancedForm() {
    const formItemLayout = {
      labelCol: { span: 8 },
      wrapperCol: { span: 16 },
    };
    const { getFieldDecorator } = this.props.form;
    const myDate=new Date();
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row >
          <Col xl={8} lg={9} md={10}>
            <FormItem {...formItemLayout} style={{ width: '100%' }} colon={false} label={<span style={{fontWeight:'normal'}}>移送案由</span>} >
              {getFieldDecorator('ysay',{initialValue: ['交通肇事罪']})(
                <Select >
                  <Option  value={ '交通肇事罪' } >交通肇事罪</Option>
                  <Option  value={ '危险驾驶罪' } >危险驾驶罪</Option>
                </Select>
              )}
            </FormItem>
          </Col>
          <Col xl={8}  lg={8} md={9}>
            <FormItem {...formItemLayout} style={{ width: '100%' }} colon={false} label={<span style={{fontWeight:'normal'}}>受案时间</span>} >
              {getFieldDecorator('sasj',{initialValue: [moment('2017-11-01'),moment(myDate)]})(
                <RangePicker />
              )}
            </FormItem>
          </Col>
          <Col xl={8} lg={7} md={5}>
            <span >
              <Button type="primary" htmlType="submit">查询</Button>
              <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>重置</Button>
              {/*<a style={{ marginLeft: 8 }} onClick={this.toggleForm}>*/}
                {/*收起 <Icon type="up" />*/}
              {/*</a>*/}
            </span>
          </Col>
        </Row>
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
