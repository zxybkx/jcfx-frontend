import React, {Component} from 'react';
import {Row, Col} from 'antd';
import _ from 'lodash';
import Chart from './Chart';
import styles from './Chart.less';
import TbhbModel from './TbhbModel';

class ZcjdChart extends Component {

  constructor(props) {
    super(props);
    this.state = {
      buttonA: true,
      visible: false,
      detailData: [],
      cs: '',
      sasjTime: '',
      bjsjTime: '',
      modelList: [],
      pagination: {},
    };
  };

  onChange = (cs) =>{
    this.getHsList(cs);
  };

  hideModelHandler = () =>{
    this.setState({
      visible: false,
    })
  };

  okHandler = () =>{
    this.hideModelHandler();
  };

  getHsList = (type, page) =>{
    const {dispatch, searchVal, cs} = this.props;
    const {sasjTime, bjsjTime} = this.state;

    const sasj = sasjTime && sasjTime.split("-");
    const sasjStart = sasj && sasj[0].substring(0, 4) + "-" + sasj[0].substring(4, 6) + "-" + sasj[0].substring(6, 8);
    const sasjEnd = sasj && sasj[1].substring(0, 4) + "-" + sasj[1].substring(4, 6) + "-" + sasj[1].substring(6, 8);

    const bjsj = bjsjTime && bjsjTime.split("-");
    const bjsjStart = bjsj && bjsj[0].substring(0, 4) + "-" + bjsj[0].substring(4, 6) + "-" + bjsj[0].substring(6, 8);
    const bjsjEnd = bjsj && bjsj[1].substring(0, 4) + "-" + bjsj[1].substring(4, 6) + "-" + bjsj[1].substring(6, 8);

    dispatch({
      type: 'portal/getAjHs',
      payload: {
        pagination: {
          page: page ? page.current - 1 >0 ? page.current - 1 : 0 : 0,
          size: page ? page.pageSize : 10,
        },
        query: {
          ...searchVal,
          sasjStart: sasjStart,
          sasjEnd: sasjEnd,
          bjsjStart: bjsjStart,
          bjsjEnd: bjsjEnd,
          field: type,
          ysay: [searchVal.ysay],
          dwbm: searchVal.dwbm,
          ajlb: searchVal.ajlb === 'all' ? ['ZJ','GS'] : [searchVal.ajlb],
          cbrgh: null,
        }
      },
    }).then(({data, success}) =>{
      if(data && success){
        this.setState({
          modelList: data.list,
          pagination: {
            total: data.list && data.total,
            current: page ? page.current : 0,
            size: page ? page.pageSize : 10,
          }
        })
      }
    })
  };


  render() {
    const {tbhbList, searchVal, dispatch,cs} = this.props;

    const tbProps = {
      onEvents: (e) => {
        //console.log(e.data.bjsj);
        this.setState({
          visible: true,
          sasjTime: e.name,
          bjsjTime: e.data.bjsj ,
        });
        this.onChange(cs);
      },
      option: {
        color: ['#03b8df'],
        grid: {
          x: 50,
          y: 20,
          x2: 20,
          y2: 50
        },
        tooltip: {
          //坐标轴触发
          trigger: 'axis',
          //坐标轴指示器（鼠标悬浮到图上出现标线、刻度...）
          axisPointer: {
            type: 'cross',
            label: {
              backgroundColor: '#6a7985',
            },
          },
        },
        xAxis: {
          type: 'category',
          //坐标轴刻度标签设置
          axisLabel: {
            formatter:function(val){
              return val.split("-").join("\n");
            },
            show: true,
            //强制显示所有标签
            interval: 0,
            textStyle: {
              color: '#1d6dff',
            }
          },
          data: _.map(tbhbList && tbhbList['同比'], (d) => d.month),
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
            lineStyle: {
              color: '#1d6dff',   // 修改网格线颜色
            }
          },
        },
        series: [{
          // name:'协议',
          type: 'bar',
          barWidth: 30,//柱图宽度
          //图像上的文本标签
          label: {
            normal: {
              show: true,
              position: 'top',
              color: '#fff'
            }
          },
          // data: _.map(tbhbList && tbhbList['同比'], (d) => d.value),
          data: tbhbList ? tbhbList['同比']:undefined,
        }],
        //图例组件
        legend: {
          data: [],
          align: 'right',
          right: 0,
          textStyle: {
            color: 'white',
          },
        },
      }
    };
    const hbProps = {
      onEvents: (e) => {
        this.setState({
          visible: true,
          sasjTime: e.name,
          bjsjTime: e.data.bjsj,
        });
        this.onChange(cs);
      },
      option: {
        color: ['#02e3eb'],
        grid: {
          x: 50,
          y: 20,
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
            formatter:function(val){
              return val.split("-").join("\n");
            },
            interval: 0,
            textStyle: {
              color: '#1d6dff',
            }
          },
          data: _.map(tbhbList && tbhbList['环比'], (d) => d.month),
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
          // name:'协议',
          type: 'bar',
          barWidth: 30,//柱图宽度
          label: {
            normal: {
              show: true,
              position: 'top',
              color: '#fff'
            }
          },
          //data:  _.map(tbhbList && tbhbList['环比'], (d) => d.value),
          data: tbhbList ? tbhbList['环比'] : undefined,
        }],
        legend: {
          data: [],
          align: 'right',
          right: 0,
          textStyle: {
            color: 'white',
          },
        },
      }
    };

    const { visible, pagination,modelList} = this.state;
    return (
      <div className={styles.body}>
        <TbhbModel title = "回溯表"
                   record ={modelList}
                   pagination = {pagination}
                   hideModelHandler = {this.hideModelHandler}
                   visible = {visible}
                   cs = {cs}
                   searchVal = {searchVal}
                   onTableChange = {this.getHsList}
                   dispatch = {dispatch}
        />
        <Row>
          <Col span={12}>
            <div className={styles.title}>同比</div>
            <div className={styles.chart}>
              <Chart {...tbProps} />
            </div>
          </Col>
          <Col span={12}>
            <div className={styles.title}>环比</div>
            <div className={styles.chart}>
              <Chart {...hbProps} />
            </div>
          </Col>
        </Row>
      </div>
    );
  }
}

export default ZcjdChart;
