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
      ajlb: 'all',
      ysay: '交通肇事罪',
      sasjStart: '2017-10-24',
      sasjEnd: endDate,
      bjsjStart: '2017-11-01',
      bjsjEnd: endDate,
    }
  };

  componentWillReceiveProps(nextProps) {
    if (nextProps.searchValue !== this.props.searchValue) {
      this.setState({
        ...nextProps.searchValue
      })
    }
  }

  handleSearch = (e) => {
    e.preventDefault();

    const {dispatch, form, onSearch} = this.props;
    const {sasjStart, sasjEnd, bjsjStart, bjsjEnd} = this.state;
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
          sasjStart: sasjStart,
          sasjEnd: sasjEnd,
          bjsjStart: bjsjStart,
          bjsjEnd: bjsjEnd,
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

  onYsayChange = (value) => {
    const myDate = new Date();
    const endDate = moment(myDate).format('YYYY-MM-DD');
    switch (value) {
      case '交通肇事罪':
        this.setState({
          sasjStart: '2017-10-24',
          sasjEnd: endDate,
          bjsjStart: '2017-11-01',
          bjsjEnd: endDate,
        });
        break;
      default:
        this.setState({
          sasjStart: '2018-01-01',
          sasjEnd: endDate,
          bjsjStart: '2018-04-01',
          bjsjEnd: endDate,
        });
        break;
    }
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
        <Row type="flex" justify="space-around">
          <Col span={7}>
            <FormItem {...formItemLayout} style={{width: '100%'}} colon={false}
                      label={<span style={{fontWeight: 'normal'}}>案件类别</span>}>
              {getFieldDecorator('ajlb', {initialValue: ajlb})(
                <Select >
                  <Option value={ 'all' }>全部</Option>
                  <Option value={ 'ZJ' }>审查逮捕</Option>
                  <Option value={ 'GS' }>审查起诉</Option>
                </Select>
              )}
            </FormItem>
          </Col>
          <Col span={7} offset={1}>
            <FormItem {...formItemLayout} style={{width: '100%'}} colon={false}
                      label={<span style={{fontWeight: 'normal'}}>移送案由</span>}>
              {getFieldDecorator('ysay', {initialValue: ysay})(
                <Select onChange={this.onYsayChange}>
                  <Option value={ '交通肇事罪' }>交通肇事罪</Option>
                  <Option value={ '危险驾驶罪' }>危险驾驶罪</Option>
                  <Option value={ '盗窃罪' }>盗窃罪</Option>
                  <Option value={'故意伤害罪'}>故意伤害罪</Option>
                </Select>
              )}
            </FormItem>
          </Col>
          <Col span={7} offset={1}>
            <span className={styles.submitButtons}>
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

  //受案
  disabledSasjStartDate = (sasjStart) => {
    const sasjEnd = moment(this.state.sasjEnd);
    if (!sasjStart || !sasjEnd) {
      return false;
    }
    return sasjStart.valueOf() > sasjEnd.valueOf();
  };

  disabledSasjEndDate = (sasjEnd) => {
    const sasjStart = moment(this.state.sasjStart);
    if (!sasjEnd || !sasjStart) {
      return false;
    }
    return sasjEnd.valueOf() <= sasjStart.valueOf();
  };

  onChange = (field, value) => {
    const date = value ? moment(value).format('YYYY-MM-DD') : '';
    this.setState({
      [field]: date,
    });
  };

  onSasjStartChange = (value) => {
    this.onChange('sasjStart', value);
  };

  onSasjEndChange = (value) => {
    this.onChange('sasjEnd', value);
  };


  //办结
  disabledBjsjStartDate = (bjsjStart) => {
    const bjsjEnd = moment(this.state.bjsjEnd);
    if (!bjsjStart || !bjsjEnd) {
      return false;
    }
    return bjsjStart.valueOf() > bjsjEnd.valueOf();
  };

  disabledBjsjEndDate = (bjsjEnd) => {
    const bjsjStart = moment(this.state.bjsjStart);
    if (!bjsjEnd || !bjsjStart) {
      return false;
    }
    return bjsjEnd.valueOf() <= bjsjStart.valueOf();
  };

  onBjsjStartChange = (value) => {
    this.onChange('bjsjStart', value);
  };

  onBjsjEndChange = (value) => {
    this.onChange('bjsjEnd', value);
  };


  renderAdvancedForm() {
    const formItemLayout = {
      labelCol: {span: 8},
      wrapperCol: {span: 16},
    };
    const {getFieldDecorator} = this.props.form;
    const {ajlb, ysay, sasjStart, sasjEnd, bjsjStart, bjsjEnd} = this.state;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row >
          <Col span={10}>
            <FormItem {...formItemLayout} style={{width: '100%'}} colon={false}
                      label={<span style={{fontWeight: 'normal'}}>案件类别</span>}>
              {getFieldDecorator('ajlb', {initialValue: ajlb})(
                <Select >
                  <Option value={ 'all' }>全部</Option>
                  <Option value={ 'ZJ' }>审查逮捕</Option>
                  <Option value={ 'GS' }>审查起诉</Option>
                </Select>
              )}
            </FormItem>
          </Col>
          <Col span={10} offset={1}>
            <FormItem {...formItemLayout} style={{width: '100%'}} colon={false}
                      label={<span style={{fontWeight: 'normal'}}>移送案由</span>}>
              {getFieldDecorator('ysay', {initialValue: ysay})(
                <Select onChange={this.onYsayChange}>
                  <Option value={ '交通肇事罪' }>交通肇事罪</Option>
                  <Option value={ '危险驾驶罪' }>危险驾驶罪</Option>
                  <Option value={ '盗窃罪' }>盗窃罪</Option>
                  <Option value={'故意伤害罪'}>故意伤害罪</Option>
                </Select>
              )}
            </FormItem>
          </Col>
          <Col span={10}>
            <FormItem {...formItemLayout} style={{width: '100%'}} colon={false}
                      label={<span style={{fontWeight: 'normal'}}>受案时间</span>}>
              <Col span={12}>
                {getFieldDecorator('sasjStart', {initialValue: moment(sasjStart)})(
                  <DatePicker
                    disabledDate={this.disabledSasjStartDate}
                    onChange={this.onSasjStartChange}
                  />
                )}
              </Col>
              <Col span={12}>
                {getFieldDecorator('sasjEnd', {initialValue: moment(sasjEnd)})(
                  <DatePicker
                    disabledDate={this.disabledSasjEndDate}
                    onChange={this.onSasjEndChange}
                  />
                )}
              </Col>
            </FormItem>
          </Col>
          <Col span={10} offset={1}>
            <FormItem {...formItemLayout} style={{width: '100%'}} colon={false}
                      label={<span style={{fontWeight: 'normal'}}>办结时间</span>}>
              <Col span={12}>
                {getFieldDecorator('bjsjStart', {initialValue: moment(bjsjStart)})(
                  <DatePicker
                    disabledDate={this.disabledBjsjStartDate}
                    onChange={this.onBjsjStartChange}
                  />
                )}
              </Col>
              <Col span={12}>
                {getFieldDecorator('bjsjEnd', {initialValue: moment(bjsjEnd)})(
                  <DatePicker
                    disabledDate={this.disabledBjsjEndDate}
                    onChange={this.onBjsjEndChange}
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
