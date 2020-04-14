import React, {Component} from 'react';
import {Row, Col, Icon} from 'antd';
import Chart from '../../../components/TJFX/Chart';
import styles from './ChartInfo.less';
import Window from './Window';
import ChartTable from './ChartTable';


export default class DrillDown extends Component {
  state = {
    title: '',
    visible: false,
    ajlb: ''
  };
  hideModelHandler = () => {
    this.setState({
      visible: false,
    });
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
  };

  render() {
    const {drillDownType, baqkList, ModelList, type} = this.props;
    const {title, visible, ajlb} = this.state;
    const windowProps = {
      title,
      visible,
      onClose: this.hideModelHandler,
      onResize: (w, h) => {
        this.table && this.table.resize && this.table.resize();
      },
      exportFile: this.exportFile
    };

    const props = drillDownType === 'other' ? {
      onEvents: (e) => {
        if (e.name === '移送机关撤回') {
          this.setState({
            title: '移送单位撤回_GS'
          })
        } else if (e.name = '改变管辖') {
          this.setState({
            title: '改变管辖_GS'
          })
        } else if (e.name === '并案') {
          this.setState({
            title: '并案_GS'
          })
        } else if (e.name === '拆案') {
          this.setState({
            title: '拆案_GS'
          })
        } else {
          this.setState({
            title: '附条件不起诉_GS'
          })
        }
        this.setState({
          visible: true
        })
      },
      option: {
        color: '#37a2ff',
        dataset: {
          source: [
            ['移送机关撤回', baqkList['移送单位撤回_GS']],
            ['改变管辖', baqkList['改变管辖_GS']],
            ['并案', baqkList['并案_GS']],
            ['拆案', baqkList['拆案_GS']],
            ['附条件不起诉', baqkList['附条件不起诉_GS']]
          ],
        },
        grid: {
          containLabel: true,
          bottom: 10
        },
        xAxis: {name: ''},
        yAxis: {type: 'category'},
        label: {
          show: true
        },
        series: [
          {
            type: 'bar',
          }
        ]
      }
    } : drillDownType === 'cqwbd' ? {
      onEvents: (e) => {
        if (e.name === '当日超期') {
          this.setState({
            title: '当日超期人数_SP'
          })
        } else if (e.name === '积存超期') {
          this.setState({
            title: '积存超期人数_SP'
          })
        }
        this.setState({
          visible: true
        })
      },
      option: {
        color: '#37a2ff',
        dataset: {
          source: [
            ['当日超期', baqkList['当日超期_SP']],
            ['积存超期', baqkList['积存超期_SP']],
          ]
        },

        grid: {
          containLabel: true,
          bottom: 10
        },
        xAxis: {name: ''},
        yAxis: {type: 'category'},
        label: {show: true},
        series: [
          {
            type: 'bar',
          }
        ]
      }
    } : drillDownType === 'bqs' ? {
        onEvents: (e) => {
          if (e.name === '绝对不诉') {
            this.setState({
              title: '绝对不诉人数_GS'
            })
          } else if (e.name === '存疑不诉') {
            this.setState({
              title: '存疑不诉人数_GS'
            })
          } else if (e.name === '相对不诉') {
            this.setState({
              title: '相对不诉人数_GS'
            })
          }
          this.setState({
            visible: true
          })
        },
        option: {
          color: '#37a2ff',
          dataset: {
            source: [
              ['绝对不诉', baqkList['绝对不诉_GS']],
              ['存疑不诉', baqkList['存疑不诉_GS']],
              ['相对不诉', baqkList['相对不诉_GS']],
            ]
          },
          grid: {
            containLabel: true,
            bottom: 10
          },
          xAxis: {name: ''},
          yAxis: {type: 'category'},
          label: {
            show: true
          },
          series: [
            {
              type: 'bar',
            }
          ]
        }
      }
      : drillDownType === 'bpb' ? {
          onEvents: (e) => {
            if (e.name === '无逮捕必要不捕') {
              this.setState({
                title: '无逮捕必要人数_ZJ'
              })
            } else if (e.name === '存疑不捕') {
              this.setState({
                title: '存疑不捕人数_ZJ'
              })
            } else if (e.name === '不构罪不捕') {
              this.setState({
                title: '不构罪人数_ZJ'
              })
            }
            this.setState({
              visible: true
            })
          },
          option: {
            color: '#37a2ff',
            dataset: {
              source: [
                ['无逮捕必要不捕', baqkList['无逮捕必要_ZJ']],
                ['存疑不捕', baqkList['存疑不捕_ZJ']],
                ['不构罪不捕', baqkList['不构罪_ZJ']],
              ]
            },
            grid: {
              containLabel: true,
              bottom: 10
            },
            xAxis: {name: ''},
            yAxis: {type: 'category'},
            label: {
              show: true
            },
            series: [
              {
                type: 'bar',
              }
            ]
          }
        }
        : drillDownType === 'byz' ?
          {
            onEvents: (e) => {
              if (e.name === '其他') {
                this.setState({
                  title: '诉判不一（其他）_SP'
                })
              } else if (e.name === '改变量刑') {
                this.setState({
                  title: '改变量刑_SP'
                })
              } else if (e.name === '改变定性') {
                this.setState({
                  title: '改变定性_SP'
                })
              } else if (e.name === '改变事实') {
                this.setState({
                  title: '改变事实_SP'
                })
              }
              this.setState({
                visible: true,
                ajlb: 'SP'
              })
            },
            option: {
              color: '#37a2ff',
              dataset: {
                source: [
                  ['其他', baqkList['诉判不一（其他）_SP']],
                  ['改变量刑', baqkList['改变量刑_SP']],
                  ['改变定性', baqkList['改变定性_SP']],
                  ['改变事实', baqkList['改变事实_SP']],
                ]
              },
              grid: {
                containLabel: true,
                bottom: 10
              },
              xAxis: {name: ''},
              yAxis: {type: 'category'},
              label: {show: true},
              series: [
                {
                  type: 'bar',
                }
              ]
            }
          } : drillDownType === 'byz' ?
            {
              onEvents: (e) => {
                if (e.name === '其他') {
                  this.setState({
                    title: '诉判不一（其他）_SP'
                  })
                } else if (e.name === '改变量刑') {
                  this.setState({
                    title: '改变量刑_SP'
                  })
                } else if (e.name === '改变定性') {
                  this.setState({
                    title: '改变定性_SP'
                  })
                } else if (e.name === '改变事实') {
                  this.setState({
                    title: '改变事实_SP'
                  })
                }
                this.setState({
                  visible: true,
                  ajlb: 'SP'
                })
              },
              option: {
                color: '#37a2ff',
                dataset: {
                  source: [
                    ['其他', baqkList['诉判不一（其他）_SP']],
                    ['改变量刑', baqkList['改变量刑_SP']],
                    ['改变定性', baqkList['改变定性_SP']],
                    ['改变事实', baqkList['改变事实_SP']],
                  ]
                },
                grid: {
                  containLabel: true,
                  bottom: 10
                },
                xAxis: {name: ''},
                yAxis: {type: 'category'},
                label: {show: true},
                series: [
                  {
                    type: 'bar',
                  }
                ]
              }
            }

            : drillDownType === 'wsy' ?
              {
                onEvents: (e) => {
                  if (e.name === '其他') {
                    this.setState({
                      title: '其他理由_GS'
                    })
                  } else if (e.name === '不认罪') {
                    this.setState({
                      title: '犯罪嫌疑人不认罪_GS'
                    })
                  } else if (e.name === '认罪不认罚') {
                    this.setState({
                      title: '犯罪嫌疑人认罪不认罚_GS'
                    })
                  } else if (e.name === '律师未到位') {
                    this.setState({
                      title: '值班律师未到位_GS'
                    })
                  } else if (e.name === '无罪辩护') {
                    this.setState({
                      title: '辩护人作无罪辩护_GS'
                    })
                  } else if (e.name === '影响诉讼活动') {
                    this.setState({
                      title: '有影响刑事诉讼活动正常进行的活动_GS'
                    })
                  } else if (e.name === '犯罪性质恶劣') {
                    this.setState({
                      title: '犯罪性质恶劣、犯罪手段残忍、社会危害严重_GS'
                    })
                  } else if (e.name === '自愿放弃') {
                    this.setState({
                      title: '犯罪嫌疑人自愿放弃_GS'
                    })
                  } else if (e.name === '未赔偿谅解') {
                    this.setState({
                      title: '未就赔偿谅解达成一致_GS'
                    })
                  }
                  this.setState({
                    visible: true
                  })
                },
                option: {
                  color: '#37a2ff',
                  dataset: {
                    source: [
                      ['其他', baqkList['其他理由_GS']],
                      ['不认罪', baqkList['犯罪嫌疑人不认罪_GS']],
                      ['认罪不认罚', baqkList['犯罪嫌疑人认罪不认罚_GS']],
                      ['律师未到位', baqkList['值班律师未到位_GS']],
                      ['无罪辩护', baqkList['辩护人作无罪辩护_GS']],
                      ['影响诉讼活动', baqkList['有影响刑事诉讼活动正常进行的活动_GS']],
                      ['犯罪性质恶劣', baqkList['犯罪性质恶劣、犯罪手段残忍、社会危害严重_GS']],
                      ['自愿放弃', baqkList['犯罪嫌疑人自愿放弃_GS']],
                      ['未赔偿谅解', baqkList['未就赔偿谅解达成一致_GS']],
                    ]
                  },
                  grid: {
                    containLabel: true,
                    bottom: 10
                  },
                  xAxis: {name: ''},
                  yAxis: {type: 'category'},
                  label: {show: true},
                  series: [
                    {
                      type: 'bar',
                    }
                  ]
                }
              } :
              {
                onEvents: (e) => {
                  if(e.name==='移送单位撤回'){
                    this.setState({
                      title:'移送单位撤回_ZJ'
                    })
                  } else if (e.name === '拆案') {
                    this.setState({
                      title: '拆案_ZJ'
                    })
                  } else if (e.name === '并案') {
                    this.setState({
                      title: '并案_ZJ'
                    })
                  } else if (e.name === '改变管辖') {
                    this.setState({
                      title: '改变管辖_ZJ'
                    })
                  }
                  this.setState({
                    visible: true,
                  })
                },
                option: {
                  color: '#37a2ff',
                  dataset: {
                    source: [
                      ['移送单位撤回', baqkList['移送单位撤回_ZJ']],
                      ['改变管辖', baqkList['改变管辖_ZJ']],
                      ['并案', baqkList['并案_ZJ']],
                      ['拆案', baqkList['拆案_ZJ']]
                    ]
                  },
                  grid: {
                    containLabel: true,
                    bottom: 10
                  },
                  xAxis: {name: ''},
                  yAxis: {type: 'category'},
                  label: {show: true},
                  series: [
                    {
                      type: 'bar',
                    }
                  ]
                }
              };
    return (
      <div className={styles.drillDown}>
        <Chart {...props} type={'drillDown'}/>
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

