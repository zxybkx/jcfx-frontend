import React, {PureComponent} from 'react';
import {connect} from 'dva';
import {Link} from 'dva/router';
import {Form, Row, Col, Button, DatePicker, Select} from 'antd';
import {INTEGRATE} from '../../constant';
import Authorized from 'utils/Authorized';
import MapChart from './components/MapChart';
import AjtsChart from './components/AjtsChart';
import Dt from './components/Dt';
import Drdt from './components/Drdt';
import ZbChart from './components/ZbChart';
import TbhbChart from './components/TbhbChart';
import PageHeaderLayout from 'lib/Layout/PageHeaderLayout';
import styles from './index.less';
import moment from 'moment';

const FormItem = Form.Item;
const Option = Select.Option;
const RangePicker = DatePicker.RangePicker;

@connect(({tjfx, loading}) => ({
  tjfx: tjfx,
}))
class Home extends PureComponent {
  constructor(props) {
    super(props);
    const myDate = new Date();
    const endDate = moment(myDate).format('YYYY-MM-DD');
    this.state = {
      type: '1',
      cs: '受理',
      ajlb: 'all',
      ysay: '交通肇事罪',
      sasjStart: '2017-10-24',
      sasjEnd: endDate,
      bjsjStart: '2017-11-01',
      bjsjEnd: endDate,
      dwbm: '32',

      dtlb: 'saqk',
      baqkList: {},    //办案情况列表
      drdtList: {},    //当日动态列表
      btList: {},      //饼图数据
      tbhbList: {},    //同比环比
      ajtsList: [],    //案件态势
      qyfbList: [],    //区域分布
      ajpmList: [],     //案件排名
      ajhsList: [],       //案件回溯
      searchVal: {}       //查询条件
    };
  }

  componentDidMount() {
    //this.getDailyCount();
    this.getCount();
  }

  // 检索
  onAjlbClick = (type) => {
    this.setState({ajlb: type}, () => {
      //this.getDailyCount();
      this.getCount();
    });
  };
  onYsayClick = (values) => {
    this.setState({
      ysay: values,
    }, () => {
      //this.getDailyCount();
      this.getCount();
    });
  };
  onDwbmChange = (values) => {
    this.setState({dwbm: values}, () => {
      //this.getDailyCount();
      this.getCount();
    });
    //console.log(this.state.values);
  };

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

  // 受案开始时间
  onSasjStartChange = (value) => {
    this.onTimeChange('sasjStart', value);
  };

