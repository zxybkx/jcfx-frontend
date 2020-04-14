import React, { PureComponent } from 'react';
import ReactDOM from 'react-dom';
import {connect} from 'dva';
import { Form,Row, Col,DatePicker,Select } from 'antd';
import Ellipsis from 'ant-design-pro/lib/Ellipsis';
import moment from 'moment';
import echarts from "echarts";
import ReactEcharts from "echarts-for-react";
import _ from 'lodash';
import styles from './page.less';
import RadioLink from './RadioLink';
import DynamicRefreshTable from './DynamicRefreshTable';
import PageHeaderLayout from '../../lib/Layout/PageHeaderLayout';
import {INTEGRATE} from "../../constant";
import Authorized from 'utils/Authorized';
import 'ant-design-pro/dist/ant-design-pro.css';

const Option = Select.Option;
const { RangePicker } = DatePicker;
const CASE_COUNT_TOP_X = 10;
const WEEK = {
  Monday:'周一',
  Tuesday:'周二',
  Wednesday:'周三',
  Thursday:'周四',
  Friday:'周五',
  Saturday:'周六',
  Sunday:'周日'
};


/**
 * 办案情况实时分析
 */
@connect(state => ({
  baqkfx: state.baqkfx,
  onlineOfficerLoading: state.loading.effects['baqkfx/getOnlineOfficerData'],
  caseLoading: state.loading.effects['baqkfx/getCaseData'],
}))
@Form.create()
class HeatMap extends PureComponent{

  constructor(props) {
    super(props);
    this.state={
      data:[],  //当前地图展示需要的数据
      city:'jiangsu', //存储当前展示的地图类型
      onlineOfficerTablePageSize:0,
      caseTablePageSize:0,
      parentCode:"320000",  //存储父级的行政代码
      defaultParentCode:"320000",   //存储默认的父级行政代码,即江苏省的行政代码
      onlineOfficerData:[],   //在线检察官列表数据
      caseData:[],      //当前办理案件列表数据
      onlinePeakValueXAxisData:[],
      onlinePeakValueSeriesData:[],
      geoData:{},
      caseCountXAxisData:[],
      caseCountSeriesData:[],
      ysay:['交通肇事罪'],
      start:moment('2017-10-24').format("YYYY-MM-DDTHH:mm:ss"),
      end:moment(moment().subtract(1, 'days').format("YYYY-MM-DD")).add(24*3600-1,'s').format("YYYY-MM-DDTHH:mm:ss"),
      dwbm:'32',
      onlinePeakValueSelection:'day',
      rangePickerValue:[moment('2017-11-01'), moment().subtract(1, 'days')],
    };
  }

  /**
   * 地图点击事件函数
   * @type {{click: function(*)}}
   */
  EventsDict = {
    'click': (e) => {
      //console.log("e.name:",e.name);
      const cityMap = require('../../data/baqkfx/cityMap.json');
      if(e.name in cityMap){
        const parentCode = cityMap[e.name];
        const code = parentCode.substr(0,4);
        const {onlinePeakValueSelection} = this.state;
        this.setState({dwbm:code});
        this.getOnlineOfficerData(code);
        this.getCaseData(code);
        this.getOnlinePeakValueData(code,onlinePeakValueSelection);

        let mapJson;
        mapJson = require('../../data/baqkfx/city/'+cityMap[e.name]+'.json');
        echarts.registerMap(cityMap[e.name], mapJson);
        this.setState({city:cityMap[e.name],parentCode:parentCode});
      }
    }
  };

  handleSelect=(value)=>{
    const {start,end,ysay} = this.state;
    if(value.length == 1 && value[0] == '危险驾驶罪' ){
      const rangePickerValue = [moment('2018-04-01'), moment().subtract(1, 'days')];
      this.setState({rangePickerValue});
      let newStart = rangePickerValue[0].format("YYYY-MM-DDTHH:mm:ss");
      let newEnd =  rangePickerValue[1].format("YYYY-MM-DDTHH:mm:ss");
      this.getCaseCount(value,newStart,newEnd);
    }else{
      this.getCaseCount(value,start,end);
    }

  }

  disabledDate=(currentDate)=>{
    return !currentDate.isBetween('2017-10-23', moment().format("YYYY-MM-DD"));

  }

