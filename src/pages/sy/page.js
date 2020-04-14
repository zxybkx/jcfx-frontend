import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { Link } from 'dva/router';
import {Form, Row, Col, Button, DatePicker, Cascader, Select} from 'antd';
import classnames from 'classnames';
import {INTEGRATE} from '../../constant';
import Chart from '../../components/SY/Chart';
import leftTb from '../../assets/leftTb.png';
import rightHb from '../../assets/rightHb.png';
import ajclImg from '../../assets/ajcl.png';
import PageHeaderLayout from 'lib/Layout/PageHeaderLayout';
import styles from './page.less';
import moment from 'moment';
import  _  from 'lodash';
import { routerRedux } from 'dva/router';
import { CONTEXT } from '../../constant';
const RangePicker = DatePicker.RangePicker;
const FormItem = Form.Item;
const ButtonGroup = Button.Group;
const Option = Select.Option;

@connect(({tjfx , loading }) => ({
  tjfx: tjfx,
}))
class Home extends PureComponent {
  constructor(props){
    super(props);
    const myDate=new Date()
    const endDate=moment(myDate).format('YYYY-MM-DD');
    this.state={
      dwbm: '32',
      dwmc: '江苏省',
      startDate:'2017-11-01',
      endDate: endDate,
      ysay: 'all',
      ajlb: 'GS',
      buttonA: true,
    };
  }

  componentDidMount() {
    const {dispatch} = this.props;
    dispatch({
      type: 'tjfx/getTree',
      payload: {
        dwbm: '32',
      },
    });
    const myDate=new Date()
    const endDate=moment(myDate).format('YYYY-MM-DD');
    const data={
      dwbm: '32',
      startDate: '2017-11-01',
      endDate: endDate,
      ysay: 'all',
      ajlb: 'GS',
      jcg: '0'
    };
    this.getCount(data);
  }

  getCount =(data)=>{
    const { dispatch } = this.props;
    dispatch({
      type:'tjfx/countSa',
      payload: data,
    });
    dispatch({
      type:'tjfx/countBj',
      payload: data,
    });
    dispatch({
      type:'tjfx/countWj',
      payload: data,
    });
    dispatch({
      type:'tjfx/countBasc',
      payload: data,
    });
    dispatch({
      type:'tjfx/countZcjd',
      payload: data,
    });
    dispatch({
      type:'tjfx/countAjcl',
      payload: data,
    });
  };

  componentWillReceiveProps(nextProps) {
    const { monthList }=nextProps.tjfx;
    this.setState({
    });
  }

  // 检索
  onAreaChange =  (values,key) => {
    if(values.length == 1){
      values = values[0].substr(0,2);
    }else if(values.length == 2){
      values = values[values.length-1].substr(0,4);
    }else{
      values = values[values.length-1];
    }
    this.setState({
      dwbm: values,
      dwmc: key.pop().label
    });
    const {startDate, endDate,ajlb,ysay}=this.state;
    const data={
      dwbm: values,
      startDate: startDate,
      endDate: endDate,
      ysay: ysay,
      ajlb: ajlb,
      jcg: '0'
    };
    this.getCount(data);
  };
  onRqChange =(values)=>{
    this.setState({
      startDate: moment(values[0]).format("YYYY-MM-DD"),
      endDate: moment(values[1]).format("YYYY-MM-DD"),
    });
    const {dwbm,ajlb,ysay}=this.state;
    const data={
      dwbm: dwbm,
      startDate: moment(values[0]).format("YYYY-MM-DD"),
      endDate: moment(values[1]).format("YYYY-MM-DD"),
      ysay: ysay,
      ajlb: ajlb,
      jcg: '0'
    };
    this.getCount(data);
  };
  onZmChange =(values)=>{
    this.setState({
      ysay: values,
    });
    const {startDate,endDate,dwbm,ajlb}=this.state;
    const data={
      dwbm: dwbm,
      startDate: startDate,
      endDate: endDate,
      ysay: values,
      ajlb: ajlb,
      jcg: '0'
    };
    this.getCount(data);
  };