  // 受案结束时间
  onSasjEndChange = (value) => {
    this.onTimeChange('sasjEnd', value);
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

  // 办结开始时间
  onBjsjStartChange = (value) => {
    this.onTimeChange('bjsjStart', value);
  };

  // 办结结束时间
  onBjsjEndChange = (value) => {
    this.onTimeChange('bjsjEnd', value);
  };

  onTimeChange = (field, value) => {
    const date = value ? moment(value).format('YYYY-MM-DD') : '';

    //console.log(value);
    this.setState({
      [field]: date,
      timeValue: 'value',
    }, () => {
      this.getCount();
    });
  };

  /*getDailyCount = () => {
    const {dispatch} = this.props;
    const {ajlb, ysay, dwbm} = this.state;
    dispatch({
      type: 'portal/getDrbaqk',
      payload: {ajlb, ysay, dwbm},
    }).then(({data, success}) => {
      if (data && success) {
        this.setState({
          drdtList: data
        })
      }
    });
  };*/
  getCount = () => {
    const {dispatch} = this.props;
    const {dtlb, ajlb, ysay, sasjStart, sasjEnd, bjsjStart, bjsjEnd, dwbm, cs} = this.state;
    const data = {ajlb, ysay, sasjStart, sasjEnd, bjsjStart, bjsjEnd, dwbm};
    dispatch({
      type: 'portal/getBaqk',
      payload: data,
    }).then(({data, success}) => {
      if (data && success) {
        this.setState({
          baqkList: data
        })
      }
    });
    this.onAqChange(dtlb, cs);
  };

  onAqChange = (dtlb, i) => {
    const {dispatch} = this.props;
    const {ajlb, ysay, sasjStart, sasjEnd, bjsjStart, bjsjEnd, dwbm} = this.state;
    if (dtlb !== this.state.dtlb) {
      this.setState({
        dtlb: dtlb
      });
    }
    const data = {ajlb, ysay, sasjStart, sasjEnd, bjsjStart, bjsjEnd, dwbm};

    this.setState({
      searchVal: data,
      cs: i
    });

    // 饼图
    dispatch({
      type: 'portal/getZb',
      payload: {
        ...data,
        lb: dtlb,
      },
    }).then(({data, success}) => {
      if (data && success) {
        this.setState({
          btList: data.data
        })
      }
    });

    // 同比环比
    dispatch({
      type: 'portal/getTbhb',
      payload: {
        ...data,
        type: i,
      },
    }).then(({data, success}) => {
      if (data && success) {
        this.setState({
          tbhbList: data
        })
      }
    });

    // 案件态势
    dispatch({
      type: 'portal/getAjts',
      payload: {
        ...data,
        type: i,
      }
    }).then(({data, success}) => {
      if (data && success) {
        // console.log(data);
        this.setState({
          ajtsList: data
        })
      }
    });

    // 区域分布
    dispatch({
      type: 'portal/getQyfb',
      payload: {
        ...data,
        type: i,
      }
    }).then(({data, success}) => {
      if (data && success) {
        // console.log(data);
        this.setState({
          qyfbList: data
        })
      }
    });

    // 案件排名
    dispatch({
      type: 'portal/getAjpm',
      payload: {
        ...data,
        type: i,
      }
    }).then(({data, success}) => {
      if (data && success) {
        this.setState({
          ajpmList: data
        })
      }
    });
  };

  renderForm() {
    const {getFieldDecorator} = this.props.form;
    const formItemLayout = {
      labelCol: {span: 6},
      wrapperCol: {span: 18},
    };
    const {sasjStart, sasjEnd, bjsjStart, bjsjEnd, ysay} = this.state;
    return (
      <Form className={styles.form}>
        <Row gutter={16} className={styles.search}>
          <Col span={11}>
            <FormItem {...formItemLayout} style={{width: '100%', margin: 0, padding: 0}} colon={false}
                      label={<span style={{fontWeight: 'normal', color: 'white'}}>案件类别</span>}>
              {getFieldDecorator('ajlb', {initialValue: 'all'})(
                <Select size="small" onChange={this.onAjlbClick}>
                  <Option value={'all'}>全部</Option>
                  <Option value={'ZJ'}>审查逮捕</Option>
                  <Option value={'GS'}>审查起诉</Option>
                </Select>
              )}
            </FormItem>
          </Col>
          <Col span={11} offset={1}>
            <FormItem {...formItemLayout} style={{width: '100%', margin: 0, padding: 0}} colon={false}
                      label={<span style={{fontWeight: 'normal', color: 'white'}}>移送案由</span>}>
              {getFieldDecorator('ysay', {initialValue: '交通肇事罪'})(
                <Select size="small" onChange={this.onYsayClick}>
                  <Option value={'交通肇事罪'}>交通肇事罪</Option>
                  <Option value={'危险驾驶罪'}>危险驾驶罪</Option>
                  <Option value={'盗窃罪'}>盗窃罪</Option>
                </Select>
              )}
            </FormItem>
          </Col>
          <Col span={11}>
            <FormItem {...formItemLayout} style={{width: '100%', margin: 0, padding: 0}} colon={false}
                      label={<span style={{fontWeight: 'normal', color: 'white'}}>受案时间</span>}>
              <Col span={12}>
                {getFieldDecorator('sasjStart', {initialValue: ysay === '交通肇事罪' ? moment(sasjStart) : moment('2018-01-01')})(
                  <DatePicker size="small"
                              disabledDate={this.disabledSasjStartDate}
                              onChange={this.onSasjStartChange}
                  />
                )}
              </Col>
              <Col span={12}>
                {getFieldDecorator('sasjEnd', {initialValue: moment(sasjEnd)})(
                  <DatePicker size="small"
                              disabledDate={this.disabledSasjEndDate}
                              onChange={this.onSasjEndChange}
                  />
                )}
              </Col>
            </FormItem>
          </Col>
          <Col span={11} offset={1}>
            <FormItem {...formItemLayout} style={{width: '100%', margin: 0, padding: 0}} colon={false}
                      label={<span style={{fontWeight: 'normal', color: 'white'}}>办结时间</span>}>
              <Col span={12}>
                {getFieldDecorator('bjsjStart', {initialValue: ysay === '交通肇事罪' ? moment(bjsjStart) : moment('2018-04-01')})(
                  <DatePicker size="small"
                              disabledDate={this.disabledBjsjStartDate}
                              onChange={this.onBjsjStartChange}
                  />
                )}
              </Col>
              <Col span={12}>
                {getFieldDecorator('bjsjEnd', {initialValue: moment(bjsjEnd)})(
                  <DatePicker size="small"
                              disabledDate={this.disabledBjsjEndDate}
                              onChange={this.onBjsjEndChange}
                  />
                )}
              </Col>
            </FormItem>
          </Col>
        </Row>
      </Form>
    );
  }

  render() {
    const {dispatch} = this.props;
    const {ajlb, baqkList, drdtList, btList, tbhbList, ajtsList, qyfbList, ajpmList, ajhsList, searchVal, cs, dwbm, dtlb} = this.state;
    const mapProps = {onDwbmChange: this.onDwbmChange};
    const dtProps = {ajlb, baqkList, ajhsList, searchVal, dispatch, onAqChange: this.onAqChange};
    const drdtProps = {drdtList, searchVal, dispatch, ajhsList, ajlb};
    const btProps = {btList, searchVal, dispatch, ajhsList, ajlb, dtlb};
    const tbhbProps = {tbhbList, searchVal, dispatch, ajhsList, ajlb, cs};
    const ajtsProps = {ajtsList, qyfbList, ajpmList, searchVal, dispatch, ajhsList, ajlb, cs, dwbm};

    const content = (
      <Authorized authority={['ROLE_SUPER_ADMIN', 'ROLE_ADMIN', 'ROLE_USER']}
                  redirectPath="/passport/sign-in">
        <div className={INTEGRATE ? styles.integrateBackground : styles.background}>
          <div className={styles.default}>
            <Row gutter={16}>
              <Col span={11}>
                <Row className={styles.left}>
                  <Col span={24} className={styles.card1}>
                    {this.renderForm()}
                  </Col>
                  <Col span={24} className={styles.card2}>
                    <MapChart {...mapProps}/>
                  </Col>
                  {/*<Col span={24} className={styles.card3}>
                    <Dt {...dtProps}/>
                  </Col>*/}
                </Row>
              </Col>
              <Col span={13}>
                <Row className={styles.right}>
                  <Col span={24} className={styles.card3}>
                    <Dt {...dtProps}/>
                  </Col>
                  {/*<Col span={24} className={styles.card4}>
                    <Drdt {...drdtProps}/>
                  </Col>*/}
                  <Col span={8} className={styles.card5}>
                    {/*<ZbChart btList={btList}/>*/}
                    <ZbChart {...btProps}/>
                  </Col>
                  <Col span={16} className={styles.card6}>
                    <TbhbChart  {...tbhbProps}/>
                  </Col>
                  <Col span={24} className={styles.card7}>
                    <AjtsChart {...ajtsProps} />
                  </Col>
                </Row>
              </Col>
            </Row>
          </div>
        </div>
      </Authorized>
    );
    if (INTEGRATE) {
      return content;
    }
    return (
      <PageHeaderLayout>
        {content}
      </PageHeaderLayout>
    );
  }
}

export default Form.create()(Home);