  handleChange=(dates,{0:startStr,1:endStr})=>{
    if(startStr && endStr){
      let newStart = moment(startStr).format("YYYY-MM-DDTHH:mm:ss");
      let newEnd =  moment(endStr).add(24*3600-1,'s').format("YYYY-MM-DDTHH:mm:ss");

      const {start:oldStart,end:oldEnd,ysay} = this.state;
      if(newStart == oldStart && oldEnd == newEnd){
        return ;
      }else{
        this.setState({rangePickerValue:dates});
        this.getCaseCount(ysay,newStart,newEnd);
      }
    }
  }

  getCaseCount=(ysay,start,end)=>{
    this.props.dispatch({
      type: 'baqkfx/getCaseCount',
      payload:{
        ysay,
        start,
        end,
        top:CASE_COUNT_TOP_X
      }
    }).then((result) => {
      const {data,message,success} = result;
      if(success){
        const caseCountXAxisData=[],caseCountSeriesData=[];
        data.forEach((item)=>{
          caseCountXAxisData.push(item.cbrxm);
          caseCountSeriesData.push(item.count);
        });
        this.setState({caseCountSeriesData,caseCountXAxisData,ysay,start,end});
      }
    });
  }

  /**
   * 获取在线检察官列表数据
   * @param code  行政区域代码
   */
  getOnlineOfficerData = (code)=>{
    this.props.dispatch({
      type: 'baqkfx/getOnlineOfficerData',
      payload:{
        dwbm:code,
        type:2
      }
    }).then((result) => {
      const {data,message,success} = result;
      if(success && data){
        const {geoData,parentCode} = this.state;
        const cityList = geoData[parentCode];
        const onlineOfficerData = [];
        /*
         本段代码过滤后端数据，来与地图上的区域进行匹配
         for (let i = 0; i < data.length; i++) {
         let item = cityList[data[i].dwbm];
         if(item){
         onlineOfficerData.push(data[i]);
         }
         }
         */

        //暂时性调整苏州市检察官总人数为309
        if(parentCode == "320000"){
          for(let item of data){
            if(item.dwbm == "320500"){
              item.total = 309;
              onlineOfficerData.push(item);
            }else{
              onlineOfficerData.push(item);
            }
          }
          this.setState({onlineOfficerData:onlineOfficerData});
        }else{
          this.setState({onlineOfficerData:data});
        }
      }
    });
  };

  /**
   * 获取当前案件办理列表
   * @param code  行政区域代码
   */
  getCaseData = (code)=>{
    this.props.dispatch({
      type: 'baqkfx/getCaseData',
      payload:{
        dwbm:code,
        type:2
      }
    }).then((result) => {
      const {data,message,success} = result;
      if(success){
        this.setState({caseData:data});
      }
    });
  };


  //RadioLink组件-获取选择的时间单位
  getData=(value)=>{
    const {onlinePeakValueSelection} = this.state;
    if(value == onlinePeakValueSelection){
      return;
    }
    const {dwbm} = this.state;
    this.getOnlinePeakValueData(dwbm,value);
  };

  /**
   * 获取在线峰值数据
   * @param code  行政区域代码
   */
  getOnlinePeakValueData=(code,onlinePeakValueSelection='day')=>{
    let type;
    switch(onlinePeakValueSelection)
    {
      case 'month':
        type = 2;
        break;
      case 'week':
        type = 3;
        break;
      default:
        type=4;
    }
    this.props.dispatch({
      type: 'baqkfx/getOnlinePeakValueData',
      payload:{
        dwbm:code,
        type:type
      }
    }).then((result) => {
      const {data,message,success} = result;
      console.log("data",data);
      if(success){
        data.sort((x,y)=>{
          if (x.orderby < y.orderby) {
            return -1;
          } else if (x.orderby > y.orderby) {
            return 1;
          } else {
            return 0;
          }
        });
        const onlinePeakValueXAxisData=[],onlinePeakValueSeriesData=[];
        data.forEach((item)=>{
          if(onlinePeakValueSelection == 'week'){
            const [year,month,day] = item.time.split('-');
            const time = `${month - 0}.${day - 0}\n${WEEK[item.dayOfWeek]}`;
            onlinePeakValueXAxisData.push(time);
          }else{
            onlinePeakValueXAxisData.push(item.time);
          }
          onlinePeakValueSeriesData.push(item.count);
        });
        this.setState({onlinePeakValueXAxisData,onlinePeakValueSeriesData,onlinePeakValueSelection,dwbm:code});
      }
    });
  };