  buildDepartmentTree = (departments) => {
    let treeNode = [];
    if (departments) {
      let nodeMap = {};
      departments.map(d => {
        let node = {
          label: d.dqmc,
          value: d.dwbm,
          key: d.dwbm,
        };
        nodeMap[node.value] = node;

      });

      departments.map(d => {
        let parent = nodeMap[d.fdwbm];
        let node = nodeMap[d.dwbm];
        if (parent) {
          if (!parent.children) {
            parent.children = [];
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

  renderForm() {
    const { getFieldDecorator } = this.props.form;
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 18 },
    };
    const {treeList}=this.props.tjfx;
    const localData = this.buildDepartmentTree(treeList);
    const { dwbm, startDate, endDate, ajlb, ysay }=this.state;
    return (
      <Form className={styles.form}>
        <Row>
          <Col span={3} >
            <ButtonGroup style={{marginTop: 10}}>
              <Button
                style={{background: ajlb==='GS' ? '':'transparent',color: ajlb==='GS' ? 'white':'grey'}}
                type= 'primary'
                 size="small"
                onClick={() => {
                  this.setState({
                    ajlb: 'GS',
                  });
                  const data={
                    dwbm: dwbm,
                    startDate: startDate,
                    endDate: endDate,
                    ysay: ysay,
                    ajlb: 'GS',
                    jcg: '0'
                  };
                  this.getCount(data);
                }}
              >审查起诉</Button>
              <Button
                style={{background: ajlb==='ZJ' ? '':'transparent',color: ajlb==='ZJ' ? 'white':'grey'}}
                type= 'primary'
                size="small"
                onClick={() => {
                  this.setState({
                    ajlb: 'ZJ',
                  });
                  const data={
                    dwbm: dwbm,
                    startDate: startDate,
                    endDate: endDate,
                    ysay: ysay,
                    ajlb: 'ZJ',
                    jcg: '0'
                  };
                  this.getCount(data);
                }}
              >审查逮捕</Button>
            </ButtonGroup>
          </Col>
          <Col span={6} >
            <FormItem {...formItemLayout} style={{ width: '100%' }} colon={false} label={<span style={{fontWeight:'normal', color:'white'}}>单位名称</span>} >
              {getFieldDecorator('dwbm',{ initialValue: ['320000']})(
                <Cascader
                  changeOnSelect={true}
                  options={localData}
                  onChange={this.onAreaChange}
                  placeholder="选择单位名称"
                  size="small"
                  style={{color: '#8390a3', background: 'transparent',}}
                />
              )}
            </FormItem>
          </Col>
          <Col span={6} offset={1}>
            <FormItem {...formItemLayout}  style={{ width: '100%' }} colon={false} label={<span style={{fontWeight:'normal', color:'white'}}>受案时间</span>} >
              {getFieldDecorator('sasj',{initialValue: [moment(startDate),moment(endDate)]})(
                <RangePicker size="small" onChange={this.onRqChange} />
              )}
            </FormItem>
          </Col>
          <Col span={6} offset={1} >
            <FormItem {...formItemLayout} style={{ width: '100%' }} colon={false} label={<span style={{fontWeight:'normal', color:'white'}}>移送案由</span>} >
              {getFieldDecorator('ysay',{initialValue: 'all'})(
                <Select size="small" onChange={this.onZmChange}>
                  <Option  value={ 'all' } >全部</Option>
                  <Option  value={ '交通肇事罪' } >交通肇事罪</Option>
                  <Option  value={ '危险驾驶罪' } >危险驾驶罪</Option>
                </Select>
              )}
            </FormItem>
          </Col>
        </Row>
      </Form>
    );
  }

  render() {
    const {tjfx, dispatch}=this.props;
    const { saList, bjList, wjList, bascList, zcjdList, ajclList, cycleList }=tjfx;
    const { ajlb, buttonA,dwbm, startDate, endDate, ysay,dwmc  }= this.state;
    const zjName= ajlb==='ZJ'? <span className={styles.zj} style={{ fontWeight: 'bold', fontSize: 18, color:'white' }}>侦查监督</span>:
      <div className={styles.zj}>
        <a
          style={{ fontWeight: buttonA ? 'bold' : 'normal', fontSize: 18, color:buttonA ? 'white':'grey' }}
          onClick={() => {
            this.setState({
              buttonA: true,
            });
          }}
        >侦查监督</a>
        <span style={{color:'white'}}>&nbsp;&nbsp;|&nbsp;&nbsp;</span>
        <a
          style={{fontWeight: !buttonA ? 'bold' : 'normal', fontSize: 18, color:!buttonA ? 'white':'grey' }}
          onClick={() => {
            this.setState({
              buttonA: false,
            });
          }}
        >审判监督</a>
      </div> ;

    const saListProps={
      onEvents: (e) => {
        let newDwbm='';
        if(dwbm.length==2){
          newDwbm = dwbm+'0000';
        }else if(dwbm.length==4){
          newDwbm = dwbm+'00';
        }else {
          newDwbm = dwbm;
        }
        dispatch(
          routerRedux.push({
            pathname: ajlb==='ZJ'? `${CONTEXT}/gafx/scdbga`:`${CONTEXT}/gafx/scqsga`,
            query: {
              sasj_startDate: startDate,
              sasj_endDate: endDate,
              ysay: ysay==='all'?['交通肇事罪','危险驾驶罪'] : [ysay],
              dwbm: newDwbm,
              by: dwbm.length===6 ? '1' : '0',
              jcgmc: dwmc
            },
          })
        );
      },
      option: {
        title : {
          text: '受案',
          x:'left',
          textStyle : {
            color: 'white',
          },
        },
        color: ['#0ffcff','#1890ff','#e7bcf3','#8378ea'],
        tooltip : {
          trigger: 'item',
          formatter: "{a} <br/>{b} : {c} ({d}%)"
        },
        legend: {
          orient: 'vertical',
          left: 'right',
          data: _.map(saList['饼图'], (d) => { return d.name; }),
          textStyle : {
            color: 'white',
          },
        },
        series : [
          {
            name: '受案人数占比',
            type: 'pie',
            radius: ['35%', '50%'],
            center: ['50%', '30%'],
            data:saList['饼图']?[saList['饼图'][1],saList['饼图'][3]]:[],
            label: {
              normal: {
                show: false
              },
              emphasis: {
                show: false
              }
            },
            itemStyle: {
              normal: {
                shadowBlur: 100,
                shadowColor: 'rgba(26, 107, 255, 0.3)'
              }
            },
          },{
            name:'受案件数占比',
            type:'pie',
            selectedMode: 'single',
            radius: ['0', '25%'],
            center: ['50%', '30%'],
            label: {
              normal: {
                show: false
              },
              emphasis: {
                show: false
              }
            },
            itemStyle: {
              normal: {
                shadowBlur: 100,
                shadowColor: 'rgba(26, 107, 255, 0.3)'
              }
            },
            data:saList['饼图']?[saList['饼图'][0],saList['饼图'][2]]:[],
          }
        ]
      }
    };
    const satb={
      onEvents: (e) => {},
      option: {
        tooltip : {
          trigger: 'item',
          formatter: "{a} <br/>{b} : {c} ({d}%)"
        },
        color: ['#0ffcff','#45a1ff'],
        series : [
          {
            name: '占比',
            type: 'pie',
            radius: ['0', '50%'],
            center: ['30%', '50%'],
            data: [{name:'今年',value:saList&&saList['同比']?saList['同比'].thisYearValue:''},
              {name:'去年',value:saList&&saList['同比']?saList['同比'].lastYearValue:''}],
            label: {
              show:false
            },
            itemStyle: {
              normal: {
                shadowBlur: 50,
                shadowColor: 'rgba(26, 107, 255, 0.3)'
              }
            },
          }
        ]

      },
    };
    const sahb={
      onEvents: (e) => {},
      option: {
        tooltip : {
          trigger: 'item',
          formatter: "{a} <br/>{b} : {c} ({d}%)"
        },
        color: ['#45a1ff','#0ffcff'],
        series : [
          {
            name: '占比',
            type: 'pie',
            radius: ['0', '50%'],
            center: ['75%', '50%'],
            data: [{name:'今年',value:saList&&saList['环比']?saList['环比'].startValue:''},
              {name:'去年',value:saList&&saList['环比']?saList['环比'].endValue:''}],
            label: {
              show:false
            },
            itemStyle: {
              normal: {
                shadowBlur: 50,
                shadowColor: 'rgba(26, 107, 255, 0.3)'
              }
            },
          }
        ]

      },
    };
    const bjListProps={
      onEvents: (e) => {
        let newDwbm='';
        if(dwbm.length==2){
          newDwbm = dwbm+'0000';
        }else if(dwbm.length==4){
          newDwbm = dwbm+'00';
        }else {
          newDwbm = dwbm;
        }
        dispatch(
          routerRedux.push({
            pathname: ajlb==='ZJ'? `${CONTEXT}/gafx/scdbga`:`${CONTEXT}/gafx/scqsga`,
            query: {
              sasj_startDate: startDate,
              sasj_endDate: endDate,
              ysay: ysay==='all'?['交通肇事罪','危险驾驶罪'] : [ysay],
              dwbm: newDwbm,
              by: dwbm.length===6 ? '1' : '0',
              jcgmc: dwmc
            },
          })
        );
      },
      option: {
        title : {
          text: '办结',
          x:'left',
          textStyle : {
            color: 'white',
          },
        },
        color: ['#0ffcff','#1890ff','#e7bcf3','#8378ea'],
        tooltip : {
          trigger: 'item',
          formatter: "{a} <br/>{b} : {c} ({d}%)"
        },
        legend: {
          orient: 'vertical',
          left: 'right',
          data: _.map(bjList['饼图'], (d) => { return d.name; }),
          textStyle : {
            color: 'white',
          },
        },
        series : [
          {
            name: '办结人数占比',
            type: 'pie',
            radius: ['35%', '50%'],
            center: ['50%', '30%'],
            data: bjList['饼图']?[bjList['饼图'][1],bjList['饼图'][3]]:[],
            label: {
              normal: {
                show: false
              },
              emphasis: {
                show: false
              }
            },
            itemStyle: {
              normal: {
                shadowBlur: 100,
                shadowColor: 'rgba(26, 107, 255, 0.3)'
              }
            },
          },{
            name:'办结件数占比',
            type:'pie',
            selectedMode: 'single',
            radius: ['0', '25%'],
            center: ['50%', '30%'],
            label: {
              normal: {
                show: false
              },
              emphasis: {
                show: false
              }
            },
            itemStyle: {
              normal: {
                shadowBlur: 100,
                shadowColor: 'rgba(26, 107, 255, 0.3)'
              }
            },
            data: bjList['饼图']?[bjList['饼图'][0],bjList['饼图'][2]]:[],
          }
        ]
      }
    };
    const bjtb={
      onEvents: (e) => {},
      option: {
        tooltip : {
          trigger: 'item',
          formatter: "{a} <br/>{b} : {c} ({d}%)"
        },
        color: ['#0ffcff','#45a1ff'],
        series : [
          {
            name: '占比',
            type: 'pie',
            radius: ['0', '50%'],
            center: ['30%', '50%'],
            data: [{name:'今年',value:bjList&&bjList['同比']?bjList['同比'].thisYearValue:''},
              {name:'去年',value:bjList&&bjList['同比']?bjList['同比'].lastYearValue:''}],
            label: {
              show:false
            },
            itemStyle: {
              normal: {
                shadowBlur: 50,
                shadowColor: 'rgba(26, 107, 255, 0.3)'
              }
            },
          }
        ]

      },
    };
    const bjhb={
      onEvents: (e) => {},
      option: {
        tooltip : {
          trigger: 'item',
          formatter: "{a} <br/>{b} : {c} ({d}%)"
        },
        color: ['#45a1ff','#0ffcff'],
        series : [
          {
            name: '占比',
            type: 'pie',
            radius: ['0', '50%'],
            center: ['75%', '50%'],
            data: [{name:'今年',value:bjList&&bjList['环比']?bjList['环比'].startValue:''},
              {name:'去年',value:bjList&&bjList['环比']?bjList['环比'].endValue:''}],
            label: {
              show:false
            },
            itemStyle: {
              normal: {
                shadowBlur: 50,
                shadowColor: 'rgba(26, 107, 255, 0.3)'
              }
            },
          }
        ]

      },
    };
    const wjListProps={
      onEvents: (e) => {
        let newDwbm='';
        if(dwbm.length==2){
          newDwbm = dwbm+'0000';
        }else if(dwbm.length==4){
          newDwbm = dwbm+'00';
        }else {
          newDwbm = dwbm;
        }
        dispatch(
          routerRedux.push({
            pathname: ajlb==='ZJ'? `${CONTEXT}/gafx/scdbga`:`${CONTEXT}/gafx/scqsga`,
            query: {
              sasj_startDate: startDate,
              sasj_endDate: endDate,
              ysay: ysay==='all'?['交通肇事罪','危险驾驶罪'] : [ysay],
              dwbm: newDwbm,
              by: dwbm.length===6 ? '1' : '0',
              jcgmc: dwmc
            },
          })
        );
      },
      option: {
        title : {
          text: '未结',
          x:'left',
          textStyle : {
            color: 'white',
          },
        },
        color: ['#0ffcff','#1890ff','#e7bcf3','#8378ea'],
        tooltip : {
          trigger: 'item',
          formatter: "{a} <br/>{b} : {c} ({d}%)"
        },
        legend: {
          orient: 'vertical',
          left: 'right',
          data: _.map(wjList['饼图'], (d) => { return d.name; }),
          textStyle : {
            color: 'white',
          },
        },
        series : [
          {
            name: '未结人数占比',
            type: 'pie',
            radius: ['35%', '50%'],
            center: ['50%', '30%'],
            data: wjList['饼图']?[wjList['饼图'][1],wjList['饼图'][3]]:[],
            label: {
              normal: {
                show: false
              },
              emphasis: {
                show: false
              }
            },
            itemStyle: {
              normal: {
                shadowBlur: 100,
                shadowColor: 'rgba(26, 107, 255, 0.3)'
              }
            },
          },{
            name:'未结件数占比',
            type:'pie',
            selectedMode: 'single',
            radius: ['0', '25%'],
            center: ['50%', '30%'],
            label: {
              normal: {
                show: false
              },
              emphasis: {
                show: false
              }
            },
            itemStyle: {
              normal: {
                shadowBlur: 100,
                shadowColor: 'rgba(26, 107, 255, 0.3)'
              }
            },
            data: wjList['饼图']?[wjList['饼图'][0],wjList['饼图'][2]]:[],
          }
        ]
      }
    };
    const wjtb={
      onEvents: (e) => {},
      option: {
        tooltip : {
          trigger: 'item',
          formatter: "{a} <br/>{b} : {c} ({d}%)"
        },
        color: ['#0ffcff','#45a1ff'],
        series : [
          {
            name: '占比',
            type: 'pie',
            radius: ['0', '50%'],
            center: ['30%', '50%'],
            data: [{name:'今年',value:wjList&&wjList['同比']?wjList['同比'].thisYearValue:''},
              {name:'去年',value:wjList&&wjList['同比']?wjList['同比'].lastYearValue:''}],
            label: {
              show:false
            },
            itemStyle: {
              normal: {
                shadowBlur: 50,
                shadowColor: 'rgba(26, 107, 255, 0.3)'
              }
            },
          }
        ]

      },
    };
    const wjhb={
      onEvents: (e) => {},
      option: {
        tooltip : {
          trigger: 'item',
          formatter: "{a} <br/>{b} : {c} ({d}%)"
        },
        color: ['#45a1ff','#0ffcff'],
        series : [
          {
            name: '占比',
            type: 'pie',
            radius: ['0', '50%'],
            center: ['75%', '50%'],
            data: [{name:'今年',value:wjList&&wjList['环比']?wjList['环比'].startValue:''},
              {name:'去年',value:wjList&&wjList['环比']?wjList['环比'].endValue:''}],
            label: {
              show:false
            },
            itemStyle: {
              normal: {
                shadowBlur: 50,
                shadowColor: 'rgba(26, 107, 255, 0.3)'
              }
            },
          }
        ]

      },
    };
    const pjbazqList={
      onEvents: (e) => {
        let newDwbm='';
        if(dwbm.length==2){
          newDwbm = dwbm+'0000';
        }else if(dwbm.length==4){
          newDwbm = dwbm+'00';
        }else {
          newDwbm = dwbm;
        }
        dispatch(
          routerRedux.push({
            pathname: ajlb==='ZJ'? `${CONTEXT}/gafx/scdbga`:`${CONTEXT}/gafx/scqsga`,
            query: {
              sasj_startDate: startDate,
              sasj_endDate: endDate,
              ysay: ysay==='all'?['交通肇事罪','危险驾驶罪'] : [ysay],
              dwbm: newDwbm,
              by: dwbm.length===6 ? '1' : '0',
              jcgmc: dwmc
            },
          })
        );
      },
      option: {
        title : {
          text: '平均办案周期/天',
          x:'left',
          textStyle : {
            color: 'white',
          },
        },
        color: ['#30fe4b','#f6fb11','#f02a16'],
        grid: {
          x: 40,
          y: 40,
          x2: 20,
          y2: 50
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            label: {
              backgroundColor: '#6a7985',
            },
          },
        },
        xAxis: {
          type: 'category',
          axisLabel: {
            interval: 0,
            rotate: 45,
            textStyle: {
              color: '#1d6dff',
            }
          },
          data: cycleList ? _.map(bascList['交通肇事罪']||bascList['危险驾驶罪'], (d) => { return d.month; }) :[]
        },
        yAxis: {
          type: 'value',
          axisLabel: {
            textStyle: {
              color: '#1d6dff',
            }
          },
          splitLine: {
            show: true,   // 网格线是否显示
            //  改变样式
            lineStyle: {
              color: '#1d6dff',   // 修改网格线颜色
            }
          },
        },
        series: [{
          name:'交通肇事罪',
          data: _.map(bascList['交通肇事罪'], (d) => {const a=d.value/24; const b=a.toFixed(1); return b; }),
          type: 'line',
        },{
          name:'危险驾驶罪',
          data: _.map(bascList['危险驾驶罪'], (d) => {const a=d.value/24; const b=a.toFixed(1); return b; }),
          type: 'line',
        }],
        legend: {
          data: bascList ? _.map(bascList, (value,key) => {return key;}) : [],
          align: 'right',
          right: 0,
          textStyle : {
            color: 'white',
          },
        },
      }
    };
    const zcjdListProps={
      onEvents: (e) => {
        let newDwbm='';
        if(dwbm.length==2){
          newDwbm = dwbm+'0000';
        }else if(dwbm.length==4){
          newDwbm = dwbm+'00';
        }else {
          newDwbm = dwbm;
        }
        dispatch(
          routerRedux.push({
            pathname: ajlb==='ZJ'? `${CONTEXT}/gafx/scdbga`:`${CONTEXT}/gafx/scqsga`,
            query: {
              sasj_startDate: startDate,
              sasj_endDate: endDate,
              ysay: ysay==='all'?['交通肇事罪','危险驾驶罪'] : [ysay],
              dwbm: newDwbm,
              by: dwbm.length===6 ? '1' : '0',
              jcgmc: dwmc
            },
          })
        );
      },
      option: {
        grid: {
          x: 40,
          y: 40,
          x2: 20,
          y2: 50
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            label: {
              backgroundColor: '#6a7985',
            },
          },
        },
        xAxis: {
          type: 'category',
          axisLabel: {
            interval: 0,
            rotate: 45,
            textStyle: {
              color: '#1d6dff',
            }
          },
          data: _.map(bascList['交通肇事罪']||bascList['危险驾驶罪'], (d) => { return d.month; }),
        },
        yAxis: {
          type: 'value',
          minInterval: 1,
          max: function(value) {
            if(value.max<5){
              return 5;
            }else{
              return value.max;
            }
          },
          axisLabel:{
            textStyle: {
              color: '#1d6dff',
            }
          },
          splitLine: {
            show: true,   // 网格线是否显示
            //  改变样式
            lineStyle: {
              color: '#1d6dff',   // 修改网格线颜色
            }
          },
        },
        series: ajlb==='ZJ'?
          [
            {
              name:'书面纠违',
              data: zcjdList['侦查监督'] ? _.map(zcjdList['侦查监督']['书面纠违'], (d) => { return d.value; }) : [],
              type: 'bar',
              stack:'one',
              color: ['#45a1ff'],
            },{
            name: '检察建议',
            data: zcjdList['侦查监督']? _.map(zcjdList['侦查监督']['检察建议'], (d) => { return d.value; }) : [],
            type: 'bar',
            stack:'one',
            color: ['#30fe4b'],
          },{
              name:'口头纠违',
              data: zcjdList['侦查监督'] ? _.map(zcjdList['侦查监督']['口头纠违'], (d) => { return d.value; }) : [],
              type: 'bar',
              stack:'two',
            color: ['#f6fb11'],
            }
          ]:
          buttonA ?
          [
            {
            name:'书面纠违',
            data: zcjdList['侦查监督'] ? _.map(zcjdList['侦查监督']['书面纠违'], (d) => { return d.value; }) : [],
            type: 'bar',
            stack:'one',
            color: ['#45a1ff'],
          },{
            name:'检察建议',
            data: zcjdList['侦查监督'] ? _.map(zcjdList['侦查监督']['检察建议'], (d) => { return d.value; }) : [],
            type: 'bar',
            stack:'one',
            color: ['#30fe4b'],
          },{
            name:'书面回复',
            data: zcjdList['侦查监督'] ? _.map(zcjdList['侦查监督']['书面回复'], (d) => { return d.value; }) : [],
            type: 'bar',
            stack:'two',
            color: ['#00bfc1'],
        }]:
          [
            {
              name:'书面纠违',
              data: zcjdList['审判监督'] ? _.map(zcjdList['审判监督']['书面纠违'], (d) => { return d.value; }) : [],
              type: 'bar',
              stack:'one',
              color: ['#45a1ff'],
            },{
            name:'检察建议',
            data: zcjdList['审判监督'] ? _.map(zcjdList['审判监督']['检察建议'], (d) => { return d.value; }) : [],
            type: 'bar',
            stack:'one',
            color: ['#30fe4b'],
          },{
            name:'书面回复',
            data: zcjdList['审判监督'] ? _.map(zcjdList['审判监督']['书面回复'], (d) => { return d.value; }) : [],
            type: 'bar',
            stack:'two',
            color: ['#00bfc1'],
          },{
              name:'抗诉',
              data: zcjdList['审判监督'] ? _.map(zcjdList['审判监督']['抗诉'], (d) => { return d.value; }) : [],
              type: 'bar',
              stack:'three',
            color: ['orange'],
            }
          ],
        legend: {
          data: _.map( ajlb==='ZJ'||buttonA ?zcjdList['侦查监督']:zcjdList['审判监督'], (value,key) => { return key; }),
          align: 'right',
          right: 10,
          textStyle : {
            color: 'white',
          },
        },
      }
    };
    const ajclListProps={
      onEvents: (e) => {
        let newDwbm='';
        if(dwbm.length==2){
          newDwbm = dwbm+'0000';
        }else if(dwbm.length==4){
          newDwbm = dwbm+'00';
        }else {
          newDwbm = dwbm;
        }
        dispatch(
          routerRedux.push({
            pathname: ajlb==='ZJ'? `${CONTEXT}/gafx/scdbga`:`${CONTEXT}/gafx/scqsga`,
            query: {
              sasj_startDate: startDate,
              sasj_endDate: endDate,
              ysay: ysay==='all'?['交通肇事罪','危险驾驶罪'] : [ysay],
              dwbm: newDwbm,
              by: dwbm.length===6 ? '1' : '0',
              jcgmc: dwmc
            },
          })
        );
      },
      option: {
        title : {
          text: '案件处理',
          x:'left',
          textStyle : {
            color: 'white',
          },
        },
        color: ['#45a1ff','#30fe4b','#f6fb11','#f02a16'],
        tooltip : {
          trigger: 'item',
          formatter: "{a} <br/>{b} : {c} ({d}%)"
        },
        legend: {
          orient: 'vertical',
          left: 'right',
          data: ajclList?_.map(ajclList['饼图'], (d) => { return d.name; }):[],
          textStyle : {
            color: 'white',
          },
        },
        series : [
          {
            name: ajlb==='ZJ'?'不捕情形占比':'不诉情形占比',
            type: 'pie',
            radius: ['0', '55%'],
            center: ['55%', '50%'],
            data: ajclList?_.map(ajclList['饼图'], (d) => {
                    _.assignIn(d, {
                      label:  {show: d.value?true: false, formatter: '{c}件\n{d}%', },
                      labelLine: {normal: {show: false}, emphasis: {show: false}}
                    });
                    return d;
                  }):[],
            itemStyle: {
              normal: {
                shadowBlur: 200,
                shadowColor: 'rgba(26, 107, 255, 0.3)'
              }
            },
          }
        ]
      }
    };

    const content = (
      <div className={classnames(styles.default, INTEGRATE ? styles.integrate : styles.nointegrate)}>
        {this.renderForm()}
        <Row className={classnames(styles.borderimg, INTEGRATE ? styles.integrleImg: styles.nointegrleImg)}>
          <Col span={8} className={classnames(styles.cardbody, INTEGRATE ? styles.integrleCardbody: styles.nointegrateCardbody)}>
            <Chart {...saListProps} />
            <div style={{width: '100%'}}>
              <div className={styles.tb}>
                <img src={leftTb}  className={styles.tbimg}/>
                <div className={styles.tbpie}>
                  <Chart {...satb} />
                </div>
                <p className={styles.tbtitle}>同比</p>
                <div className={styles.tbsj}>
                  <p className={styles.tbxq}>增长率：{saList&&saList['同比']?saList['同比'].percentage:''}</p>
                  <p className={styles.tbxq}>今年：{saList&&saList['同比']?saList['同比'].thisYearValue:''}</p>
                  <p className={styles.tbxq}>去年：{saList&&saList['同比']?saList['同比'].lastYearValue:''}</p>
                </div>
              </div>
              <div className={styles.hb}>
                <img src={rightHb} className={styles.hbimg} />
                <div className={styles.hbpie}>
                  <Chart {...sahb} />
                </div>
                <p className={styles.hbtitle}>环比</p>
                <div className={styles.hbsj}>
                  <p className={styles.hbxq}>增长率：{saList&&saList['环比']?saList['环比'].percentage:''}</p>
                  <p className={styles.hbxq}>{saList&&saList['环比']?saList['环比'].startMonth+'：'+saList['环比'].startValue:''}</p>
                  <p className={styles.hbxq}>{saList&&saList['环比']?saList['环比'].endMonth+'：'+saList['环比'].endValue:''}</p>
                </div>
              </div>
            </div>
          </Col>
          <Col span={8} className={classnames(styles.cardbody, INTEGRATE ? styles.integrleCardbody: styles.nointegrateCardbody)}>
            <Chart {...bjListProps} />
            <div style={{width: '100%'}}>
              <div className={styles.tb}>
                <img src={leftTb} className={styles.tbimg} />
                <div className={styles.tbpie}>
                  <Chart {...bjtb} />
                </div>
                <p className={styles.tbtitle}>同比</p>
                <div className={styles.tbsj}>
                  <p className={styles.tbxq}>增长率：{bjList&&bjList['同比']?bjList['同比'].percentage:''}</p>
                  <p className={styles.tbxq}>今年：{bjList&&bjList['同比']?bjList['同比'].thisYearValue:''}</p>
                  <p className={styles.tbxq}>去年：{bjList&&bjList['同比']?bjList['同比'].lastYearValue:''}</p>
                </div>
              </div>
              <div className={styles.hb}>
                <img src={rightHb} className={styles.hbimg} />
                <div className={styles.hbpie}>
                  <Chart {...bjhb} />
                </div>
                <p className={styles.hbtitle}>环比</p>
                <div className={styles.hbsj}>
                  <p className={styles.hbxq}>增长率：{bjList&&bjList['环比']?bjList['环比'].percentage:''}</p>
                  <p className={styles.hbxq}>{bjList&&bjList['环比']?bjList['环比'].startMonth+'：'+bjList['环比'].startValue:''}</p>
                  <p className={styles.hbxq}>{bjList&&bjList['环比']?bjList['环比'].endMonth+'：'+bjList['环比'].endValue:''}</p>
                </div>
              </div>
            </div>
          </Col>
          <Col span={8} className={classnames(styles.cardbody, INTEGRATE ? styles.integrleCardbody: styles.nointegrateCardbody)}>
            <Chart {...wjListProps} />
            <div style={{width: '100%'}}>
              <div className={styles.tb}>
                <img src={leftTb} className={styles.tbimg} />
                <div className={styles.tbpie}>
                  <Chart {...wjtb} />
                </div>
                <p className={styles.tbtitle}>同比</p>
                <div className={styles.tbsj}>
                  <p className={styles.tbxq}>增长率：{wjList&&wjList['同比']?wjList['同比'].percentage:''}</p>
                  <p className={styles.tbxq}>今年：{wjList&&wjList['同比']?wjList['同比'].thisYearValue:''}</p>
                  <p className={styles.tbxq}>去年：{wjList&&wjList['同比']?wjList['同比'].lastYearValue:''}</p>
                </div>
              </div>
              <div className={styles.hb}>
                <img src={rightHb} className={styles.hbimg} />
                <div className={styles.hbpie}>
                  <Chart {...wjhb} />
                </div>
                <p className={styles.hbtitle}>环比</p>
                <div className={styles.hbsj}>
                  <p className={styles.hbxq}>增长率：{wjList&&wjList['环比']?wjList['环比'].percentage:''}</p>
                  <p className={styles.hbxq}>{wjList&&wjList['环比']?wjList['环比'].startMonth+'：'+wjList['环比'].startValue:''}</p>
                  <p className={styles.hbxq}>{wjList&&wjList['环比']?wjList['环比'].endMonth+'：'+wjList['环比'].endValue:''}</p>
                </div>
              </div>
            </div>
          </Col>
          <Col span={8} className={classnames(styles.cardbody, INTEGRATE ? styles.integrleCardbody: styles.nointegrateCardbody)}>
            <Chart  {...pjbazqList}/>
          </Col>
          <Col span={8} className={classnames(styles.cardbody, INTEGRATE ? styles.integrleCardbody: styles.nointegrateCardbody)}>
            {zjName}
            <div className={styles.zcjd}>
              <Chart {...zcjdListProps} />
            </div>
          </Col>
          <Col span={8} className={classnames(styles.cardbody, INTEGRATE ? styles.integrleCardbody: styles.nointegrateCardbody)}>
            <div className={styles.ajcl}>
              <img src={ajclImg}  className={styles.ajclImg}/>
                {ajclList&&ajclList['占比']?
                  <div>
                    <div className={styles.ajclsjTop}>
                      <p className={styles.ajclsj}>{ajclList['占比'][0].name}</p>
                      <p className={styles.ajclsj}>{ajclList['占比'][0].percentage}</p>
                      <p className={styles.ajclsj}>{ajclList['占比'][0].value}&nbsp;件</p>
                    </div>
                    <div className={styles.ajclsjBottom}>
                      <p className={styles.ajclsj}>{ajclList['占比'][1].name}</p>
                      <p className={styles.ajclsj}>{ajclList['占比'][1].percentage}</p>
                      <p className={styles.ajclsj}>{ajclList['占比'][1].value}&nbsp;件</p>
                    </div>
                  </div>
                  :''}
              </div>
            <Chart {...ajclListProps} />
          </Col>
        </Row>
      </div>
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
