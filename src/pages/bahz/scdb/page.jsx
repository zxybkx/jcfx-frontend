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
    const myDate = new Date()
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
              searchValue: searchValue
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
    const {haveChild, searchValue, dwmc, dwbm} = this.state;
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
          pathname: `${CONTEXT}/gafx/scdbga`,
          query: {
            haveChild: false,
            ...searchValue,
            gh: record.cbrgh,
            dwbm: record.dwbm,
            dwbm2: dwbm,
            jcgmc: record.dwmc,
            dwmc: dwmc,
            cs: ''
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
          pathname: `${CONTEXT}/gafx/scdbga`,
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
          pathname: `${CONTEXT}/gafx/scdbga`,
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
    })
    const {dispatch} = this.props;
    if (haveChild) {
      dispatch({
        type: 'tjfx/getDwhzAll',
        payload: {
          ajlb_bm: '0201',
          dwbm: dwbm,
          ...searchValue
        },
      });
    } else {
      dispatch({
        type: 'tjfx/getJcghzAll',
        payload: {
          ajlb_bm: '0201',
          dwbm: dwbm,
          ...searchValue
        },
      });
    }
  }

  render() {
    const {dispatch, tjfx} = this.props;
    const {list, treeList} = tjfx;
    const {haveChild, dwmc, loading} = this.state;
    const scdb = [
      {
        title: '单位',
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
          key: 'sars',
          width: 50,
        }],
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
        }],
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
        title: '批捕',
        children: [{
          title: '件',
          dataIndex: 'pb',
          key: 'pb',
          width: 50,
          render: (text, record, key) =>
            <a onClick={() => {
              this.onCsClick(record, key, 'pb');
            }}>{ text }</a>,
        }, {
          title: '人',
          dataIndex: 'pbrs',
          key: 'pbrs',
          width: 50,
          render: (text, record, key) =>
            <a onClick={() => {
              this.onCsClick(record, key, 'pb');
            }}>{ text }</a>,
        }],
      }, {
        title: '不批捕',
        children: [{
          title: '无逮捕必要',
          children: [{
            title: '件',
            dataIndex: 'wdbby',
            key: 'wdbby',
            width: 50,
            render: (text, record, key) =>
              <a onClick={() => {
                this.onCsClick(record, key, 'wdbby');
              }}>{ text }</a>,
          }, {
            title: '人',
            dataIndex: 'wdbbyrs',
            key: 'wdbbyrs',
            width: 50,
            render: (text, record, key) =>
              <a onClick={() => {
                this.onCsClick(record, key, 'wdbby');
              }}>{ text }</a>,
          }],
        }, {
          title: '存疑不捕',
          children: [{
            title: '件',
            dataIndex: 'cybb',
            key: 'cybb',
            width: 50,
            render: (text, record, key) =>
              <a onClick={() => {
                this.onCsClick(record, key, 'cybb');
              }}>{ text }</a>,
          }, {
            title: '人',
            dataIndex: 'cybbrs',
            key: 'cybbrs',
            width: 50,
            render: (text, record, key) =>
              <a onClick={() => {
                this.onCsClick(record, key, 'cybb');
              }}>{ text }</a>,
          }],
        }, {
          title: '不构罪',
          children: [{
            title: '件',
            dataIndex: 'bgz',
            key: 'bgz',
            width: 50,
            render: (text, record, key) =>
              <a onClick={() => {
                this.onCsClick(record, key, 'bgz');
              }}>{ text }</a>,
          }, {
            title: '人',
            dataIndex: 'bgzrs',
            key: 'bgzrs',
            width: 50,
            render: (text, record, key) =>
              <a onClick={() => {
                this.onCsClick(record, key, 'bgz');
              }}>{ text }</a>,
          }],
        }],
      }, {
        title: '侦查监督',
        children: [{
          title: '违法点',
          children: [{
            title: '个',
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
                this.onCsClick(record, 'smhf');
              }}>{ text }</a>,
          }],
        }, {
          title: '超期未回复',
          children: [{
            title: '件',
            dataIndex: 'cqwhf',
            key: 'cqwhf',
            width: 90,
            render: (text, record, key) =>
              <a onClick={() => {
                this.onCsClick(record, 'cqwhf');
              }}>{ text }</a>,
          }],
        }],
      },
    ];
    const ColumnsData = {title: '刑事办案智能辅助系统办案情况一览表（审查逮捕）', columns: scdb, scroll: 1220};
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
      type: '2'
    };

    return (
      <Main {...MainList} />
    );
  }
}