  back=(e)=>{
    const {onlinePeakValueSelection} = this.state;
    this.getOnlineOfficerData("32");
    this.getCaseData("32");
    this.getOnlinePeakValueData("32",onlinePeakValueSelection);
    echarts.registerMap("jiangsu", require('../../data/baqkfx/province/jiangsu.json'));
    this.setState({city:'jiangsu',parentCode:this.state.defaultParentCode});
  };

  componentDidMount() {
    //this.getMapData('world');
    let onlineOfficerDiv = ReactDOM.findDOMNode(this.refs.onlineOfficerDiv);
    let onlineOfficerDivHeightStr = window.getComputedStyle(onlineOfficerDiv).height;
    let onlineOfficerDivHeight = onlineOfficerDivHeightStr.substring(0,onlineOfficerDivHeightStr.length - 2);
    let onlineOfficerTablePageSize = this.computePageSize(onlineOfficerDivHeight);

    let caseDiv = ReactDOM.findDOMNode(this.refs.caseDiv);
    let caseDivHeightStr = window.getComputedStyle(caseDiv).height;
    let caseDivHeight = caseDivHeightStr.substring(0,caseDivHeightStr.length - 2);
    let caseTablePageSize = this.computePageSize(caseDivHeight/10*9);

    this.setState({onlineOfficerTablePageSize:onlineOfficerTablePageSize, caseTablePageSize:caseTablePageSize});
    const {start,end,ysay,onlinePeakValueSelection} = this.state;
    this.getCaseCount(ysay,start,end);
    this.getOnlineOfficerData("32");
    this.getCaseData("32");
    this.getOnlinePeakValueData("32",onlinePeakValueSelection);

  }

  computePageSize=(height)=>{
    const titleHeight = 50;
    const tableHeaderHeight = 37;
    let tableContentHeight = height - titleHeight - tableHeaderHeight;
    let pageSize = Math.floor(tableContentHeight / 37);
    pageSize = pageSize < 1 ? 1 : pageSize;
    return pageSize;
  };

  componentWillMount(){
    echarts.registerMap("jiangsu", require('../../data/baqkfx/province/jiangsu.json'));
    const geoData = require('../../data/baqkfx/adminDeptCodeWithGeo');
    this.setState({geoData:geoData});
  }

