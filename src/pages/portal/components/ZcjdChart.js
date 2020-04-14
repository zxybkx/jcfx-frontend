import React, {Component} from 'react';
import _ from 'lodash';
import moment from 'moment';
import Chart from './Chart';
import styles from './Chart.less'
import HsModal from './Modal';

class ZcjdChart extends Component {

  constructor(props) {
    super(props);
    this.state = {
      buttonA: true,
      visible: false,
      detailData: [],
    };
  }

  hideModal = () => {
    this.setState({
      visible: false
    })
  };


  render() {
    const {dispatch, ajlb, zcjdList} = this.props;
    const {buttonA, visible, detailData} = this.state;
    const label = {
      normal: {
        color: '#fff',
        position: 'inside',
        show: true,
        formatter: (params)=>{
          if(params.value>0){
            return params.value
          }else {
            return ''
          }
        },
      }
    };

    const zjName = ajlb === 'ZJ' ?
      <span className={styles.zj} style={{fontWeight: 'bold', fontSize: 18, color: 'white'}}>侦查监督</span> :
      <div className={styles.zj}>
        <a
          style={{fontWeight: buttonA ? 'bold' : 'normal', fontSize: 18, color: buttonA ? 'white' : 'grey'}}
          onClick={() => {
            this.setState({
              buttonA: true,
            });
          }}
        >侦查监督</a>
        <span style={{color: 'white'}}>&nbsp;&nbsp;|&nbsp;&nbsp;</span>
        <a
          style={{fontWeight: !buttonA ? 'bold' : 'normal', fontSize: 18, color: !buttonA ? 'white' : 'grey'}}
          onClick={() => {
            this.setState({
              buttonA: false,
            });
          }}
        >审判监督</a>
      </div>;

    const zcjdListProps = {
      onEvents: (e) => {
        if (e.value > 0) {
          const column = ajlb === 'ZJ' ? 'db_zcjd_' : buttonA ? 'qs_zcjd_' : 'qs_spjd_';
          let detail = '';
          switch (e.seriesName) {
            case '书面纠违':
              detail = 'smjw';
              break;
            case '检察建议':
              detail = 'jcjy';
              break;
            case '书面回复':
              detail = 'smhf';
              break;
            case '抗诉':
              detail = 'ks';
              break;
            case '口头纠违':
              detail = 'ktjz';
              break;
          }
          dispatch({
            type: 'portal/countZcjdDetail',
            payload: {
              date: e.name,
              ajlb: ajlb,
              column: column + detail
            }
          }).then((data) => {
            this.setState({
              visible: true,
              detailData: data,
            })
          });
        }
      },
      option: {
        grid: {
          x: 40,
          y: 40,
          x2: 20,
          y2: 50,
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
            // rotate: 20,
            textStyle: {
              color: '#fff',
            },
          },
          data: _.map(zcjdList['侦查监督'] && zcjdList['侦查监督']['检察建议'], (d) => {
            const mon = moment(d.month).format("MM月");
            return mon;
          }),
        },
        yAxis: {
          type: 'value',
          minInterval: 1,
          max: function (value) {
            if (value.max < 5) {
              return 5;
            } else {
              return value.max;
            }
          },
          axisLabel: {
            textStyle: {
              color: '#fff',
            },
          },
          splitLine: {
            show: true,   // 网格线是否显示
            //  改变样式
            lineStyle: {
              color: '#1d6dff',   // 修改网格线颜色
            },
          },
        },
        series: ajlb === 'ZJ' ?
          [
            {
              name: '书面纠违',
              data: zcjdList['侦查监督'] ? _.map(zcjdList['侦查监督']['书面纠违'], (d) => {
                return d.value;
              }) : [],
              label: label,
              type: 'bar',
              stack: 'one',
              color: ['#45a1ff'],
            }, {
            name: '检察建议',
            data: zcjdList['侦查监督'] ? _.map(zcjdList['侦查监督']['检察建议'], (d) => {
              return d.value;
            }) : [],
            label: label,
            type: 'bar',
            stack: 'one',
            color: ['green'],
          }, {
            name: '口头纠违',
            data: zcjdList['侦查监督'] ? _.map(zcjdList['侦查监督']['口头纠违'], (d) => {
              return d.value;
            }) : [],
            label: label,
            type: 'bar',
            stack: 'two',
            color: ['#f6fb11'],
          },
          ] :
          buttonA ?
            [
              {
                name: '书面纠违',
                data: zcjdList['侦查监督'] ? _.map(zcjdList['侦查监督']['书面纠违'], (d) => {
                  return d.value;
                }) : [],
                label: label,
                type: 'bar',
                stack: 'one',
                color: ['#45a1ff'],
              }, {
              name: '检察建议',
              data: zcjdList['侦查监督'] ? _.map(zcjdList['侦查监督']['检察建议'], (d) => {
                return d.value;
              }) : [],
              label: label,
              type: 'bar',
              stack: 'one',
              color: ['green'],
            }, {
              name: '书面回复',
              data: zcjdList['侦查监督'] ? _.map(zcjdList['侦查监督']['书面回复'], (d) => {
                return d.value;
              }) : [],
              label: label,
              type: 'bar',
              stack: 'two',
              color: ['#f02a16'],
            }] :
            [
              {
                name: '书面纠违',
                data: zcjdList['审判监督'] ? _.map(zcjdList['审判监督']['书面纠违'], (d) => {
                  return d.value;
                }) : [],
                label: label,
                type: 'bar',
                stack: 'one',
                color: ['#45a1ff'],
              }, {
              name: '检察建议',
              data: zcjdList['审判监督'] ? _.map(zcjdList['审判监督']['检察建议'], (d) => {
                return d.value;
              }) : [],
              label: label,
              type: 'bar',
              stack: 'one',
              color: ['green'],
            }, {
              name: '书面回复',
              data: zcjdList['审判监督'] ? _.map(zcjdList['审判监督']['书面回复'], (d) => {
                return d.value;
              }) : [],
              label: label,
              type: 'bar',
              stack: 'two',
              color: ['#f02a16'],
            }, {
              name: '抗诉',
              data: zcjdList['审判监督'] ? _.map(zcjdList['审判监督']['抗诉'], (d) => {
                return d.value;
              }) : [],
              label: label,
              type: 'bar',
              stack: 'three',
              color: ['orange'],
            },
            ],
        legend: {
          data: _.map(ajlb === 'ZJ' || buttonA ? zcjdList['侦查监督'] : zcjdList['审判监督'], (value, key) => {
            return key;
          }),
          align: 'right',
          right: 10,
          textStyle: {
            color: 'white',
          },
        },
      },
    };

    const modalList = {
      visible, dispatch, detailData,
      hideModal: this.hideModal,
      ajlb, buttonA
    };

    return (
      <div className={styles.body}>
        <div className={styles.title}>{zjName}</div>
        <div className={styles.zcjd}>
          <Chart {...zcjdListProps} />
        </div>
        <HsModal {...modalList} />
      </div>
    );
  }
}

export default ZcjdChart;
