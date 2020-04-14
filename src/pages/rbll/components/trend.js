import React, {Component, Fragment} from 'react';
import {Modal} from 'antd';
import styles from './Main.less';
import classnames from 'classnames';
import Chart from '../../../components/TJFX/Chart';

export default class Trend extends Component {
  render() {
    const {visible, trendType, month, value} = this.props;
    const zcjdProps = {
      option: {
        color: '#6495ED',
        title: {
          text: '侦查监督'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            label: {
              backgroundColor: '#6a7985'
            }
          }
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: [
          {
            type: 'category',
            boundaryGap: false,
            data: month
          }
        ],
        yAxis: [
          {
            type: 'value'
          }
        ],
        series: [

          {
            name: '侦查监督',
            type: 'line',
            stack: '总量',
            areaStyle: {},
            data: value
          },


        ]
      }
    };

    const rzrfProps = {
      option: {
        color: '#6495ED',
        title: {
          text: '认罪认罚'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            label: {
              backgroundColor: '#6a7985'
            }
          }
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: [
          {
            type: 'category',
            boundaryGap: false,
            data: month
          }
        ],
        yAxis: [
          {
            type: 'value'
          }
        ],
        series: [

          {
            name: '认罪认罚',
            type: 'line',
            stack: '总量',
            areaStyle: {},
            data: value
          },


        ]
      }
    };

    const lxjyProps = {
      option: {
        color: '#6495ED',
        title: {
          text: '量刑采纳'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            label: {
              backgroundColor: '#6a7985'
            }
          }
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: [
          {
            type: 'category',
            boundaryGap: false,
            data: month
          }
        ],
        yAxis: [
          {
            type: 'value'
          }
        ],
        series: [

          {
            name: '量刑采纳',
            type: 'line',
            stack: '总量',
            areaStyle: {},
            data: value
          },


        ]
      }
    };

    return (
      <Modal
        width='calc(50vw)'
        visible={visible}
        onOk={this.props.handleOk}
        onCancel={this.props.handleCancle}
      >
        {trendType === 'zcjd' ?
          <Chart {...zcjdProps}/> : trendType === 'rzrf' ? <Chart {...rzrfProps}/> : <Chart {...lxjyProps}/>
        }

      </Modal>
    )
  }
}