  render() {

    const {onlineOfficerTablePageSize,caseTablePageSize,onlinePeakValueXAxisData,onlinePeakValueSelection,rangePickerValue,
      onlineOfficerData,caseData,onlinePeakValueSeriesData,geoData,caseCountXAxisData,caseCountSeriesData} = this.state;



    const convertData = (parentCode,data)=>{
      const res = [];
      if(data){
        const cityList = geoData[parentCode];
        _.mapKeys(cityList,(value,key)=>{
          let findKey = false;
          for (let i = 0; i < data.length; i++) {
            if(key == data[i].dwbm){
              res.push({name:value.name,value:value.geo.concat(data[i].count ? data[i].count : 0)});
              findKey = true;
              break;
            }
          }
          if(!findKey){
            res.push({name:value.name,value:value.geo.concat(0)});
          }
        });
      }
      return res.filter((element)=>{
        return element.value[2];
      });
    };

    const heatMapOption = {
      title: {
        text: '江苏省检察官在线热力图',
        left: 'center',
        textStyle: {
          color: '#1d6dff',
        },
      },
      toolbox: {
        show: true,
        left: 'center',
        bottom:'2%',
        itemSize:25,
        feature: {
          myReturn:{
            show: this.state.city != 'jiangsu',
            title: '返回',
            icon: 'path://M778.666667 490.666667H296.533333l220.586667-220.16a21.333333 21.333333 0 0 0-30.293333-30.293334l-256 256a21.333333 21.333333 0 0 0 14.933333 36.266667h532.906667a21.333333 21.333333 0 0 0 0-42.666667zM338.346667 575.573333a21.333333 21.333333 0 0 0-30.293334 30.293334l178.346667 178.346666a21.333333 21.333333 0 0 0 30.293333-30.293333z',
            onclick: this.back,
          },
          dataView: {
            readOnly: false,
          },
          restore: {},
          saveAsImage: {},
        },
      },
      visualMap: {
        min: 0,
        max: 1200,
        splitNumber: 6,
        inRange: {
          color: ['#d94e5d','#eac736','#50a3ba'].reverse()
        },
        left:"2%",
        bottom:"1%"
      },
      geo: {
        map: this.state.city,
        label: {
          emphasis: {
            show: true
          },
          normal:{
            show:true,
            fontSize:16,
          }
        },
        roam: true,
        itemStyle: {
          normal: {
            areaColor: 'rgba(128, 128, 128, 0.3)',
            borderColor: '#1d6dff'
          }
        }
      },
      series: [{
        name: '热度',
        type: 'scatter',
        coordinateSystem: 'geo',
        symbol: 'pin',
        symbolSize:40,
        label: {
          normal: {
            show: true,
            formatter: (params)=>{
              return params.value[2];
            },
            textStyle: {
              color: '#fff',
              fontSize: 9,
            }
          }
        },
        data: convertData(this.state.parentCode,this.state.onlineOfficerData)
      }]
    };

    //在线峰值图
    const onlinePeakValueOption = {
      tooltip: {
        trigger: 'axis',
        formatter: function (params) {
          return `在线人数${params[0].value}人`;
        }
      },
      color: ['#30fe4b','#45a1ff'],
      grid: {
        top:'4%',
        left: '6%',
        right: '8%',
        bottom: '4%',
        containLabel: true
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        axisLabel: {
          interval:0,
          rotate:60,
          textStyle: {
            color: '#fff',
          },
        },
        data: onlinePeakValueXAxisData
      },
      yAxis: {
        type: 'value',
        axisLabel: {
          textStyle: {
            color: '#1d6dff',
          },
        },
        splitLine: {
          show: true,   // 网格线是否显示
          //  改变样式
          lineStyle: {
            color: '#1d6dff',   // 修改网格线颜色
          }
        },
      },
      series: [
        {
          type:'line',
          data:onlinePeakValueSeriesData
        }
      ]
    };

    //办案数量图
    const caseCountBarOption = {
      tooltip : {
        trigger: 'axis',
        axisPointer : {            // 坐标轴指示器，坐标轴触发有效
          type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
        },
        formatter: function (params) {
          return params[0].name + ':' + params[0].value + "件";
        }
      },
      grid: {
        top:'6%',
        left: '3%',
        right: '8%',
        bottom: '4%',
        containLabel: true
      },
      color: ['#45a1ff','#30fe4b'],
      xAxis: {
        type : 'category',
        splitLine: {show:false},
        data :  caseCountXAxisData,
        axisLabel: {
          interval:0,
          formatter:function(value)
          {
            return value.split("").join("\n");
          },
          textStyle: {
            color: '#1d6dff',
          },
        }
      },
      yAxis: {
        type : 'value',
        axisLabel: {
          textStyle: {
            color: '#1d6dff',
          },
        },
        splitLine: {
          show: true,   // 网格线是否显示
          //  改变样式
          lineStyle: {
            color: '#1d6dff',   // 修改网格线颜色
          }
        },
      },
      series: [
        {
          name: '前十',
          type: 'bar',
          stack: '总量',
          data: caseCountSeriesData,
          itemStyle:{
            barBorderRadius:10,
          },
          barWidth:8,
        }
      ]
    };

    const caseColumns = [
      {
        title: "案件名称",
        dataIndex: 'ajmc',
        render:(text)=>(
          <Ellipsis length={7} tooltip>{text}</Ellipsis>
        )
      },
      {
        title: "承办单位",
        dataIndex: 'cbdw_mc',
        render:(text)=>(
          <Ellipsis length={7} tooltip>{text}</Ellipsis>
        )
      },
      {
        title: "承办人",
        dataIndex: 'cbr',
      }
    ];

    const onlineOfficerColumns = [
      {
        title: "地区",
        dataIndex: 'dqmc',
      },
      {
        title: "在线检察官",
        render: (text, record)=>{
          return record.count ? record.count : 0;
        }
      },
      {
        title: "比例",
        render: (text, record)=>{
          return `${record.count ? record.count : 0}/${record.total ? record.total : 0}`;
        }
      }
    ];

    const officerPagination = {
      pageSize: onlineOfficerTablePageSize,
      simple:true,
      size:"small",
      position: 'none',
    };

    const casePagination = {
      pageSize: caseTablePageSize,
      simple:true,
      size:"small",
      position: 'none',
    };
    const content = (
      <Authorized authority={['ROLE_SUPER_ADMIN','ROLE_ADMIN', 'ROLE_USER']}
                  redirectPath="/passport/sign-in">

        <div className={INTEGRATE ? styles.integrateBackground : styles.background}>
          <Row type="flex" justify="space-around" className={INTEGRATE ? styles.integrateDefault : styles.default}>
            <Col span={6} className={INTEGRATE ? styles.integrateLeftCol : styles.leftCol}>
              <div ref="onlineOfficerDiv"  className={INTEGRATE ? styles.integrateLeftTop : styles.leftTop}>
                <div className={styles.title}>
                  <span>在线检察官</span>
                </div>
                <DynamicRefreshTable loading={this.props.onlineOfficerLoading} rowKey="dwbm" pageSize={onlineOfficerTablePageSize} data={onlineOfficerData} columns={onlineOfficerColumns} />
              </div>

              <div className={INTEGRATE ? styles.integrateLeftMiddle : styles.leftMiddle}></div>

              <div className={INTEGRATE ? styles.integrateLeftBottom : styles.leftBottom}>
                <div className={styles.title}>
                  <span>在线峰值</span>
                  <div style={{display:"inline-block",position:"absolute",right:"8%",top:"50%",transform:"translateY(-50%)",fontSize:14}}>
                    <RadioLink getData={this.getData}/>
                  </div>
                </div>

                <div className={INTEGRATE ? styles.integrateOnlinePeakChart : styles.onlinePeakChart}>
                  <ReactEcharts
                    style={{ height:'100%'}}
                    option={onlinePeakValueOption}
                    notMerge={true}
                  />
                </div>

                {onlinePeakValueSelection=='day'?(<div style={{display:"inline-block",position:"absolute",bottom: 0,left: "50%"}}>
                  <span>(小时)</span>
                </div>):''}

              </div>


            </Col>

            <Col span={9} className={INTEGRATE ? styles.integrateCenterCol : styles.centerCol}>
              <div className={INTEGRATE ? styles.integrateHeatMapChart : styles.heatMapChart}>
                <ReactEcharts
                  style={{height: '100%'}}
                  option={heatMapOption}
                  notMerge={true}
                  onEvents={this.EventsDict}
                  ref="map"
                />
              </div>
            </Col>

            <Col span={8}>
              <Row>
                <Col ref="caseDiv" span={24} className={INTEGRATE ? styles.integrateRightCol : styles.rightCol}>
                  <div className={styles.title}>
                    <span>当前案件办理列表</span>
                  </div>
                  <DynamicRefreshTable loading={this.props.caseLoading} rowKey="bmsah" pageSize={caseTablePageSize} data={caseData} columns={caseColumns} />
                </Col>
                <Col span={24} className={INTEGRATE ? styles.integrateRightCol : styles.rightCol} style={{marginTop:30}}>
                  <div className={styles.title}>
                    <span>办案数量Top{CASE_COUNT_TOP_X}</span>

                    <div style={{display:"inline-block",marginLeft:8}} className={styles.option}>
                      <Select mode="multiple" defaultValue="交通肇事罪" onChange={this.handleSelect}>
                        <Option value="交通肇事罪">交通肇事罪</Option>
                        <Option value="危险驾驶罪">危险驾驶罪</Option>
                        <Option value="盗窃罪">盗窃罪</Option>
                      </Select>
                    </div>

                    <div style={{display:"inline-block",position:"absolute",right:"8%",top:"50%",transform:"translateY(-50%)",fontSize:14}}>
                      {/*<RadioLink getData={this.getData}/>*/}
                    </div>

                  </div>

                  <div style={{paddingLeft:20}} className={styles.option}>
                    <RangePicker ref={(node)=>{this.rangePicker = node}}
                                 disabledDate={this.disabledDate}
                                 onChange={this.handleChange}
                                 style={{ marginLeft:8, width: 210}}
                                 value={rangePickerValue}
                    />
                  </div>

                  <div className={INTEGRATE ? styles.integrateCaseTimeChart : styles.caseTimeChart}>
                    <ReactEcharts
                      style={{height: '100%'}}
                      option={caseCountBarOption}
                      notMerge={true}
                    />
                  </div>

                  <div>
                    <ReactEcharts
                      style={{display:"none"}}
                      option={{}}
                    />
                  </div>

                </Col>
              </Row>
            </Col>
          </Row>
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


const WrappedHeatMapForm = Form.create()(HeatMap);

export default WrappedHeatMapForm;
