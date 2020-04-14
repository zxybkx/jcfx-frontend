import React from 'react';
import {Form, Row, Col, Button, Select, DatePicker, Icon, Input} from 'antd';
import styles from '../../../components/TJFX/Search.less';
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
      ajlb: ['ZJ', 'GS', 'SP'],
      ysay: '交通肇事罪',
      cbr: '',
      sasjStart: '2017-10-24',
      sasjEnd: endDate,
      bjsjStart: '2017-11-01',
      bjsjEnd: endDate,
      bmsah: '',
    }
  };

  componentWillReceiveProps(nextProps) {
    if (nextProps.searchValue !== this.props.searchValue) {
      this.setState({
        ...nextProps.searchValue,
      })
    }
  }

  handleSearch = (e) => {
    e.preventDefault();
    const {dispatch, form, onSearch} = this.props;
    const {sasjStart, sasjEnd, bjsjStart, bjsjEnd, gh} = this.state;
    form.validateFields((err, fieldsValue) => {
      if (err) {
        return
      }
      ;
      if (!err) {
        this.setState({
          ajlb: fieldsValue.ajlb,
          ysay: fieldsValue.ysay,
          gh: gh,
          bmsah: fieldsValue.bmsah,
        });
        const values = {
          ajlb: fieldsValue.ajlb,
          ysay: fieldsValue.ysay,
          gh: gh,
          sasjStart: sasjStart,
          sasjEnd: sasjEnd,
          bjsjStart: bjsjStart,
          bjsjEnd: bjsjEnd,
          bmsah: fieldsValue.bmsah,
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
    const {form} = this.props
    // const myDate = new Date();
    // const endDate = moment(myDate).format('YYYY-MM-DD');

    form.validateFields((err, fieldsValue) => {
      this.setState({
        sasjStart: fieldsValue.sasjStart ? moment(fieldsValue.sasjStart).format('YYYY-MM-DD') : '',
        sasjEnd: fieldsValue.sasjEnd ? moment(fieldsValue.sasjEnd).format('YYYY-MM-DD') : '',
        bjsjStart: fieldsValue.bjsjStart ? moment(fieldsValue.bjsjStart).format('YYYY-MM-DD') : '',
        bjsjEnd: fieldsValue.bjsjEnd ? moment(fieldsValue.bjsjEnd).format('YYYY-MM-DD') : '',
      });
    })
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
                <Select mode='multiple'>
                  {/*<Option value={ 'all' }>全部</Option>*/}
                  <Option value={'ZJ'}>审查逮捕</Option>
                  <Option value={'GS'}>审查起诉</Option>
                  <Option value={'SP'}>审判监督</Option>
                </Select>
              )}
            </FormItem>
          </Col>
          <Col span={8}>
            <FormItem {...formItemLayout} style={{width: '100%'}} colon={false}
                      label={<span style={{fontWeight: 'normal'}}>移送案由</span>}>
              {getFieldDecorator('ysay', {initialValue: ysay})(
                <Select onChange={this.onYsayChange} mode='multiple'>
                  <Option value={'交通肇事罪'}>交通肇事罪</Option>
                  <Option value={'危险驾驶罪'}>危险驾驶罪</Option>
                  <Option value={'盗窃罪'}>盗窃罪</Option>
                  <Option value={'故意伤害罪'}>故意伤害罪</Option>
                </Select>
              )}
            </FormItem>
          </Col>
          <Col span={8}>
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

  onChangenew = (value) => {
    this.setState({
      gh: value
    })
  };

  renderAdvancedForm() {
    const formItemLayout = {
      labelCol: {span: 6},
      wrapperCol: {span: 18},
    };
    const {getFieldDecorator} = this.props.form;
    const {ajlb, ysay, gh, sasjStart, sasjEnd, bjsjStart, bjsjEnd, bmsah} = this.state;

    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={16}>
          <Col span={8}>
            <FormItem {...formItemLayout} style={{width: '100%'}} colon={false}
                      label={<span style={{fontWeight: 'normal'}}>案件类别</span>}>
              {getFieldDecorator('ajlb', {initialValue: ajlb})(
                <Select mode='multiple'>
                  {/*<Option value={ 'all' }>全部</Option>*/}
                  <Option value={'ZJ'}>审查逮捕</Option>
                  <Option value={'GS'}>审查起诉</Option>
                  <Option value={'SP'}>审判监督</Option>
                </Select>
              )}
            </FormItem>
          </Col>
          <Col span={8}>
            <FormItem {...formItemLayout} style={{width: '100%'}} colon={false}
                      label={<span style={{fontWeight: 'normal'}}>移送案由</span>}>
              {getFieldDecorator('ysay', {initialValue: ysay})(
                <Select onChange={this.onYsayChange} mode='multiple'>
                  <Option value={'交通肇事罪'}>交通肇事罪</Option>
                  <Option value={'危险驾驶罪'}>危险驾驶罪</Option>
                  <Option value={'盗窃罪'}>盗窃罪</Option>
                  <Option value={'故意伤害罪'}>故意伤害罪</Option>
                </Select>
              )}
            </FormItem>
          </Col>
          <Col span={8}>
            <FormItem {...formItemLayout} style={{width: '100%'}} colon={false}
                      label={<span style={{fontWeight: 'normal'}}>承办人</span>}>
              {getFieldDecorator('gh', {initialValue: gh})(
                <Select
                  showSearch
                  optionFilterProp="children"
                  onChange={this.onChangenew}
                  filterOption={(input, option) =>
                  option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                  }
                >
                  {
                    this.props.cbrTreeList && this.props.cbrTreeList.map((obj, index) => {
                      return (
                        <Option key={index} value={obj.gh}>{obj.mc}</Option>
                      );
                    })
                  }
                </Select>,
              )}
            </FormItem>
          </Col>
          <Col span={8}>
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
          <Col span={8}>
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
          <Col span={8}>
            <FormItem {...formItemLayout} style={{width: '100%'}} colon={false}
                      label={<span style={{fontWeight: 'normal'}}>关键字</span>}>
              {getFieldDecorator('bmsah', {initialValue: bmsah})(
                <Input placeholder="查询案件名称，部门受案号等"/>
              )}
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
