import React from 'react';
import { Form, Row, Col, Button, Select, DatePicker, Icon, Input } from 'antd';
import styles from '../TJFX/Search.less';
import moment from 'moment';
const RangePicker = DatePicker.RangePicker;
const FormItem = Form.Item;
const Option = Select.Option;

class SearchForm extends React.Component {
  constructor(props){
    super(props);
    const myDate=new Date();
    this.state={
      // addInputValue: '',
      // modalVisible: false,
      expandForm: false,
      // selectedRows: [],
      // formValues: {},
      ysay:['交通肇事罪'],
      sasj:[moment('2017-11-01'),moment(myDate)],
      bxtbasj:'',
      ajmc:'',
      bmsah:''
    }
  };

  componentWillReceiveProps(nextProps) {
    if (nextProps.searchValue){
      this.setState({
        ysay:nextProps.searchValue.ysay,
        sasj:[moment(nextProps.searchValue.sasj_startDate),moment(nextProps.searchValue.sasj_endDate)]
      })
    }
  }

  handleSearch = (e) => {
    e.preventDefault();

    const { dispatch, form, onSearch } = this.props;
    const { expandForm, sasj, bxtbasj, ajmc, bmsah   }=this.state;
    form.validateFields((err, fieldsValue) => {

      if (err) return;
      if (!err) {
        this.setState({
          ...fieldsValue,
        });
        const myDate=new Date();
        const sasj_startDate = fieldsValue.sasj && fieldsValue.sasj.length > 0 ? moment(fieldsValue.sasj[0]).format("YYYY-MM-DD") : '';
        const sasj_endDate = fieldsValue.sasj && fieldsValue.sasj.length > 0 ? moment(fieldsValue.sasj[1]).format("YYYY-MM-DD") : '';
        const bjsj_startDate = fieldsValue.bxtbasj && fieldsValue.bxtbasj.length > 0 ? moment(fieldsValue.bxtbasj[0]).format("YYYY-MM-DD") : '';
        const bjsj_endDate = fieldsValue.bxtbasj && fieldsValue.bxtbasj.length > 0 ? moment(fieldsValue.bxtbasj[1]).format("YYYY-MM-DD") : '';
        const values = {
          gh: fieldsValue.gh,
          ysay: fieldsValue.ysay ? fieldsValue.ysay:['交通肇事罪'],
          sasj_startDate: sasj_startDate,
          sasj_endDate: sasj_endDate,
          bjsj_startDate: bjsj_startDate,
          bjsj_endDate: bjsj_endDate,
          ajmc: expandForm ? fieldsValue.ajmc : ajmc ,
          bmsah: expandForm ? fieldsValue.bmsah : bmsah,
        };
        onSearch(values);
      }
      const values = {
        ...fieldsValue,
        updatedAt: fieldsValue.updatedAt && fieldsValue.updatedAt.valueOf(),
      };

      // this.setState({
      //   formValues: values,
      // });

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
      labelCol: { span: 8 },
      wrapperCol: { span: 16 },
    };
    const { getFieldDecorator } = this.props.form;
    const { gh }=this.props;
    const { ysay }=this.state;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row >
          <Col span={7}>
            <FormItem {...formItemLayout} style={{ width: '100%' }} colon={false} label={<span style={{fontWeight:'normal'}}>承办人</span>} >
              {getFieldDecorator('gh',{initialValue: gh})(
                <Select >
                  {
                    this.props.cbrTreeList&&this.props.cbrTreeList.map((obj, index) => {
                      return (
                        <Select.Option key={index} value={obj.gh}>{obj.mc}</Select.Option>
                      );
                    })
                  }
                </Select>
              )}
            </FormItem>
          </Col>
          <Col span={7} offset={1} >
            <FormItem {...formItemLayout} style={{ width: '100%' }} colon={false} label={<span style={{fontWeight:'normal'}}>移送案由</span>} >
              {getFieldDecorator('ysay',{initialValue: ysay})(
                <Select mode="multiple" >
                  <Option  value={ '交通肇事罪' } >交通肇事罪</Option>
                  <Option  value={ '危险驾驶罪' } >危险驾驶罪</Option>
                </Select>
              )}
            </FormItem>
          </Col>
          <Col span={8} offset={1}>
            <span className={styles.submitButtons}>
              <Button type="primary" htmlType="submit">查询</Button>
              <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>重置</Button>
              <a style={{ marginLeft: 8 }} onClick={this.toggleForm}>
              展开 <Icon type="down" />
              </a>
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
    const {gh }=this.props;
    const { ysay, sasj, bxtbasj, ajmc, bmsah   }=this.state;

    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row >
          <Col span={7}>
            <FormItem {...formItemLayout} style={{ width: '100%' }} colon={false} label={<span style={{fontWeight:'normal'}}>承办人</span>} >
              {getFieldDecorator('gh',{initialValue: gh})(
                <Select >
                  {
                    this.props.cbrTreeList&&this.props.cbrTreeList.map((obj, index) => {
                      return (
                        <Select.Option key={index} value={obj.gh}>{obj.mc}</Select.Option>
                      );
                    })
                  }
                </Select>
              )}
            </FormItem>
          </Col>
          <Col span={7} offset={1} >
            <FormItem {...formItemLayout} style={{ width: '100%' }} colon={false} label={<span style={{fontWeight:'normal'}}>移送案由</span>} >
              {getFieldDecorator('ysay',{initialValue: ysay})(
                <Select mode="multiple">
                  <Option  value={ '交通肇事罪' } >交通肇事罪</Option>
                  <Option  value={ '危险驾驶罪' } >危险驾驶罪</Option>
                </Select>
              )}
            </FormItem>
          </Col>
          <Col span={7} offset={1} >
            <FormItem {...formItemLayout} style={{ width: '100%' }} colon={false} label={<span style={{fontWeight:'normal'}}>受案时间</span>} >
              {getFieldDecorator('sasj',{initialValue: sasj[0]._isValid ? sasj:[]})(
                <RangePicker />
              )}
            </FormItem>
          </Col>
          <Col span={7}>
            <FormItem {...formItemLayout} style={{ width: '100%' }} colon={false} label={<span style={{fontWeight:'normal'}}>本系统办结时间</span>} >
              {getFieldDecorator('bxtbasj',{initialValue: bxtbasj })(
                <RangePicker />
              )}
            </FormItem>
          </Col>
          <Col span={7} offset={1} >
            <FormItem {...formItemLayout} style={{ width: '100%' }} colon={false} label={<span style={{fontWeight:'normal'}}>嫌疑人姓名</span>} >
              {getFieldDecorator('ajmc',{initialValue: ajmc})(
                <Input />
              )}
            </FormItem>
          </Col>
          <Col span={7} offset={1} >
            <FormItem {...formItemLayout} style={{ width: '100%' }} colon={false} label={<span style={{fontWeight:'normal'}}>受案号</span>} >
              {getFieldDecorator('bmsah',{initialValue: bmsah})(
                <Input />
              )}
            </FormItem>
          </Col>
        </Row>
        <div style={{ overflow: 'hidden', marginTop: 15 }}>
            <span style={{ float: 'right' }}>
              <Button type="primary" htmlType="submit">查询</Button>
              <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>重置</Button>
              <a style={{ marginLeft: 8 }} onClick={this.toggleForm}>
                收起 <Icon type="up" />
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
