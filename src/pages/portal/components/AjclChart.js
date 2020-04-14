import React, {Component} from 'react';
import moment from 'moment';
import _ from 'lodash';
import Chart from './Chart';
import styles from './Chart.less';
import ajclImg from '../../../assets/ajcl.png';
import HsModal from './Modal';

class AjclChart extends Component {
  constructor(props) {
    super(props);
    this.state = {
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
    const {dispatch, ajlb, ajclList} = this.props;
    const {visible, detailData} = this.state;

    const ajclListProps = {
      onEvents: (e) => {
        if (e.value > 0) {
          const myDate = new Date();
          const endDate = moment(myDate).format('YYYY-MM-DD');
          let column = '';
          switch (e.name) {
            case '相对不诉':
              column = 'xdbs';
              break;
            case '存疑不诉':
              column = 'cybs';
              break;
            case '绝对不诉':
              column = 'jdbs';
              break;
            case '不构罪不捕':
              column = 'bgz';
              break;
            case '事实不清证据不足不捕':
              column = 'cybb';
              break;
            case '无逮捕必要不捕':
              column = 'wdbby';
              break;
          }
          dispatch({
            type: 'portal/countAjclDetail',
            payload: {
              startDate: '2018-01-01',
              endDate: endDate,
              ajlb: ajlb,
              column: column
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
        title: {
          text: '案件处理',
          x: 'left',
          textStyle: {
            color: 'white',
          },
        },
        color: ['#45a1ff', '#30fe4b', '#f6fb11', '#f02a16'],
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c} ({d}%)',
        },
        legend: {
          orient: 'vertical',
          left: 'right',
          data: ajclList ? _.map(ajclList['饼图'], (d) => {
            return d.name;
          }) : [],
          textStyle: {
            color: 'white',
          },
        },
        series: [
          {
            name: ajlb === 'ZJ' ? '不捕情形占比' : '不诉情形占比',
            type: 'pie',
            radius: ['0', '55%'],
            center: ['55%', '50%'],
            data: ajclList ? _.map(ajclList['饼图'], (d) => {
              _.assignIn(d, {
                label: {show: d.value ? true : false, formatter: '{c}件\n{d}%'},
                labelLine: {normal: {show: false}, emphasis: {show: false}},
              });
              return d;
            }) : [],
            itemStyle: {
              normal: {
                shadowBlur: 200,
                shadowColor: 'rgba(26, 107, 255, 0.3)',
              },
            },
          },
        ],
      },
    };

    const modalList = {
      visible, dispatch, detailData,
      hideModal: this.hideModal,
      ajlb
    };

    return (
      <div className={styles.body}>
        <div className={styles.ajcl}>
          <img src={ajclImg} className={styles.ajclImg}/>
          {ajclList && ajclList['占比'] ?
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
            : ''}
        </div>
        <Chart {...ajclListProps} />
        <HsModal {...modalList} />
      </div>
    );
  }
}

export default AjclChart;
