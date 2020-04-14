import React, {Component, Fragment} from 'react';
import {Button, Row, Col, DatePicker, Card, Select, Form, Radio} from 'antd';
import classnames from 'classnames';
import PageHeaderLayout from 'lib/Layout/PageHeaderLayout';
import TreeLayout from 'lib/Layout/TreeLayout';
import SearchTree from '../../../components/Tree/SearchTree';
import Modal from './Modal';
import Trend from './trend';
import {INTEGRATE} from '../../../constant';
import styles from './Main.less';
import moment from 'moment';
import _ from 'lodash';
import ChartInfo from './ChartInfo';
import icon from '../../../assets/icon.png';
import p1 from '../../../assets/p1.png';
import p2 from '../../../assets/p2.png';
import p3 from '../../../assets/p3.png';
import p4 from '../../../assets/p4.png';

const Option = Select.Option;
const FormItem = Form.Item;
@Form.create()

export default class TJFX extends Component {

  constructor(props) {
    super(props);
    const myDate = new Date();
    const endDate = moment(myDate).format('YYYY-MM-DD');
    const startDate = moment().subtract(1, "days").format("YYYY-MM-DD")

    this.state = {
      fullScreen: false,
      startTime: startDate,
      endTime: endDate,
      type: 'table',
      queryType: 'table',
      visible: true,
      modalVisible: false,
      trendType: '',
      month: [],
      value: []
    };
  }

  componentDidMount() {
    const {queryType} = this.props;
    this.setState({
      type: queryType ? queryType : 'table'
    })
  }

  // 构建树
  buildTreeData = (departments) => {
    let treeNode = [];
    if (departments) {
      let nodeMap = {};
      departments.map(d => {
        const a = d.dwbm.split('');
        let node = {};
        if (a[4] === '0' && a[5] === '0') {
          if (a[2] === '0' && a[3] === '7') {
            node = {
              name: d.dwmc,
              value: d.dwbm,
              id: d.dwbm,
            };
          } else {
            const b = d.dwmc.split('');
            node = {
              name: b[0] + b[1] + b[2],
              value: d.dwbm,
              id: d.dwbm,
            };
          }
        } else {
          node = {
            name: d.dwmc,
            value: d.dwbm,
            id: d.dwbm,
          };
        }
        nodeMap[node.value] = node;
      });
      departments.map(d => {
        let parent = nodeMap[d.fdwbm];
        let node = nodeMap[d.dwbm];
        if (parent) {
          if (!parent.children) {
            let node1 = {};
            if (parent.name === '江苏省') {
              node1 = {
                name: '江苏省院',
                value: parent.value,
                id: parent.id + '_1',
              };
            } else {
              node1 = {
                name: parent.name + '院',
                value: parent.value,
                id: parent.id + '_1',
              };
            }
            parent.children = [node1];
          }
          parent.children.push(node);
        }
        if (d.dwjb === '2') {
          treeNode.push(node);
        }
      });
    }
    return treeNode;
  };

  // 全屏切换
  showModal = () => {
    this.setState({fullScreen: !this.state.fullScreen});
  };

  //ysay选择
  ysayChange = (value) => {
    this.props.ysaySelect && this.props.ysaySelect(value);
  };

  //时间查询
  disabledSasjStartDate = (sasjStart) => {
    const endTime = moment(this.state.endTime);
    if (!sasjStart || !endTime) {
      return false;
    }
    return sasjStart.valueOf() > endTime.valueOf();
  };

  disabledSasjEndDate = (sasjEnd) => {
    const startTime = moment(this.state.startTime);
    if (!sasjEnd || !startTime) {
      return false;
    }
    return sasjEnd.valueOf() < startTime.valueOf();
  };

  //时间选择
  onChange = (field, value) => {
    const date = value ? moment(value).format('YYYY-MM-DD') : '';
    this.setState({
      [field]: date,
    });
  }

  onSasjStartChange = (value, date) => {
    const {onTimeChange} = this.props;
    this.onChange('startTime', date);
    const {endTime} = this.state;
    onTimeChange && onTimeChange({sasjStart: date, sasjEnd: endTime});
  };

  onSasjEndChange = (value, date) => {
    const {onTimeChange} = this.props;
    this.onChange('endTime', date);
    const {startTime} = this.state;
    onTimeChange && onTimeChange({sasjStart: startTime, sasjEnd: date});
  };

