import React, {Component} from 'react';
import {Row, Col, Icon, Tooltip} from 'antd';
import Chart from '../../../components/TJFX/Chart';
import styles from './ChartInfo.less';
import DrillDown from './DrillDown';
import Window from './Window';
import ChartTable from './ChartTable';
import icon from '../../../assets/icon.png';
import p1 from '../../../assets/p1.png';
import p2 from '../../../assets/p2.png';
import p3 from '../../../assets/p3.png';
import p4 from '../../../assets/p4.png';
import tb from '../../../assets/tb.png';

export default class ChartInfo extends Component {
  state = {
    drillDownVisible: false,
    drillDownType: '',
    visible: false,
    name: '',
    type: '',
    ajlb: '',
    title: ''
  };
  handleClick = () => {
    this.setState({
      drillDownVisible: false
    })
  };
  wsy = () => {
    this.setState({
      drillDownVisible: true,
      drillDownType: 'wsy'
    })
  };
  hideModelHandler = () => {
    this.setState({
      visible: false,
      ajlb: ''
    });
  };
  hs = (title) => {
    this.setState({
      title: title,
      visible: true,
    }, () => {
      if (this.state.title === '违法点（审判监督）' || this.state.title === '书面纠违（审判监督）_SP' || this.state.title === '抗诉_SP' || this.state.title === '口头纠违（审判监督）_SP' || this.state.title === '检察建议（审判监督）_SP' || this.state.title === '诉判比对_SP' || this.state.title === '诉判比对人数_SP') {
        this.setState({
          ajlb: 'SP'
        })
      }
    })
  };
  exportFile = (fieId) => {
    const {ModelList: {dispatch, dwbm, ysay, startTime, endTime}} = this.props;
    dispatch({
      type: 'tjfx/exportRblb',
      payload: {
        sasjStart: startTime,
        sasjEnd: endTime,
        dwbm: dwbm,
        field: fieId,
        ysay: ysay
      }
    })
  }

