import {connect} from 'dva';
import React, {Component} from 'react';
import {routerRedux} from 'dva/router';
import {hasClid} from "../../../services/tjfx";
import Main from '../../../components/TJFX/HzMain';
import moment from 'moment';

@connect(({tjfx, loading}) => ({
  tjfx: tjfx,
}))
export default class Home extends Component {

  componentDidMount() {
    const myDate = new Date();
    const sasj_startDate = '2017-11-01';
    const sasj_endDate = moment(myDate).format('YYYY-MM-DD');
    const {dispatch} = this.props;
    dispatch({
      type: 'tjfx/getTree',
      payload: {
        dwbm: '32',
      },
    });
    const searchValue = {
      sasj_startDate: sasj_startDate,
      sasj_endDate: sasj_endDate,
      ysay: ['交通肇事罪']
    };
    hasClid({}).then(
      ({success, data}) => {
        if (success && data) {
          this.setState({
            dwmc: data.dwmc,
            searchValue: searchValue
          });
          this.isChild(data.hasClid, data.dwbm, searchValue)
        }
      })
  }

  constructor(props) {
    super(props);
    this.state = {
      haveChild: '',
      searchValue: '',
      dwmc: '',
      dwbm: '',
      loading: true,
    };
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      loading: nextProps.loading,
    })
  }

  // 搜索
  onSearch = (values) => {
    const {haveChild, dwbm} = this.state;
    this.setState({
      searchValue: values,
    });
    this.isChild(haveChild, dwbm, values);
  };

  // 树选择
  treeSelect = (values) => {
    this.setState({
      dwmc: values.name,
    });
    const {searchValue} = this.state;
    this.isChild(values.children, values.value, searchValue)
  };

  onClick = (record, key) => {
    this.setState({
      dwmc: record.dwmc,
    });
    const {haveChild, searchValue} = this.state;
    if (haveChild) {
      if (key === 0) {

      } else {
        const a = record.dwbm.split('');
        if (a[4] === '0' && a[5] === '0' && key != 1) {
          this.isChild(true, record.dwbm, searchValue)
        } else {
          this.isChild(false, record.dwbm, searchValue)
        }
      }
    }
  };

  isChild = (haveChild, dwbm, searchValue) => {
    this.setState({
      dwbm: dwbm,
      loading: true,
      haveChild: haveChild
    });
    const {dispatch} = this.props;
    if (haveChild) {
      dispatch({
        type: 'tjfx/getAllByDw',
        payload: {
          dwbm: dwbm,
          ...searchValue
        },
      });
    } else {
      dispatch({
        type: 'tjfx/getAllByJcg',
        payload: {
          dwbm: dwbm,
          ...searchValue
        },
      });
    }
  };

  render() {
    const {dispatch, tjfx} = this.props;
    const {list, treeList} = tjfx;
    const {haveChild, dwmc, loading} = this.state;
    const hz = [
      {
        title: '单位',
        dataIndex: haveChild ? 'dwmc' : 'cbrxm',
        key: 'dwmc',
        width: 100,
        render: (text, record, key) =>
          <a onClick={() => {
            this.onClick(record, key);
          }}>{ text === '江苏省人民检察院' ? '江苏省院' : text }</a>,
      },
      {
        title: '受案',
        children: [{
          title: '合计',
          children: [{
            title: '件',
            dataIndex: 'sa_scdb',
            key: 'hj',
            width: 50,
            render: (text, record) => {
              if (record.sa_scdb != null && record.sa != null) {
                return (<span>{record.sa_scdb + record.sa}</span>)
              }
            }
          }, {
            title: '人',
            key: 'hjrs',
            width: 50,
            render: (text, record) => {
              if (record.sa_scdbrs != null && record.sars != null) {
                return (<span>{record.sa_scdbrs + record.sars}</span>)
              }
            }
          }]
        }, {
          title: '审查逮捕',
          children: [{
            title: '件',
            dataIndex: 'sa_scdb',
            key: 'sa_scdb',
            width: 50,
          }, {
            title: '人',
            dataIndex: 'sa_scdbrs',
            key: 'sa_scdbrs',
            width: 50,
          }]
        }, {
          title: '审查起诉',
          children: [{
            title: '件',
            dataIndex: 'sa',
            key: 'sa',
            width: 50,
          }, {
            title: '人',
            dataIndex: 'sars',
            key: 'sars',
            width: 50,
          }]
        }]
      }, {
        title: '办结',
        children: [{
          title: '合计',
          children: [{
            title: '件',
            key: 'hj_bj',
            width: 50,
            render: (text, record) => {
              if (record.bj_scdb != null && record.bj_scqs != null) {
                return (<span>{record.bj_scdb + record.bj_scqs}</span>)
              }
            }
          }, {
            title: '人',
            key: 'hjrs_bj',
            width: 50,
            render: (text, record) => {
              if (record.bj_scdbrs != null && record.bj_scqsrs != null) {
                return (<span>{record.bj_scdbrs + record.bj_scqsrs}</span>)
              }
            }
          }]
        }, {
          title: '审查逮捕',
          children: [{
            title: '件',
            dataIndex: 'bj_scdb',
            key: 'bj_scdb',
            width: 50,
          }, {
            title: '人',
            dataIndex: 'bj_scdbrs',
            key: 'bj_scdbrs',
            width: 50,
          }]
        }, {
          title: '审查起诉',
          children: [{
            title: '件',
            dataIndex: 'bj_scqs',
            key: 'bj_scqs',
            width: 50,
          }, {
            title: '人',
            dataIndex: 'bj_scqsrs',
            key: 'bj_scqsrs',
            width: 50,
          }]
        }]
      },
      {
        title: '处理',
        children: [{
          title: '合计',
          children: [{
            title: '件',
            key: 'hj_cl',
            width: 50,
            render: (text, record) => {
              if (record.pb != null && record.qs != null) {
                return (<span>{record.pb + record.qs}</span>)
              }
            }
          }, {
            title: '人',
            key: 'hjrs_cl',
            width: 50,
            render: (text, record) => {
              if (record.pbrs != null && record.qsrs != null) {
                return (<span>{record.pbrs + record.qsrs}</span>)
              }
            }
          }]
        }, {
          title: '批捕',
          children: [{
            title: '件',
            dataIndex: 'pb',
            key: 'pb',
            width: 50,
          }, {
            title: '人',
            dataIndex: 'pbrs',
            key: 'pbrs',
            width: 50,
          }]
        }, {
          title: '起诉',
          children: [{
            title: '件',
            dataIndex: 'qs',
            key: 'qs',
            width: 50,
          }, {
            title: '人',
            dataIndex: 'qsrs',
            key: 'qsrs',
            width: 50,
          }]
        }]
      },
      {
        title: '平均办案周期',
        children: [{
          title: '审查逮捕',
          children: [{
            title: '天',
            dataIndex: 'pjbazq_scdb',
            key: 'pjbazq_scdb',
            width: 70,
            render: (text, record) => {
              if (text) {
                const a = text / 24;
                const b = a.toFixed(1);
                return (<span>{b}</span>)
              } else if (record.dwmc || record.cbrxm) {
                return (<span>—</span>)
              } else {
                return (<span></span>)
              }
            }
          }]
        }, {
          title: '审查起诉',
          children: [{
            title: '天',
            dataIndex: 'pjbazq',
            key: 'pjbazq',
            width: 70,
            render: (text, record) => {
              if (text) {
                const a = text / 24;
                const b = a.toFixed(1);
                return (<span>{b}</span>)
              } else if (record.dwmc || record.cbrxm) {
                return (<span>—</span>)
              } else {
                return (<span></span>)
              }
            }
          }]
        }]
      },
      {
        title: '侦查监督',
        children: [{
          title: '书面纠正',
          children: [{
            title: '件',
            dataIndex: 'smjz',
            key: 'smjz',
            width: 70,
          }]
        }, {
          title: '检察建议',
          children: [{
            title: '件',
            dataIndex: 'jcjy',
            key: 'jcjy',
            width: 70,
          }]
          // }, {
          //   title: '书面回复',
          //   children: [{
          //     title: '件',
          //     dataIndex: 'smhf',
          //     key: 'smhf',
          //     width: 70,
          //   }]
        }]
      },
      {
        title: '审判监督',
        children: [
          {
            title: '抗诉',
            children: [{
              title: '件',
              dataIndex: 'ks',
              key: 'ks',
              width: 70,
            }]
          },
          {
            title: '书面纠正',
            children: [{
              title: '件',
              dataIndex: 'smjz_spjd',
              key: 'smjz_spjd',
              width: 70,
            }]
          },
          {
            title: '检察建议',
            children: [{
              title: '件',
              dataIndex: 'jcjy_spjd',
              key: 'jcjy_spjd',
              width: 70,
            }]
          },
          // {
          //   title: '书面回复',
          //   children: [{
          //     title: '件',
          //     dataIndex: 'smhf_spjd',
          //     key: 'smhf_spjd',
          //     width: 70,
          //   }]
          // },
        ]
      },
    ];
    const ColumnsData = {title: '刑事办案智能辅助系统办案情况汇总表', columns: hz, scroll: 1630};
    const MainList = {
      dispatch,
      list,
      dwmc,
      loading,
      treeList,
      haveChild,
      ColumnsData,
      treeSelect: this.treeSelect,
      onSearch: this.onSearch,
      type: '1'
    };

    return (
      <Main {...MainList} />
    );
  }
}
