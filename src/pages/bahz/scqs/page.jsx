import {connect} from 'dva';
import React, {Component} from 'react';
import {routerRedux} from 'dva/router';
import {CONTEXT} from '../../../constant';
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
    const {dispatch, history} = this.props;
    const query = history.location.query;
    dispatch({
      type: 'tjfx/getTree',
      payload: {
        dwbm: '32',
      },
    });
    if (query && query.dwbm) {

      const searchValue = {
        sasj_startDate: query.sasj_startDate,
        sasj_endDate: query.sasj_endDate,
        ysay: query.ysay,
      };
      this.setState({
        dwmc: query.dwmc,
        searchValue: searchValue
      });
      this.isChild(query.haveChild, query.dwbm2, searchValue)

    } else {
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
              searchValue: searchValue,
            });
            this.isChild(data.hasClid, data.dwbm, searchValue)
          }
        })
    }
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
    this.isChild(haveChild, dwbm, values);
    this.setState({
      searchValue: values,
    });
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
    const {haveChild, searchValue, dwmc, dwbm} = this.state;
    this.setState({
      dwmc: record.dwmc,
    });
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
    } else {
      const {dispatch} = this.props;
      dispatch(
        routerRedux.push({
          pathname: `${CONTEXT}/gafx/scqsga`,
          query: {
            haveChild: false,
            ...searchValue,
            gh: record.cbrgh,
            dwbm: record.dwbm,
            dwbm2: dwbm,
            jcgmc: record.dwmc,
            dwmc: dwmc,
          },
        })
      );
    }
  };

  onCsClick = (record, key, cs) => {
    const {haveChild, searchValue, dwmc, dwbm} = this.state;
    const {dispatch} = this.props;
    const a = record.dwbm ? record.dwbm.split('') : [];
    if (haveChild && a[4] === '0' && a[5] === '0' && key != 1) {
      dispatch(
        routerRedux.push({
          pathname: `${CONTEXT}/gafx/scqsga`,
          query: {
            haveChild: true,
            ...searchValue,
            gh: record.cbrgh,
            dwbm: record.dwbm,
            dwbm2: dwbm,
            jcgmc: record.dwmc,
            dwmc: dwmc,
            cs: cs,
            by: '0'
          },
        })
      );
    } else {
      dispatch(
        routerRedux.push({
          pathname: `${CONTEXT}/gafx/scqsga`,
          query: {
            haveChild: haveChild,
            ...searchValue,
            gh: record.cbrgh,
            dwbm: record.dwbm,
            dwbm2: dwbm,
            jcgmc: record.dwmc,
            dwmc: dwmc,
            cs: cs,
            by: '1'
          },
        })
      );
    }
  };

  isChild = (haveChild, dwbm, searchValue) => {
    this.setState({
      dwbm: dwbm,
      loading: true,
      haveChild: haveChild ? true : false,
    });
    const {dispatch} = this.props;
    if (haveChild) {
      dispatch({
        type: 'tjfx/getDwhzAll',
        payload: {
          ajlb_bm: '0301',
          dwbm: dwbm,
          ...searchValue
        },
      });
    } else {
      dispatch({
        type: 'tjfx/getJcghzAll',
        payload: {
          ajlb_bm: '0301',
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
    const scqs = [
      {
        title: haveChild ? '单位' : '检察官',
        dataIndex: haveChild ? 'dwmc' : 'cbrxm',
        key: 'dwmc',
        width: 100,
        render: (text, record, key) =>
          <a onClick={() => {
            this.onClick(record, key);
          }}>{ text === '江苏省人民检察院' ? '江苏省院' : text } </a>,
      }, {
        title: '受案',
        children: [{
          title: '件',
          dataIndex: 'sa',
          key: 'sa',
          width: 50,
        }, {
          title: '人',
          dataIndex: 'sars',
          key: 'sqrs',
          width: 50,
        }]
      }, {
        title: '办结',
        children: [{
          title: '件',
          dataIndex: 'bj',
          key: 'bj',
          width: 50,
        }, {
          title: '人',
          dataIndex: 'bjrs',
          key: 'bjrs',
          width: 50,
        }]
      }, {
        title: '案卷总数',
        children: [{
          title: '册',
          dataIndex: 'ajzs',
          key: 'ajzs',
          width: 70,
        }],
      }, {
        title: '平均册数',
        children: [{
          title: '册',
          dataIndex: 'pjcs',
          key: 'pjcs',
          width: 70,
        }],
      }, {
        title: '平均办案周期',
        children: [{
          title: '天',
          dataIndex: 'pjbazq',
          key: 'pjbazq',
          width: 100,
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
        }],
      }, {
        title: '起诉',
        children: [{
          title: '件',
          dataIndex: 'qs',
          key: 'qs',
          width: 50,
          render: (text, record, key) =>
            <a onClick={() => {
              this.onCsClick(record, key, 'qs');
            }}>{ text }</a>,
        }, {
          title: '人',
          dataIndex: 'qsrs',
          key: 'qsrs',
          width: 50,
          render: (text, record, key) =>
            <a onClick={() => {
              this.onCsClick(record, key, 'qs');
            }}>{ text }</a>,
        }]
      }, {
        title: '不起诉',
        children: [{
          title: '相对不诉',
          children: [{
            title: '件',
            dataIndex: 'xdbs',
            key: 'xdbs',
            width: 50,
            render: (text, record, key) =>
              <a onClick={() => {
                this.onCsClick(record, key, 'xdbs');
              }}>{ text }</a>,
          }, {
            title: '人',
            dataIndex: 'xdbsrs',
            key: 'xdbsrs',
            width: 50,
            render: (text, record, key) =>
              <a onClick={() => {
                this.onCsClick(record, key, 'xdbs');
              }}>{ text }</a>,
          }],
        }, {
          title: '存疑不诉',
          children: [{
            title: '件',
            dataIndex: 'cybs',
            key: 'cybs',
            width: 50,
            render: (text, record, key) =>
              <a onClick={() => {
                this.onCsClick(record, key, 'cybs');
              }}>{ text }</a>,
          }, {
            title: '人',
            dataIndex: 'cybsrs',
            key: 'cybsrs',
            width: 50,
            render: (text, record, key) =>
              <a onClick={() => {
                this.onCsClick(record, key, 'cybs');
              }}>{ text }</a>,
          }],
        }, {
          title: '绝对不诉',
          children: [{
            title: '件',
            dataIndex: 'jdbs',
            key: 'jdbs',
            width: 50,
            render: (text, record, key) =>
              <a onClick={() => {
                this.onCsClick(record, key, 'jdbs');
              }}>{ text }</a>,
          }, {
            title: '人',
            dataIndex: 'jdbsrs',
            key: 'jdbsrs',
            width: 50,
            render: (text, record, key) =>
              <a onClick={() => {
                this.onCsClick(record, key, 'jdbs');
              }}>{ text }</a>,
          }],
        }],
      }, {
        title: '撤回',
        children: [{
          title: '件',
          dataIndex: 'ch',
          key: 'ch',
          width: 50,
          render: (text, record, key) =>
            <a onClick={() => {
              this.onCsClick(record, key, 'ch');
            }}>{ text }</a>,
        }, {
          title: '人',
          dataIndex: 'chrs',
          key: 'chrs',
          width: 50,
          render: (text, record, key) =>
            <a onClick={() => {
              this.onCsClick(record, key, 'ch');
            }}>{ text }</a>,
        }],
      }, {
        title: '退查未重报',
        children: [{
          title: '件',
          dataIndex: 'tcwcb',
          key: 'tcwcb',
          width: 50,
          render: (text, record, key) =>
            <a onClick={() => {
              this.onCsClick(record, key, 'tcwcb');
            }}>{ text }</a>,
        }, {
          title: '人',
          dataIndex: 'tcwcbrs',
          key: 'tcwcbrs',
          width: 50,
          render: (text, record, key) =>
            <a onClick={() => {
              this.onCsClick(record, key, 'tcwcb');
            }}>{ text }</a>,
        }],
      }, {
        title: '侦查监督',
        children: [{
          title: '违法点',
          children: [{
            title: '件',
            dataIndex: 'wfd',
            key: 'wfd',
            width: 70,
            render: (text, record, key) =>
              <a onClick={() => {
                this.onCsClick(record, key, 'wfd');
              }}>{ text }</a>,
          }],
        }, {
          title: '书面纠正',
          children: [{
            title: '件',
            dataIndex: 'smjz',
            key: 'smjz',
            width: 70,
            render: (text, record, key) =>
              <a onClick={() => {
                this.onCsClick(record, key, 'smjz');
              }}>{ text }</a>,
          }],
        }, {
          title: '检察建议',
          children: [{
            title: '件',
            dataIndex: 'jcjy',
            key: 'jcjy',
            width: 70,
            render: (text, record, key) =>
              <a onClick={() => {
                this.onCsClick(record, key, 'jcjy');
              }}>{ text }</a>,
          }],
        }, {
          title: '口头纠正',
          children: [{
            title: '件',
            dataIndex: 'ktjz',
            key: 'ktjz',
            width: 70,
            render: (text, record, key) =>
              <a onClick={() => {
                this.onCsClick(record, key, 'ktjz');
              }}>{ text }</a>,
          }],
        }],
      }, {
        title: '侦查监督回复',
        children: [{
          title: '书面回复',
          children: [{
            title: '件',
            dataIndex: 'smhf',
            key: 'smhf',
            width: 70,
            render: (text, record, key) =>
              <a onClick={() => {
                this.onCsClick(record, key, 'smhf');
              }}>{ text }</a>,
          }],
        }, {
          title: '超期未回复',
          children: [{
            title: '件',
            dataIndex: 'cqwhf',
            key: 'cqwhf',
            width: 100,
            render: (text, record, key) =>
              <a onClick={() => {
                this.onCsClick(record, key, 'cqwhf');
              }}>{ text }</a>,
          }],
        }],
      }, {
        title: '审判监督',
        children: [{
          title: '违法点',
          children: [{
            title: '个',
            dataIndex: 'wfd_spjd',
            key: 'wfd_spjd',
            width: 70,
            render: (text, record, key) =>
              <a onClick={() => {
                this.onCsClick(record, key, 'wfd_spjd');
              }}>{ text }</a>,
          }],
        }, {
          title: '抗诉',
          children: [{
            title: '件',
            dataIndex: 'ks',
            key: 'ks',
            width: 70,
            render: (text, record, key) =>
              <a onClick={() => {
                this.onCsClick(record, key, 'ks');
              }}>{ text }</a>,
          }],
        }, {
          title: '书面纠正',
          children: [{
            title: '件',
            dataIndex: 'smjz_spjd',
            key: 'smjz_spjd',
            width: 70,
            render: (text, record, key) =>
              <a onClick={() => {
                this.onCsClick(record, key, 'smjz_spjd');
              }}>{ text }</a>,
          }],
        }, {
          title: '检察建议',
          children: [{
            title: '件',
            dataIndex: 'jcjy_spjd',
            key: 'jcjy_spjd',
            width: 70,
            render: (text, record, key) =>
              <a onClick={() => {
                this.onCsClick(record, key, 'jcjy_spjd');
              }}>{ text }</a>,
          }],
        }, {
          title: '口头纠正',
          children: [{
            title: '件',
            dataIndex: 'ktjz_spjd',
            key: 'ktjz_spjd',
            width: 70,
            render: (text, record, key) =>
              <a onClick={() => {
                this.onCsClick(record, key, 'ktjz_spjd');
              }}>{ text }</a>,
          }],
        }],
      }, {
        title: '审判监督回复',
        children: [{
          title: '书面回复',
          children: [{
            title: '份',
            dataIndex: 'smhf_spjd',
            key: 'smhf_spjd',
            width: 70,
            render: (text, record, key) =>
              <a onClick={() => {
                this.onCsClick(record, key, 'smhf_spjd');
              }}>{ text }</a>,
          }],
        }, {
          title: '超期未回复',
          children: [{
            title: '件',
            dataIndex: 'cqwhf_spjd',
            key: 'cqwhf_spjd',
            width: 100,
            render: (text, record, key) =>
              <a onClick={() => {
                this.onCsClick(record, key, 'cqwhf_spjd');
              }}>{ text }</a>,
          }],
        }],
      },
    ];
    const ColumnsData = {title: '刑事办案智能辅助系统办案情况一览表（审查起诉）', columns: scqs, scroll: 2110};
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
      type: '3'
    };

    return (
      <Main {...MainList} />
    );
  }
}