  buttonChange = e => {
    this.setState({type: e.target.value, visible: false});
  };

  handleOk = () => {
    this.setState({
      modalVisible: false
    })
  };

  handleCancle = () => {
    this.setState({
      modalVisible: false
    })
  };

  click = (o) => {
    const {dispatch, dwbm, ysay, searchValue} = this.props;
    this.setState({modalVisible: true, trendType: o});
    dispatch({
      type: 'tjfx/getZxt',
      payload: {
        ...searchValue,
        ysay: ysay,
        dwbm: dwbm,
        field: o === 'zcjd' ? '侦查监督_折线图' : o === 'rzrf' ? '认罪认罚_折线图' : '量刑采纳_折线图',
      }
    }).then((response) => {
      if (response) {
        const {list, success} = response;
        if (list && success) {
          const month = _.map(list, i => {
            return i.month
          });
          const value = _.map(list, v => {
            return v.value
          });
          this.setState({
            month,
            value
          })
        }
      }
    })
  };


  render() {
    const {dispatch, dwmc, treeList, ColumnsData, treeSelect, baqkList, rbTime, dwbm, page, size, ysay, searchValue, field} = this.props;
    const {fullScreen, startTime, endTime, type, visible, modalVisible, trendType, month, value} = this.state;
    const {getFieldDecorator} = this.props.form;
    const SearchTreeList = {
      tree: this.buildTreeData(treeList),
      expandRoot: [],
      onSelect: treeSelect,
    };
    const h = document.body.clientHeight;
    const newsearchValue = searchValue;


    const ModelList = {
      type,
      dispatch,
      dwmc,
      dwbm,
      rbTime,
      ysay,
      page,
      size,
      startTime,
      endTime,
      newsearchValue,
      field,
      baqkList,
      visible
    };
    const content = (
      <Fragment>
        <div className={classnames(styles.mask, fullScreen ? styles.fullScreen : '')}/>
        <div
          className={classnames(styles.default, INTEGRATE ? styles.integrate : '', fullScreen ? styles.fullScreen : '')}>
          {
            !INTEGRATE && <Button className={styles.trigger}
                                  type='ghost'
                                  onClick={this.showModal}
                                  icon={fullScreen ? 'shrink' : 'arrows-alt'}/>
          }
          <TreeLayout tree={<SearchTree {...SearchTreeList} />} className={styles.content}>
            <div style={{width: '100%', padding: '10px', overflow: 'auto'}}>
              <Row className={styles.title}>
                <Col span={4}>
                  <div style={{fontWeight: 'bold', paddingTop: 8}}>
                    <span>&nbsp;&nbsp;{dwmc}</span>
                  </div>
                </Col>
                <Col span={16} style={{color: '#286BC8'}}>
                  <div className={styles.titlehide}>
                    {ColumnsData.title}
                  </div>
                </Col>
              </Row>
              <Row className={styles.searchBar}>
                <Form layout="inline">
                  <Col span={6}>
                    <FormItem style={{width: '100%'}} colon={false}
                              label={<span style={{fontWeight: 'normal'}}>开始时间:</span>}>
                      {getFieldDecorator('sasjStart', {
                        initialValue: moment(newsearchValue.sasjStart),
                      })(
                        <DatePicker
                          disabledDate={this.disabledSasjStartDate}
                          onChange={this.onSasjStartChange}
                        />
                      )}
                    </FormItem>
                  </Col>
                  <Col span={6}>
                    <FormItem style={{width: '100%'}} colon={false}
                              label={<span style={{fontWeight: 'normal'}}>结束时间:</span>}>
                      {getFieldDecorator('sasjEnd', {initialValue: moment(newsearchValue.sasjEnd)})(
                        <DatePicker
                          disabledDate={this.disabledSasjEndDate}
                          onChange={this.onSasjEndChange}
                        />
                      )}
                    </FormItem>
                  </Col>
                  <Col span={10}>
                    移送案由:
                    <Select defaultValue={ysay}
                            mode="multiple"
                            onChange={this.ysayChange}
                            style={{marginLeft: 10, width: '64%'}}>
                      <Option value="交通肇事罪">交通肇事罪</Option>
                      <Option value="危险驾驶罪">危险驾驶罪</Option>
                      <Option value="盗窃罪">盗窃罪</Option>
                      <Option value="故意伤害罪">故意伤害罪</Option>
                    </Select>
                  </Col>
                  <Col span={2}>
                    <Radio.Group value={type} onChange={this.buttonChange} buttonStyle="solid">
                      <Radio.Button value="picture">图</Radio.Button>
                      <Radio.Button value="table">表</Radio.Button>
                    </Radio.Group>
                  </Col>
                </Form>
              </Row>
              {
                type === 'picture' ?
                  <ChartInfo ModelList={ModelList && ModelList} baqkList={baqkList} type={type}/> :
                  <Card>
                    <img src={icon} alt="logo" className={styles.logo}/>
                    <img src={p1} className={styles.p1}/>
                    <img src={p2} className={styles.p2}/>
                    <img src={p3} className={styles.p3}/>
                    <img src={p4} className={styles.p4}/>
                    {
                      baqkList &&
                      <div style={{paddingLeft: 10, fontSize: '16px'}}>
                        <div>
                          <span className={styles.item}>受理：</span>
                          <Modal title="受理" {...ModelList}><a>{baqkList['受理']}</a></Modal>件
                          <Modal title="受理人数" {...ModelList}><a>{baqkList['受理人数']}</a></Modal>人，
                          其中提请批准逮捕
                          <Modal title="受理_ZJ" {...ModelList}><a>{baqkList['受理_ZJ']}</a></Modal>件
                          <Modal title="受理人数_ZJ" {...ModelList}><a>{baqkList['受理人数_ZJ']}</a></Modal>人，
                          移送审查起诉
                          <Modal title="受理_GS" {...ModelList}><a>{baqkList['受理_GS']}</a></Modal>件
                          <Modal title="受理人数_GS" {...ModelList}><a>{baqkList['受理人数_GS']}</a></Modal>人
                          （
                          直诉
                          <Modal title="直诉_GS" {...ModelList}><a>{baqkList['直诉_GS']}</a></Modal>件
                          <Modal title="直诉人数_GS" {...ModelList}><a>{baqkList['直诉人数_GS']}</a></Modal>人
                          ），
                          电子卷宗
                          <Modal title="案卷总数" {...ModelList}><a>{baqkList['案卷总数']}</a></Modal>册。
                        </div>

                        <div style={{margin: '24px 0'}}>
                          <span className={styles.item} style={{color: 'red'}}>捕：</span>
                          审结提捕案件
                          <Modal title="办结_ZJ" {...ModelList}><a>{baqkList['办结_ZJ']}</a></Modal>件
                          <Modal title="办结人数_ZJ" {...ModelList}><a>{baqkList['办结人数_ZJ']}</a></Modal>人，
                          {/*认罪认罚*/}
                          {/*<Modal title="认罪认罚_ZJ" {...ModelList}><a>{baqkList['认罪认罚_ZJ']}</a></Modal>件*/}
                          {/*<Modal title="认罪认罚人数_ZJ" {...ModelList}><a>{baqkList['认罪认罚人数_ZJ']}</a></Modal>人*/}
                          {/*（*/}
                          {/*未适用*/}
                          {/*<Modal title="未适用认罪认罚_ZJ" {...ModelList}><a>{baqkList['未适用认罪认罚_ZJ']}</a></Modal>件*/}
                          {/*<Modal title="未适用认罪认罚人数_ZJ" {...ModelList}><a>{baqkList['未适用认罪认罚人数_ZJ']}</a></Modal>人*/}
                          {/*），*/}
                          其中批捕
                          <Modal title="批捕_ZJ" {...ModelList}><a>{baqkList['批捕_ZJ']}</a></Modal>件
                          <Modal title="批捕人数_ZJ" {...ModelList}><a>{baqkList['批捕人数_ZJ']}</a></Modal>人，
                          不批捕
                          <Modal title="不批捕_ZJ" {...ModelList}><a>{baqkList['不批捕_ZJ']}</a></Modal>件
                          <Modal title="不批捕人数_ZJ" {...ModelList}><a>{baqkList['不批捕人数_ZJ']}</a></Modal>人
                          （
                          不构罪
                          <Modal title="不构罪_ZJ" {...ModelList}><a>{baqkList['不构罪_ZJ']}</a></Modal>件
                          <Modal title="不构罪人数_ZJ" {...ModelList}><a>{baqkList['不构罪人数_ZJ']}</a></Modal>人，
                          存疑
                          <Modal title="存疑不捕_ZJ" {...ModelList}><a>{baqkList['存疑不捕_ZJ']}</a></Modal>件
                          <Modal title="存疑不捕人数_ZJ" {...ModelList}><a>{baqkList['存疑不捕人数_ZJ']}</a></Modal>人，
                          无逮捕必要
                          <Modal title="无逮捕必要_ZJ" {...ModelList}><a>{baqkList['无逮捕必要_ZJ']}</a></Modal>件
                          <Modal title="无逮捕必要人数_ZJ" {...ModelList}><a>{baqkList['无逮捕必要人数_ZJ']}</a></Modal>人
                          ），
                          移送单位撤回
                          <Modal title="移送单位撤回_ZJ" {...ModelList}><a>{baqkList['移送单位撤回_ZJ']}</a></Modal>件
                          <Modal title="移送单位撤回人数_ZJ" {...ModelList}><a>{baqkList['移送单位撤回人数_ZJ']}</a></Modal>人，
                          拆案
                          <Modal title="拆案_ZJ" {...ModelList}><a>{baqkList['拆案_ZJ']}</a></Modal>件
                          <Modal title="拆案人数_ZJ" {...ModelList}><a>{baqkList['拆案人数_ZJ']}</a></Modal>人，
                          并案
                          <Modal title="并案_ZJ" {...ModelList}><a>{baqkList['并案_ZJ']}</a></Modal>件
                          <Modal title="并案人数_ZJ" {...ModelList}><a>{baqkList['并案人数_ZJ']}</a></Modal>人，
                          改变管辖
                          <Modal title="改变管辖_ZJ" {...ModelList}><a>{baqkList['改变管辖_ZJ']}</a></Modal>件
                          <Modal title="改变管辖人数_ZJ" {...ModelList}><a>{baqkList['改变管辖人数_ZJ']}</a></Modal>人。
                        </div>
                        {/*<div style={{margin: '24px 0'}}>*/}
                        {/*发现违法瑕疵案件*/}
                        {/*<Modal title="违法点_ZJ" {...ModelList}><a>{baqkList['违法点_ZJ']}</a></Modal>件*/}
                        {/*<Modal title="违法点个数_ZJ" {...ModelList}><a>{baqkList['违法点个数_ZJ']}</a></Modal>处*/}
                        {/*（*/}
                        {/*书面纠违*/}
                        {/*<Modal title="书面纠违_ZJ" {...ModelList}><a>{baqkList['书面纠违_ZJ']}</a></Modal>件，*/}
                        {/*检察建议*/}
                        {/*<Modal title="检察建议_ZJ" {...ModelList}><a>{baqkList['检察建议_ZJ']}</a></Modal>件，*/}
                        {/*口头纠违*/}
                        {/*<Modal title="口头纠违_ZJ" {...ModelList}><a>{baqkList['口头纠违_ZJ']}</a></Modal>件*/}
                        {/*）；*/}
                        {/*/!*回复*!/*/}
                        {/*/!*<Modal title="回复纠正_ZJ" {...ModelList}><a>{baqkList['回复纠正_ZJ']}</a></Modal>件；*!/*/}
                        {/*</div>*/}

                        <div>
                          <span className={styles.bsjItem}>诉：</span>
                          审结公诉案件
                          <Modal title="办结_GS" {...ModelList}><a>{baqkList['办结_GS']}</a></Modal>件
                          <Modal title="办结人数_GS" {...ModelList}><a>{baqkList['办结人数_GS']}</a></Modal>人，
                          {/*认罪认罚*/}
                          {/*<Modal title="认罪认罚_GS" {...ModelList}><a>{baqkList['认罪认罚_GS']}</a></Modal>件*/}
                          {/*<Modal title="认罪认罚人数_GS" {...ModelList}><a>{baqkList['认罪认罚人数_GS']}</a></Modal>人*/}
                          {/*（未适用<Modal title="未适用认罪认罚_GS" {...ModelList}><a>{baqkList['未适用认罪认罚_GS']}</a></Modal>件*/}
                          {/*<Modal title="未适用认罪认罚人数_GS" {...ModelList}><a>{baqkList['未适用认罪认罚人数_GS']}</a></Modal>人*/}
                          {/*），*/}
                          起诉
                          <Modal title="起诉_GS" {...ModelList}><a>{baqkList['起诉_GS']}</a></Modal>件
                          <Modal title="起诉人数_GS" {...ModelList}><a>{baqkList['起诉人数_GS']}</a></Modal>人
                          （
                          普通程序
                          <Modal title="普通程序_GS" {...ModelList}><a>{baqkList['普通程序_GS']}</a></Modal>件
                          <Modal title="普通程序人数_GS" {...ModelList}><a>{baqkList['普通程序人数_GS']}</a></Modal>人，
                          简易程序
                          <Modal title="简易程序_GS" {...ModelList}><a>{baqkList['简易程序_GS']}</a></Modal>件
                          <Modal title="简易程序人数_GS" {...ModelList}><a>{baqkList['简易程序人数_GS']}</a></Modal>人，
                          速裁程序
                          <Modal title="速裁程序_GS" {...ModelList}><a>{baqkList['速裁程序_GS']}</a></Modal>件
                          <Modal title="速裁程序人数_GS" {...ModelList}><a>{baqkList['速裁程序人数_GS']}</a></Modal>人
                          ），
                          不起诉
                          <Modal title="不起诉_GS" {...ModelList}><a>{baqkList['不起诉_GS']}</a></Modal>件
                          <Modal title="不起诉人数_GS" {...ModelList}><a>{baqkList['不起诉人数_GS']}</a></Modal>人
                          （
                          绝对不诉
                          <Modal title="绝对不诉_GS" {...ModelList}><a>{baqkList['绝对不诉_GS']}</a></Modal>件
                          <Modal title="绝对不诉人数_GS" {...ModelList}><a>{baqkList['绝对不诉人数_GS']}</a></Modal>人，
                          存疑不诉
                          <Modal title="存疑不诉_GS" {...ModelList}><a>{baqkList['存疑不诉_GS']}</a></Modal>件
                          <Modal title="存疑不诉人数_GS" {...ModelList}><a>{baqkList['存疑不诉人数_GS']}</a></Modal>人，
                          相对不诉
                          <Modal title="相对不诉_GS" {...ModelList}><a>{baqkList['相对不诉_GS']}</a></Modal>件
                          <Modal title="相对不诉人数_GS" {...ModelList}><a>{baqkList['相对不诉人数_GS']}</a></Modal>人
                          ），
                          {/*附条件不起诉*/}
                          {/*<Modal title="附条件不起诉_GS" {...ModelList}><a>{baqkList['附条件不起诉_GS']}</a></Modal>件*/}
                          {/*<Modal title="附条件不起诉人数_GS" {...ModelList}><a>{baqkList['附条件不起诉人数_GS']}</a></Modal>人，*/}
                          移送单位撤回
                          <Modal title="移送单位撤回_GS" {...ModelList}><a>{baqkList['移送单位撤回_GS']}</a></Modal>件
                          <Modal title="移送单位撤回人数_GS" {...ModelList}><a>{baqkList['移送单位撤回人数_GS']}</a></Modal>人，
                          拆案
                          <Modal title="拆案_GS" {...ModelList}><a>{baqkList['拆案_GS']}</a></Modal>件
                          <Modal title="拆案人数_GS" {...ModelList}><a>{baqkList['拆案人数_GS']}</a></Modal>人，
                          并案
                          <Modal title="并案_GS" {...ModelList}><a>{baqkList['并案_GS']}</a></Modal>件
                          <Modal title="并案人数_GS" {...ModelList}><a>{baqkList['并案人数_GS']}</a></Modal>人，
                          改变管辖
                          <Modal title="改变管辖_GS" {...ModelList}><a>{baqkList['改变管辖_GS']}</a></Modal>件
                          <Modal title="改变管辖人数_GS" {...ModelList}><a>{baqkList['改变管辖人数_GS']}</a></Modal>人。<br/>
                          退回补充侦查
                          <Modal title="退回补充侦查_GS" {...ModelList}><a>{baqkList['退回补充侦查_GS']}</a></Modal>件
                          <Modal title="退回补充侦查人数_GS" {...ModelList}><a>{baqkList['退回补充侦查人数_GS']}</a></Modal>人
                          （
                          一退
                          <Modal title="一退_GS" {...ModelList}><a>{baqkList['一退_GS']}</a></Modal>件
                          <Modal title="一退人数_GS" {...ModelList}><a>{baqkList['一退人数_GS']}</a></Modal>人，
                          二退
                          <Modal title="二退_GS" {...ModelList}><a>{baqkList['二退_GS']}</a></Modal>件
                          <Modal title="二退人数_GS" {...ModelList}><a>{baqkList['二退人数_GS']}</a></Modal>人
                          ）。
                        </div>

                        <div style={{margin: '24px 0'}}>
                          <span className={styles.item}>侦查<span className={styles.bsjItem}>监</span>督：</span>
                          发现侦查办案违法瑕疵案件
                          <Modal title="违法点" {...ModelList}><a>{baqkList['违法点_GS'] + baqkList['违法点_ZJ']}</a></Modal>件
                          <Modal
                            title="违法点个数" {...ModelList}><a>{baqkList['违法点个数_GS'] + baqkList['违法点个数_ZJ']}</a></Modal>处
                          （
                          书面纠违
                          <Modal title="书面纠违" {...ModelList}><a>{baqkList['书面纠违_GS'] + baqkList['书面纠违_ZJ']}</a></Modal>件，
                          检察建议
                          <Modal title="检察建议" {...ModelList}><a>{baqkList['检察建议_GS'] + baqkList['检察建议_ZJ']}</a></Modal>件，
                          口头纠违
                          <Modal title="口头纠违" {...ModelList}><a>{baqkList['口头纠违_GS'] + baqkList['口头纠违_ZJ']}</a></Modal>件
                          ）。
                          同比上升<a>{parseFloat(baqkList['侦查监督同比_GS']).toFixed(2) / 1}%</a>，环比下降<a>{parseFloat(baqkList['侦查监督环比_GS']).toFixed(2) / 1}%</a>。<a
                          onClick={() => {
                            this.click('zcjd')
                          }}>（点击查看趋势图）</a>
                          {/*回复*/}
                          {/*<Modal title="回复纠正_GS" {...ModelList}><a>{baqkList['回复纠正_GS']}</a></Modal>件；*/}
                        </div>

                        <div style={{margin: '24px 0'}}>
                          <span className={styles.item}>判：</span>
                          收到判决
                          <Modal title="判决_SP" ajlb={'SP'} {...ModelList}><a>{baqkList['判决_SP']}</a></Modal>件
                          <Modal title="判决人数_SP" ajlb={'SP'} {...ModelList}><a>{baqkList['判决人数_SP']}</a></Modal>人，
                          诉判比对
                          <Modal title="诉判比对_SP" ajlb={'SP'} {...ModelList}><a>{baqkList['诉判比对_SP']}</a></Modal>件
                          <Modal title="诉判比对人数_SP"
                                 ajlb={'SP'} {...ModelList}><a>{baqkList['诉判比对人数_SP']}</a></Modal>人；<br/>
                          未比对当日超期
                          <Modal title="当日超期_SP" ajlb={'SP'} {...ModelList}><a>{baqkList['当日超期_SP']}</a></Modal>件
                          <Modal title="当日超期人数_SP" ajlb={'SP'} {...ModelList}><a>{baqkList['当日超期人数_SP']}</a></Modal>人，
                          往期积压超期
                          <Modal title="积存超期_SP" ajlb={'SP'} {...ModelList}><a>{baqkList['积存超期_SP']}</a></Modal>件
                          <Modal title="积存超期人数_SP"
                                 ajlb={'SP'} {...ModelList}><a>{baqkList['积存超期人数_SP']}</a></Modal>人；<br/>
                          其中，诉判不一
                          <Modal title="诉判不一_SP" ajlb={'SP'} {...ModelList}><a>{baqkList['诉判不一_SP']}</a></Modal>件
                          <Modal title="诉判不一个数_SP" ajlb={'SP'} {...ModelList}><a>{baqkList['诉判不一个数_SP']}</a></Modal>处
                          （
                          改变事实
                          <Modal title="改变事实_SP" ajlb={'SP'} {...ModelList}><a>{baqkList['改变事实_SP']}</a></Modal>件，
                          改变定性
                          <Modal title="改变定性_SP" ajlb={'SP'} {...ModelList}><a>{baqkList['改变定性_SP']}</a></Modal>件，
                          改变量刑
                          <Modal title="改变量刑_SP" ajlb={'SP'} {...ModelList}><a>{baqkList['改变量刑_SP']}</a></Modal>件，
                          其他
                          <Modal title="诉判不一（其他）_SP" ajlb={'SP'} {...ModelList}><a>{baqkList['诉判不一（其他）_SP']}</a></Modal>件
                          ），
                          无罪判决
                          <Modal title="无罪判决_SP" ajlb={'SP'} {...ModelList}><a>{baqkList['无罪判决_SP']}</a></Modal>件
                          <Modal title="无罪判决人数_SP" ajlb={'SP'} {...ModelList}><a>{baqkList['无罪判决人数_SP']}</a></Modal>人，
                          抗诉
                          <Modal title="抗诉_SP" ajlb={'SP'} {...ModelList}><a>{baqkList['抗诉_SP']}</a></Modal>件。
                        </div>
                        <div style={{margin: '24px 0'}}>
                          <span className={styles.item}>审判<span className={styles.bsjItem}>监</span>督：</span>
                          发现审判违法瑕疵
                          <Modal title="违法点（审判监督）_SP"
                                 ajlb={'SP'} {...ModelList}><a>{baqkList['违法点（审判监督）_SP']}</a></Modal>件
                          <Modal title="违法点（审判监督）个数_SP"
                                 ajlb={'SP'} {...ModelList}><a>{baqkList['违法点（审判监督）个数_SP']}</a></Modal>处
                          （
                          书面纠违
                          <Modal title="书面纠违（审判监督）_SP"
                                 ajlb={'SP'} {...ModelList}><a>{baqkList['书面纠违（审判监督）_SP']}</a></Modal>件，
                          检察建议
                          <Modal title="检察建议（审判监督）_SP"
                                 ajlb={'SP'} {...ModelList}><a>{baqkList['检察建议（审判监督）_SP']}</a></Modal>件，
                          口头纠违
                          <Modal title="口头纠违（审判监督）_SP"
                                 ajlb={'SP'} {...ModelList}><a>{baqkList['口头纠违（审判监督）_SP']}</a></Modal>件
                          ）；
                          {/*回复*/}
                          {/*<Modal title="回复纠正_SP" ajlb={'SP'} {...ModelList}><a>{baqkList['回复纠正_SP']}</a></Modal>件。*/}
                        </div>
                        <div>
                          <span className={styles.item}>认罪认罚：</span>
                          案件基数
                          <Modal title="办结_GS"  {...ModelList}><a>{baqkList['办结_GS']}</a></Modal>件
                          <Modal title="办结人数_GS"  {...ModelList}><a>{baqkList['办结人数_GS']}</a></Modal>人，
                          其中已适用
                          <Modal title="认罪认罚_GS"  {...ModelList}><a>{baqkList['认罪认罚_GS']}</a></Modal>件
                          <Modal title="认罪认罚人数_GS"  {...ModelList}><a>{baqkList['认罪认罚人数_GS']}</a></Modal>人，
                          未适用
                          <Modal title="未适用认罪认罚_GS"  {...ModelList}><a>{baqkList['未适用认罪认罚_GS']}</a></Modal>件
                          <Modal title="未适用认罪认罚人数_GS"  {...ModelList}><a>{baqkList['未适用认罪认罚人数_GS']}</a></Modal>人。
                          认罪认罚占比<a>{parseFloat(baqkList['认罪认罚占比_GS']).toFixed(2) / 1}%</a>，同比上升<a>{parseFloat(baqkList['认罪认罚同比_GS']).toFixed(2) / 1}%</a>，环比下降<a>{parseFloat(baqkList['认罪认罚环比_GS']).toFixed(2) / 1}%</a>。<a
                          onClick={() => {
                            this.click('rzrf')
                          }}>（点击查看趋势图）</a><br/>
                          其中，认罪认罚案件量刑建议采纳率为<a>{parseFloat(baqkList['量刑采纳率_SP']).toFixed(2) / 1}%</a>。<a
                          onClick={() => {
                            this.click('lxjy')
                          }}>（点击查看趋势图）</a>
                        </div>

                      </div>
                    }
                    <Trend
                      visible={modalVisible} month={month} value={value} trendType={trendType} handleOk={this.handleOk}
                      handleCancle={this.handleCancle}/>
                  </Card>
              }
            </div>
          </TreeLayout>
        </div>
      </Fragment>
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