  render() {
    const {baqkList, ModelList, type} = this.props;
    const {drillDownVisible, drillDownType, visible, title, ajlb} = this.state;
    const slSum = baqkList['受理_ZJ'] + baqkList['受理_GS'];
    const slData = [
      {
        value: baqkList['受理_ZJ'],
        name: `提捕\n${baqkList['受理_ZJ']}件${baqkList['受理人数_ZJ']}人`,
        label: {show: slSum === 0 || baqkList['受理_ZJ'] !== 0 ? true : false},
        labelLine: {show: slSum === 0 || baqkList['受理_ZJ'] !== 0 ? true : false}
      },
      {
        value: baqkList['受理_GS'],
        name: `移诉\n${baqkList['受理_GS']}件${baqkList['受理人数_GS']}人`,
        label: {show: slSum === 0 || baqkList['受理_GS'] !== 0 ? true : false},
        labelLine: {show: slSum === 0 || baqkList['受理_GS'] !== 0 ? true : false}
      },
    ];
    const zs = [{
      value: baqkList['直诉_GS'],
      name: `直诉\n${baqkList['直诉_GS']}件${baqkList['直诉人数_GS']}人`
    }];
    const sl = {
      onEvents: (e) => {
        if (e.name === `移诉\n${baqkList['受理_GS']}件${baqkList['受理人数_GS']}人`) {
          this.setState({
            title: '受理人数_GS'
          })
        } else if (e.name === `提捕\n${baqkList['受理_ZJ']}件${baqkList['受理人数_ZJ']}人`) {
          this.setState({
            title: '受理人数_ZJ'
          })
        } else if (e.name === `直诉\n${baqkList['直诉_GS']}件${baqkList['直诉人数_GS']}人`) {
          this.setState({
            title: '直诉人数_GS'
          })
        }
        this.setState({
          visible: true
        })
      },
      option: {
        color: [`${baqkList['直诉_GS'] === 0 ? '#cad0d7' : '#16bff6'}`, '#fbc51d', '#50a5ff'],
        tooltip: {
          trigger: 'item',
          formatter: "{a} <br/>{b}:{c} ({d}%)"
        },
        series: [
          {
            name: '受理',
            type: 'pie',
            label: {position: 'inner', textStyle: {color: '#2d405e'}},
            selectedMode: 'single',
            radius: [0, '30%'],
            center: ['50%', '58%'],
            tooltip: {
              formatter: `<br/>{b}:{c} (${baqkList['直诉_GS'] === 0 ? 0 : (baqkList['直诉_GS'] / baqkList['受理_GS'] * 100).toFixed(2)}%)`
            },
            data: zs
          },
          {
            name: '受理',
            type: 'pie',
            label: {
              textStyle: {color: '#2d405e'}
            },
            labelLine: {
              normal: {
                length: 10,
              }
            },
            radius: ['45%', '62%'],
            center: ['50%', '58%'],
            avoidLabelOverlap: false,
            itemStyle: {
              emphasis: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            },
            data: slData
          }
        ]
      }
    };
    const gsOther = baqkList['拆案_GS'] + baqkList['并案_GS'] + baqkList['改变管辖_GS'] + baqkList['附条件不起诉_GS'] + baqkList['移送单位撤回_GS']
    const gsPeople = baqkList['拆案人数_GS'] + baqkList['并案人数_GS'] + baqkList['改变管辖人数_GS'] + baqkList['附条件不起诉人数_GS'] + baqkList['同意公安机关撤回人数_GS'] + baqkList['退查后未重报_GS']
    const zjOther = baqkList['拆案_ZJ'] + baqkList['并案_ZJ'] + baqkList['改变管辖_ZJ'] + baqkList['移送单位撤回_ZJ'];
    const zjPeople = baqkList['拆案人数_ZJ'] + baqkList['并案人数_ZJ'] + baqkList['改变管辖人数_ZJ'] + baqkList['移送单位撤回人数_ZJ'];
    const sjSumInner = baqkList['办结_ZJ'] + baqkList['办结_GS'];
    const sjSum = baqkList['批捕_ZJ'] + baqkList['不批捕_ZJ'] + zjOther + gsOther + baqkList['不起诉_GS'] + baqkList['起诉_GS'];
    const sjDataInner = [
      {
        value: baqkList['办结_ZJ'],
        name: `审查逮捕\n${baqkList['办结_ZJ']}件${baqkList['办结人数_ZJ']}人`,
        label: {show: sjSumInner === 0 || baqkList['办结_ZJ'] !== 0 ? true : false},
        labelLine: {show: sjSumInner === 0 || baqkList['办结_ZJ'] !== 0 ? true : false}
      },
      {
        value: baqkList['办结_GS'],
        name: `审查起诉\n${baqkList['办结_GS']}件${baqkList['办结人数_GS']}人`,
        label: {show: sjSumInner === 0 || baqkList['办结_GS'] !== 0 ? true : false},
        labelLine: {show: sjSumInner === 0 || baqkList['办结_GS'] !== 0 ? true : false}
      },
    ];
    const sjData = [
      {
        value: baqkList['批捕_ZJ'],
        name: `批捕\n${baqkList['批捕_ZJ']}件${baqkList['批捕人数_ZJ']}人`,
        label: {show: sjSum === 0 || baqkList['批捕_ZJ'] !== 0 ? true : false},
        labelLine: {show: sjSum === 0 || baqkList['批捕_ZJ'] !== 0 ? true : false}
      },
      {
        value: baqkList['不批捕_ZJ'],
        name: `不批捕\n${baqkList['不批捕_ZJ']}件${baqkList['不批捕人数_ZJ']}人`,
        label: {show: sjSum === 0 || baqkList['不批捕_ZJ'] !== 0 ? true : false},
        labelLine: {show: sjSum === 0 || baqkList['不批捕_ZJ'] !== 0 ? true : false}
      },
      {
        value: zjOther,
        name: `其它\n${zjOther}件${zjPeople}人`,
        label: {show: sjSum === 0 || zjOther !== 0 ? true : false},
        labelLine: {show: sjSum === 0 || zjOther !== 0 ? true : false}
      },
      {
        value: gsOther,
        name: `其它\n${gsOther} 件${gsPeople} 人`,
        label: {show: sjSum === 0 || gsOther !== 0 ? true : false},
        labelLine: {show: sjSum === 0 || gsOther !== 0 ? true : false}
      },
      {
        value: baqkList['不起诉_GS'],
        name: `不起诉\n${baqkList['不起诉_GS']}件${baqkList['不起诉人数_GS']}人`,
        label: {show: sjSum === 0 || baqkList['不起诉_GS'] !== 0 ? true : false},
        labelLine: {show: sjSum === 0 || baqkList['不起诉_GS'] !== 0 ? true : false}
      },
      {
        value: baqkList['起诉_GS'],
        name: `起诉\n${baqkList['起诉_GS']}件${baqkList['起诉人数_GS']}人`,
        label: {show: sjSum === 0 || baqkList['起诉_GS'] !== 0 ? true : false, textStyle: {textAlign: 'right'}},
        labelLine: {show: sjSum === 0 || baqkList['起诉_GS'] !== 0 ? true : false}
      },
    ];
    const sj = {
      onEvents: (e) => {
        if (e.name === `其它\n${gsOther} 件${gsPeople} 人`) {
          this.setState({
            drillDownVisible: true,
            drillDownType: 'other'
          })
        } else if (e.name === `其它\n${zjOther}件${zjPeople}人`) {
          this.setState({
            drillDownVisible: true,
            drillDownType: 'another'
          })
        } else if (e.name === `不批捕\n${baqkList['不批捕_ZJ']}件${baqkList['不批捕人数_ZJ']}人`) {
          this.setState({
            drillDownVisible: true,
            drillDownType: 'bpb'
          })
        } else if (e.name === `不起诉\n${baqkList['不起诉_GS']}件${baqkList['不起诉人数_GS']}人`) {
          this.setState({
            drillDownVisible: true,
            drillDownType: 'bqs'
          })
        }
        if (e.name === `批捕\n${baqkList['批捕_ZJ']}件${baqkList['批捕人数_ZJ']}人`) {
          this.setState({
            title: '批捕人数_ZJ'
          })
        } else if (e.name === `起诉\n${baqkList['起诉_GS']}件${baqkList['起诉人数_GS']}人`) {
          this.setState({
            title: '起诉人数_GS'
          })
        } else if (e.name === `审查逮捕\n${baqkList['办结_ZJ']}件${baqkList['办结人数_ZJ']}人`) {
          this.setState({
            title: '办结人数_ZJ'
          })
        } else {
          this.setState({
            title: '办结人数_GS'
          })
        }
        if (e.name !== `其它\n${gsOther} 件${gsPeople} 人` && e.name !== `其它\n${zjOther}件${zjPeople}人` && e.name !== `不批捕\n${baqkList['不批捕_ZJ']}件${baqkList['不批捕人数_ZJ']}人` && e.name !== `不起诉\n${baqkList['不起诉_GS']}件${baqkList['不起诉人数_GS']}人`) {
          this.setState({
            visible: true,
          })
        }
      },
      option: {
        color: ['#d16f32', '#39a5ff', '#ee813e', '#f5a742', '#f8b540', '#39a5ff', '#6dbcff', '#84c6ff'],
        tooltip: {
          trigger: 'item',
          formatter: "{a} <br/>{b}: {c} ({d}%)"
        },
        series: [
          {
            name: '审结',
            type: 'pie',
            selectedMode: 'single',
            radius: [0, '35%'],
            center: ['49%', '58%'],

            label: {
              normal: {
                position: 'inner',
                textStyle: {color: '#fff'}
              }
            },
            labelLine: {
              normal: {
                show: false
              }
            },
            data: sjDataInner
          },
          {
            name: '审结',
            type: 'pie',
            radius: ['35%', '62%'],
            center: ['49%', '58%'],
            label: {
              textStyle: {color: '#2d405e'}
            },
            data: sjData
          }
        ]
      }
    };
    const spSum = baqkList['判决_SP'] + baqkList['诉判超期未比对_SP'];
    const spSumInner = baqkList['无罪判决_SP'] + baqkList['诉判不一_SP'] + baqkList['诉判一致_SP'];
    const spData = [
      {
        value: baqkList['判决_SP'],
        name: `收到判决\n${baqkList['判决_SP']}件${baqkList['判决人数_SP']}人`,
        label: {show: spSum === 0 || baqkList['判决_SP'] !== 0 ? true : false},
        labelLine: {show: spSum === 0 || baqkList['判决_SP'] !== 0 ? true : false}
      },
      {
        value: baqkList['诉判超期未比对_SP'],
        name: `超期未比对\n${baqkList['诉判超期未比对_SP']}件${baqkList['诉判超期未比对人数_SP']}人`,
        label: {show: spSum === 0 || baqkList['诉判超期未比对_SP'] !== 0 ? true : false},
        labelLine: {show: spSum === 0 || baqkList['诉判超期未比对_SP'] !== 0 ? true : false}
      },
    ];
    const spDataInner = [
      {
        value: baqkList['无罪判决_SP'],
        name: `无罪判决\n${baqkList['无罪判决_SP']}件${baqkList['无罪判决人数_SP']}人`,
        selected: true,
        label: {show: spSumInner === 0 || baqkList['无罪判决_SP'] !== 0 ? true : false},
        labelLine: {show: spSumInner === 0 || baqkList['无罪判决_SP'] !== 0 ? true : false},
      },
      {
        value: baqkList['诉判不一_SP'],
        name: `不一致\n${baqkList['诉判不一_SP']}件${baqkList['诉判不一个数_SP']}处`,
        label: {show: spSumInner === 0 || baqkList['诉判不一_SP'] !== 0 ? true : false},
        labelLine: {show: spSumInner === 0 || baqkList['诉判不一_SP'] !== 0 ? true : false}
      },
      {
        value: baqkList['诉判一致_SP'],
        name: `诉判一致\n${baqkList['诉判一致_SP']}件${baqkList['诉判一致个数_SP']}人`,
        label: {show: spSumInner === 0 || baqkList['诉判一致_SP'] !== 0 ? true : false},
        labelLine: {show: spSumInner === 0 || baqkList['诉判一致_SP'] !== 0 ? true : false}
      }
    ];
    const spdb = {
      onEvents: (e) => {
        if (e.name === `不一致\n${baqkList['诉判不一_SP']}件${baqkList['诉判不一个数_SP']}处` || e.name === `超期未比对\n${baqkList['诉判超期未比对_SP']}件${baqkList['诉判超期未比对人数_SP']}人`) {
          this.setState({
            drillDownVisible: true,
            drillDownType: e.name.indexOf('不一致') > -1 ? 'byz' : 'cqwbd'
          })
        } else {
          if (e.name === `无罪判决\n${baqkList['无罪判决_SP']}件${baqkList['无罪判决人数_SP']}人`) {
            this.setState({
              title: '无罪判决人数_SP',
            })
          } else if (e.name === `收到判决\n${baqkList['判决_SP']}件${baqkList['判决人数_SP']}人`) {
            this.setState({
              title: '判决人数_SP',
            })
          } else if (e.name === `诉判一致\n${baqkList['诉判一致_SP']}件${baqkList['诉判一致个数_SP']}人`) {
            this.setState({
              title: '诉判一致个数_SP',
            })
          }
          this.setState({
            visible: true
          })
        }
        if (e.name !== `不一致\n${baqkList['诉判不一_SP']}件${baqkList['诉判不一个数_SP']}处` && e.name !== `超期未对比\n${baqkList['诉判超期未比对_SP']}件${baqkList['诉判超期未比对人数_SP']}人`) {
          this.setState({
            ajlb: 'SP'
          })
        }
      },
      option: {
        color: ['#60acfc', '#ff8d7a', '#50a5ff', '#50a5ff', '#fbc51d'],
        tooltip: {
          trigger: 'item',
          formatter: "{a} <br/>{b}: {c} ({d}%)"
        },
        series: [
          {
            name: '诉判比对',
            type: 'pie',
            selectedMode: 'single',
            radius: [0, '30%'],
            center: ['50%', '58%'],
            label: {
              normal: {
                position: 'inner',
                textStyle: {color: '#2d405e'}
              }
            },
            labelLine: {
              normal: {
                show: false
              }
            },
            data: spDataInner
          },
          {
            name: '诉判比对',
            type: 'pie',
            radius: ['45%', '62%'],
            center: ['50%', '58%'],
            label: {
              textStyle: {color: '#2d405e'}
            },
            data: spData
          }
        ]
      }
    };
    const rzrfTop = baqkList['认罪认罚人数_GS'] + baqkList['未适用认罪认罚人数_GS'];
    const rzrf = baqkList['普通程序_GS'] + baqkList['简易程序_GS'] + baqkList['速裁程序_GS'];
    const zcjdBottom = baqkList['检察建议_ZJ'] + baqkList['检察建议_GS'] + baqkList['书面纠违_ZJ'] + baqkList['书面纠违_GS'] + baqkList['口头纠违_ZJ'] + baqkList['口头纠违_GS'];
    const spjdBottom = baqkList['抗诉_SP'] + baqkList['检察建议（审判监督）_SP'] + baqkList['书面纠违（审判监督）_SP'] + baqkList['口头纠违（审判监督）_SP'];
    const windowProps = {
      title,
      visible,
      onClose: this.hideModelHandler,
      onResize: (w, h) => {
        this.table && this.table.resize && this.table.resize();
      },
      exportFile: this.exportFile
    };
    return (
      <div className={styles.default}>
        <img src={p1} className={styles.p1}/>
        <img src={p2} className={styles.p2}/>
        <img src={p3} className={styles.p3}/>
        <img src={p4} className={styles.p4}/>
        <Row style={{height: '60%'}}>
          <Col span={10} style={{height: '100%'}}>
            <div className={styles.topTitle}>受理<a onClick={() => {
              this.hs('受理')
            }}>{baqkList['受理']}</a>件<a onClick={() => {
              this.hs('受理人数')
            }}>{baqkList['受理人数']}</a>人/卷宗<a onClick={() => {
              this.hs('案卷总数')
            }}>{baqkList['案卷总数']}</a>册
            </div>
            <Col span={16} style={{height: '100%'}}>
              <Chart {...sl} />
            </Col>
            <Col span={8} className={styles.tb}>
              <img src={tb} className={styles.tbImg}/>
              <div className={styles.ytb}>
                <div>退补：<a onClick={() => {
                  this.hs('退回补充侦查_GS')
                }}>{baqkList['退回补充侦查_GS']}</a>件<a onClick={() => {
                  this.hs('退回补充侦查人数_GS')
                }}>{baqkList['退回补充侦查人数_GS']}</a>人
                </div>
                <div>一退：<a onClick={() => {
                  this.hs('一退_GS')
                }}>{baqkList['一退_GS']}</a>件<a onClick={() => {
                  this.hs('一退人数_GS')
                }}>{baqkList['一退人数_GS']}</a>人
                </div>
                <div>二退：<a onClick={() => {
                  this.hs('二退_GS')
                }}>{baqkList['二退_GS']}</a>件<a onClick={() => {
                  this.hs('二退人数_GS')
                }}>{baqkList['二退人数_GS']}</a>人
                </div>
              </div>
            </Col>
          </Col>
          <Col span={7} style={{height: '100%'}}>
            <div className={styles.topTitle} style={{marginLeft: 56}}>审结<a onClick={() => {
              this.hs('办结')
            }}>{baqkList['办结_ZJ'] + baqkList['办结_GS']}</a>件<a onClick={() => {
              this.hs('办结人数')
            }}>{baqkList['办结人数_ZJ'] + baqkList['办结人数_GS']}</a>人
            </div>
            <Chart {...sj} />
          </Col>
          <Col span={7} style={{height: '100%'}}>
            <div className={styles.topTitle} style={{marginLeft: 30}}>诉判比对<a onClick={() => {
              this.hs('诉判比对_SP')
            }}>{baqkList['诉判比对_SP']}</a>件<a onClick={() => {
              this.hs('诉判比对人数_SP')
            }}>{baqkList['诉判比对人数_SP']}</a>人
            </div>
            <img src={icon} className={styles.logo}/>
            <Chart {...spdb} />
          </Col>
        </Row>
        <Row style={{height: '40%'}}>
          <Col span={8} style={{height: '100%'}}>
            <div className={styles.title}>认罪认罚</div>
            <div className={styles.first}>
              <Tooltip
                title={`适用${baqkList['认罪认罚_GS']}件${baqkList['认罪认罚人数_GS']}人(${rzrfTop === 0 ? 0 : (baqkList['认罪认罚人数_GS'] / rzrfTop * 100).toFixed(2)}%)`}>
                <div className={styles.second} style={{
                  background: '#26b4fc',
                  width: `${rzrfTop === 0 ? 50 : (baqkList['认罪认罚人数_GS']) / rzrfTop * 100}%`,
                  height: '100%'
                }} onClick={() => {
                  this.hs('认罪认罚人数_GS')
                }}>适用{baqkList['认罪认罚_GS']}件{baqkList['认罪认罚人数_GS']}人
                </div>
              </Tooltip>
              <Tooltip
                title={`未适用${baqkList['未适用认罪认罚_GS']}件${baqkList['未适用认罪认罚人数_GS']}人(${rzrfTop === 0 ? 0 : (baqkList['未适用认罪认罚人数_GS'] / rzrfTop * 100).toFixed(2)}%)`}>
                <div className={styles.second} style={{
                  background: '#4dc3ff',
                  width: `${rzrfTop === 0 ? 50 : baqkList['未适用认罪认罚人数_GS'] / rzrfTop * 100}%`,
                  height: '100%',
                  cursor: 'pointer'
                }}
                     onClick={this.wsy}>未适用{baqkList['未适用认罪认罚_GS']}件{baqkList['未适用认罪认罚人数_GS']}人
                </div>
              </Tooltip>
            </div>
            <div style={{width: '80%', position: 'relative'}} className={styles.first}>
              <Tooltip
                title={`简易${baqkList['简易程序_GS']}件${baqkList['简易程序人数_GS']}人(${rzrf === 0 ? 0 : (baqkList['简易程序_GS'] / rzrf * 100).toFixed(2)}%)`}>
                <div className={styles.second} style={{
                  background: '#ffbb2a',
                  width: `${rzrf === 0 ? 33.3 : baqkList['简易程序_GS'] / rzrf * 100}%`,
                  height: '100%'
                }} onClick={() => {
                  this.hs('简易程序人数_GS')
                }}>简易{baqkList['简易程序_GS']}件{baqkList['简易程序人数_GS']}人
                </div>
              </Tooltip>
              <Tooltip
                title={`速裁${baqkList['速裁程序_GS']}件${baqkList['速裁程序人数_GS']}人(${rzrf === 0 ? 0 : (baqkList['速裁程序_GS'] / rzrf * 100).toFixed(2)}%)`}>
                <div className={styles.second} style={{
                  background: '#fed16c',
                  width: `${rzrf === 0 ? 33.3 : baqkList['速裁程序_GS'] / rzrf * 100}%`,
                  height: '100%'
                }} onClick={() => {
                  this.hs('速裁程序人数_GS')
                }}>速裁{baqkList['速裁程序_GS']}件{baqkList['速裁程序人数_GS']}人
                </div>
              </Tooltip>
              <Tooltip
                title={`普通${baqkList['普通程序_GS']}件${baqkList['普通程序人数_GS']}人(${rzrf === 0 ? 0 : (baqkList['普通程序_GS'] / rzrf * 100).toFixed(2)}%)`}
                mouseLeaveDelay={baqkList['普通程序_GS'] / rzrf * 100 < 5 ? 300 : 0.1}>
                <div className={styles.second} style={{
                  background: '#ffdd93',
                  width: `${rzrf === 0 ? 33.3 : baqkList['普通程序_GS'] / rzrf * 100}%`,
                  height: '100%'
                }} onClick={() => {
                  this.hs('普通程序人数_GS')
                }}>普通{baqkList['普通程序_GS']}件{baqkList['普通程序人数_GS']}人
                </div>
              </Tooltip>
              <div style={{position: 'absolute', top: '8px', right: '-40px'}} className={styles.title}>程序</div>
            </div>
          </Col>
          <Col span={8} style={{height: '100%'}}>
            <div className={styles.title}>侦查监督</div>
            <div className={styles.first}>
              <Tooltip
                title={`违法瑕疵${baqkList['违法点_ZJ'] + baqkList['违法点_GS']}件${baqkList['违法点个数_ZJ'] + baqkList['违法点个数_GS']}处(${(baqkList['违法点_ZJ'] + baqkList['违法点_GS'] === 0 ? 0 : 100)}%)`}>
                <div className={styles.second} style={{
                  background: '#0098e6',
                  width: '100%',
                  height: '100%'
                }} onClick={() => {
                  this.hs('违法点个数')
                }}>违法瑕疵{baqkList['违法点_ZJ'] + baqkList['违法点_GS']}件{baqkList['违法点个数_ZJ'] + baqkList['违法点个数_GS']}处
                </div>
              </Tooltip>
            </div>
            <div className={styles.first}>
              <Tooltip
                title={`口头纠违${baqkList['口头纠违_ZJ'] + baqkList['口头纠违_GS']}件(${zcjdBottom === 0 ? 0 : ((baqkList['口头纠违_ZJ'] + baqkList['口头纠违_GS']) / zcjdBottom * 100).toFixed(2)}%)`}>
                <div className={styles.second} style={{
                  background: '#ffbb2a',
                  width: `${zcjdBottom === 0 ? 33.3 : (baqkList['口头纠违_ZJ'] + baqkList['口头纠违_GS']) / zcjdBottom * 100}%`,
                  height: '100%'
                }} onClick={() => {
                  this.hs('口头纠违')
                }}>口头纠违{baqkList['口头纠违_ZJ'] + baqkList['口头纠违_GS']}件
                </div>
              </Tooltip>
              <Tooltip
                title={`书面纠违${baqkList['书面纠违_ZJ'] + baqkList['书面纠违_GS']}件(${zcjdBottom === 0 ? 0 : ((baqkList['书面纠违_ZJ'] + baqkList['书面纠违_GS']) / zcjdBottom * 100).toFixed(2)}%)`}>
                <div className={styles.second} style={{
                  background: '#fed16c',
                  width: `${zcjdBottom === 0 ? 33.3 : (baqkList['书面纠违_ZJ'] + baqkList['书面纠违_GS']) / zcjdBottom * 100}%`,
                  height: '100%'
                }} onClick={() => {
                  this.hs('书面纠违')
                }}>书面纠违{baqkList['书面纠违_ZJ'] + baqkList['书面纠违_GS']}件
                </div>
              </Tooltip>
              <Tooltip
                title={`检察建议${baqkList['检察建议_ZJ'] + baqkList['检察建议_GS']}件(${zcjdBottom === 0 ? 0 : ((baqkList['检察建议_ZJ'] + baqkList['检察建议_GS']) / zcjdBottom * 100).toFixed(2)}%)`}
                mouseLeaveDelay={(baqkList['检察建议_ZJ'] + baqkList['检察建议_GS']) / zcjdBottom * 100 < 5 ? 300 : 0.1}>
                <div className={styles.second} style={{
                  background: '#ffdd93',
                  width: `${zcjdBottom === 0 ? 33.3 : (baqkList['检察建议_ZJ'] + baqkList['检察建议_GS']) / zcjdBottom * 100}%`,
                  height: '100%'
                }} onClick={() => {
                  this.hs('检察建议')
                }}><span style={{width: '33.3%'}}>检察建议{baqkList['检察建议_ZJ'] + baqkList['检察建议_GS']}件</span></div>
              </Tooltip>
            </div>
          </Col>
          <Col span={8} style={{height: '100%'}}>
            <div className={styles.title}>审判监督</div>
            <div className={styles.first}>
              <Tooltip
                title={`违法瑕疵${baqkList['违法点（审判监督）_SP']}件${baqkList['违法点（审判监督）个数_SP']}处(${baqkList['违法点（审判监督）_SP'] === 0 ? 0 : 100}%)`}>
                <div className={styles.second} style={{
                  background: '#0098e6',
                  width: '100%',
                  height: '100%'
                }} onClick={() => {
                  this.hs('违法点（审判监督）个数_SP')
                }}>违法瑕疵{baqkList['违法点（审判监督）_SP']}件{baqkList['违法点（审判监督）个数_SP']}处
                </div>
              </Tooltip>
            </div>
            <div className={styles.first}>
              <Tooltip
                title={`书面纠违${baqkList['书面纠违（审判监督）_SP']}件(${spjdBottom === 0 ? 0 : (baqkList['书面纠违（审判监督）_SP'] / spjdBottom * 100).toFixed(2)}%)`}>
                <div className={styles.second} style={{
                  background: '#ffbb2a',
                  width: `${spjdBottom === 0 ? 25 : baqkList['书面纠违（审判监督）_SP'] / spjdBottom * 100}%`,
                  height: '100%'
                }} onClick={() => {
                  this.hs('书面纠违（审判监督）_SP')
                }}>书面纠违{baqkList['书面纠违（审判监督）_SP']}件
                </div>
              </Tooltip>
              <Tooltip
                title={`抗诉${baqkList['抗诉_SP']}件(${spjdBottom === 0 ? 0 : (baqkList['抗诉_SP'] / spjdBottom * 100).toFixed(2)}%)`}>
                <div className={styles.second} style={{
                  background: '#ffc851',
                  width: `${spjdBottom === 0 ? 25 : baqkList['抗诉_SP'] / spjdBottom * 100}%`,
                  height: '100%'
                }} onClick={() => {
                  this.hs('抗诉_SP')
                }}>抗诉{baqkList['抗诉_SP']}件
                </div>
              </Tooltip>
              <Tooltip
                title={`口头纠违${baqkList['口头纠违（审判监督）_SP']}件(${spjdBottom === 0 ? 0 : (baqkList['口头纠违（审判监督）_SP'] / spjdBottom * 100).toFixed(2)}%)`}>
                <div className={styles.second} style={{
                  background: '#fed16c',
                  width: `${spjdBottom === 0 ? 25 : baqkList['口头纠违（审判监督）_SP'] / spjdBottom * 100}%`,
                  height: '100%'
                }} onClick={() => {
                  this.hs('口头纠违（审判监督）_SP')
                }}>口头纠违{baqkList['口头纠违（审判监督）_SP']}件
                </div>
              </Tooltip>
              <Tooltip
                title={`检察建议${baqkList['检察建议（审判监督）_SP']}件(${spjdBottom === 0 ? 0 : (baqkList['检察建议（审判监督）_SP'] / spjdBottom * 100).toFixed(2)}%)`}
                mouseLeaveDelay={baqkList['检察建议（审判监督）_SP'] / spjdBottom * 100 < 5 ? 300 : 0.1}>
                <div className={styles.second} style={{
                  background: '#ffdd93',
                  width: `${spjdBottom === 0 ? 25 : baqkList['检察建议（审判监督）_SP'] / spjdBottom * 100}%`,
                  height: '100%'
                }} onClick={() => {
                  this.hs('检察建议（审判监督）_SP')
                }}>检察建议{baqkList['检察建议（审判监督）_SP']}件
                </div>
              </Tooltip>
            </div>
          </Col>
        </Row>
        {drillDownVisible &&
        <div>
          <DrillDown drillDownType={drillDownType} baqkList={baqkList} ModelList={ModelList} type={type}/>
          <div className={styles.more}>
            <Icon type="close" className={styles.icon} onClick={this.handleClick}/>
          </div>
        </div>
        }
        {
          visible &&
          <Window  {...windowProps}
                   ref={c => this.container = c}
                   height={document.body.clientHeight * 0.7}
          >
            <ChartTable title={title} ModelList={ModelList} type={type} ajlb={ajlb}/>
          </Window>
        }
      </div>
    )
  }
}
