import React, {Component} from 'react';
import {Button} from 'antd';
import _ from 'lodash';
import Chart from './Chart';
import styles from './Chart.less';
import AjtsModel from './AjtsModel';
import moment from 'moment';

class ZcjdChart extends Component {

  constructor(props) {
    super(props);
    this.state = {
      btn: 'a',
      visible: false,
      dwbm: '',
      qyfbCbrgh: '',
      time: '',
      modelList: [],
      pagination: {},
      ajpmDwbm: '',
      ajpmCbrgh: '',
    };
  }

  onClick = (data) => {
    if (data !== this.state.btn) {
      this.setState({
        btn: data
      })
    }
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
    const {dispatch, searchVal} = this.props;
    const {time, dwbm, qyfbCbrgh, ajpmCbrgh, ajpmDwbm, btn} = this.state;
    const sasjS = time + '-01';
    const timeEnd = moment(time, "YYYY-MM").daysInMonth();
    const sasjE = time + '-' + timeEnd;

    dispatch({
      type: 'portal/getAjHs',
      payload: {
        pagination: {
          page: page ? page.current - 1 >0 ? page.current - 1 : 0: 0,
          size: page ? page.pageSize : 10,
        },
        query: {
          ...searchVal,
          sasjStart: btn === 'a'? sasjS : searchVal.sasjStart,
          sasjEnd: btn === 'a'? sasjE : searchVal.sasjEnd,
          field: type,
          ysay: [searchVal.ysay],
          dwbm: btn === 'b' ? dwbm :btn === 'c' ? ajpmDwbm : searchVal.dwbm,
          ajlb: searchVal.ajlb === 'all' ? ['ZJ','GS'] : [searchVal.ajlb],
          cbrgh: btn === 'c' ? ajpmCbrgh : btn === 'b' ? dwbm.length === 6 ? qyfbCbrgh: null : null,
        }
      }
    }).then(({data, success}) =>{
      if(data && success){
        this.setState({
          modelList: data.list,
          pagination:{
            total: data.list && data.total,
            page: page ? page.current : 0,
            size: page ? page.pageSize : 10,
          }
        })
      }
    })
  };

  render() {
    const {ajtsList, qyfbList, ajpmList, searchVal, dispatch, cs} = this.props;
    const {btn} = this.state;
    const ajtsProps = {
      onEvents: (e) => {
        this.setState({
          visible: true,
          time: e.name,
        });
        this.onChange(cs);
      },
      option: {
        color: ['#30fe4b', '#f6fb11', '#f02a16'],
        grid: {
          x: 50,
          y: 20,
          x2: 20,
          y2: 30
        },
        //提示框组件
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
            // rotate: 45,
            textStyle: {
              color: '#1d6dff',
            }
          },
          data: _.map(ajtsList && ajtsList, (d) => d.month),
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
          data: _.map(ajtsList && ajtsList, (d) => d.value),
          type: 'line'
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
    const qyfbProps = {
      onEvents: (e) => {
        this.setState({
          visible: true,
          dwbm: e.data.dwbm,
          qyfbCbrgh: e.data.cbrgh,
        });
        this.onChange(cs);
      },
      option: {
        color: ['#30fe4b', '#f6fb11', '#f02a16'],
        grid: {
          x: 30,
          y: 20,
          x2: 20,
          y2: 30
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
            // rotate: 45,
            textStyle: {
              color: '#1d6dff',
            }
          },
          data: _.map(qyfbList && qyfbList, (d) => d.area || d.name),
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
          data: qyfbList ? qyfbList : undefined,
          type: 'bar',
          barWidth: 20,//柱图宽度
          label: {
            normal: {
              show: true,
              position: 'top',
              color: '#fff'
            }
          },
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
    const ajpmProps = {
      onEvents: (e) => {
        this.setState({
          visible: true,
          ajpmCbrgh: e.data.cbrgh,
          ajpmDwbm: e.data.dwbm,
        });
        //console.log(this.state.qyfbCbrgh);
        this.onChange(cs);
      },
      option: {
        color: ['#30fe4b', '#f6fb11', '#f02a16'],
        grid: {
          x: 30,
          y: 20,
          x2: 20,
          y2: 30
        },
        //提示框组件
        tooltip: {
          //触发类型
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
            // rotate: 45,
            textStyle: {
              color: '#1d6dff',
            }
          },
          data: _.map(ajpmList && ajpmList, (d) => d.name),
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
          // data: _.map(ajpmList && ajpmList, (d) => d.value),
          data: ajpmList ? ajpmList :undefined,
          type: 'bar',
          barWidth: 20,//柱图宽度
          label: {
            normal: {
              show: true,
              position: 'top',
              color: '#fff'
            }
          },
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

    const {visible, pagination, modelList} = this.state;
    return (
      <div className={styles.body}>
        <AjtsModel title = "回溯表"
                   record  = {modelList}
                   pagination = {pagination}
                   hideModelHandler = {this.hideModelHandler}
                   visible = {visible}
                   cs = {cs}
                   searchVal = {searchVal}
                   onTableChange = {this.getHsList}
                   dispatch = {dispatch}
        />
        <div className={styles.title}>
          案件态势
          <Button type='primary'
                  size='small'
                  ghost
                  style={{marginLeft: 20, float: 'right'}}
                  onClick={() => {
                    this.onClick('c')
                  }}
          >
            案件排名
          </Button>
          <Button type='primary'
                  size='small'
                  ghost
                  style={{marginLeft: 20, float: 'right'}}
                  onClick={() => {
                    this.onClick('b')
                  }}
          >
            区域分布
          </Button>
          <Button type='primary'
                  size='small'
                  ghost
                  style={{marginLeft: 20, float: 'right'}}
                  onClick={() => {
                    this.onClick('a')
                  }}
          >
            态势图
          </Button>
        </div>
        <div className={styles.chart}>
          {btn === 'a' ? <Chart {...ajtsProps} /> : ''}
          {btn === 'b' ? <Chart {...qyfbProps} /> : ''}
          {btn === 'c' ? <Chart {...ajpmProps} /> : ''}
        </div>
      </div>
    );
  }
}

export default ZcjdChart;
