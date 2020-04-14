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
    const endDate = moment(myDate).format('YYYY-MM-DDTHH:mm:ss');
    this.state = {
      expandForm: false,
      startTime: '2017-11-12',
      endTime: endDate,
      zm:'',
    }
  };
  componentDidMount(){
    const {dispatch} = this.props;
    dispatch({
      type: 'portal/countBylili',
      payload: {

      },
    }).then(({data,success}) => {
      if (data && success) {
        this.setState({
          zm: data.data,
        })
      }
    });
  }

  handleSearch = (e) => {
    e.preventDefault();
    const {dispatch, form, onSearch} = this.props;
    const {startTime, endTime} = this.state;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      onSearch && onSearch(fieldsValue);
    });
  };

  onExport = () => {
    this.props.form.validateFields((errs,values) => {
      if(errs){
        return
      }
      this.props.onExport && this.props.onExport(values);
    })
  };

  //时间查询
  disabledSasjStartDate = (startTime) => {
    const endTime = moment(this.state.endTime);
    if (!startTime || !endTime) {
      return false;
    }
    return startTime.valueOf() > endTime.valueOf();
  };

  disabledSasjEndDate = (endTime) => {
    const startTime = moment(this.state.startTime);
    if (!endTime || !startTime) {
      return false;
    }
    return endTime.valueOf() <= startTime.valueOf();
  };

  onChange = (field, value) => {
    const date = value ? moment(value).format('YYYY-MM-DD') : '';
    this.setState({
      [field]: date,
    });
  };

  onSasjStartChange = (value) => {
    this.onChange('startTime', value);
  };

  onSasjEndChange = (value) => {
    this.onChange('endTime', value);
  };

  renderSimpleForm() {
    const formItemLayout = {
      labelCol: {span: 6},
      wrapperCol: {span: 18},
    };
    const {getFieldDecorator} = this.props.form;
    const {startTime,endTime,zm} = this.state;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row type="flex" justify="space-around">
          <Col span={10}>
            <Col span={12}>
              <FormItem {...formItemLayout} style={{width: '100%'}} colon={false}
                        label={<span style={{fontWeight: 'normal'}}>开始时间:</span>}>
                {getFieldDecorator('startTime', {initialValue: moment(startTime)})(
                  <DatePicker
                    disabledDate={this.disabledSasjStartDate}
                    onChange={this.onSasjStartChange}
                  />
                )}
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem {...formItemLayout} style={{width: '100%'}} colon={false}
                        label={<span style={{fontWeight: 'normal'}}>结束时间:</span>}>
                {getFieldDecorator('endTime', {initialValue: moment(endTime)})(
                  <DatePicker
                    disabledDate={this.disabledSasjEndDate}
                    onChange={this.onSasjEndChange}
                  />
                )}
              </FormItem>
            </Col>
          </Col>
          <Col span={5} offset={1}>
            <FormItem {...formItemLayout} style={{width: '100%'}} colon={false}
                      label={<span style={{fontWeight: 'normal'}}>移送案由:</span>}>
              {getFieldDecorator('zm',{initialValue: ['盗窃罪']})(
                  <Select mode="multiple"
                  style={{marginLeft: 8,width: '60%',marginTop:4}}>
                {
                  zm&&zm.length>0 ? zm.map((item,index)=>{
                  return (
                  <Option key={index} value={item}>{item}</Option>
                  )
                }):[]
                }
                  </Select>
              )}

            </FormItem>
          </Col>
          <Col span={7} offset={1}>
            <span className={styles.submitButtons}>
              <Button type="primary"  htmlType="submit">查询</Button>
              <Button onClick={this.onExport}
                      style={{marginLeft: 20}}
                      type="primary">
              导出
            </Button>
            </span>
          </Col>
        </Row>
      </Form>

    );
  }

  render() {
    return (
      <div className={styles.default}>
        {this.renderSimpleForm()}
      </div>
    );
  }
}
export default Form.create()(SearchForm);

