import {connect} from 'dva';
import React, {Component} from 'react';
import moment from 'moment';
import {routerRedux} from 'dva/router';
import {CONTEXT} from '../../constant/index';
import Main from './components/Main';
import BjModal from './components/BjModal';
import WsModal from './components/WsModal';
import FkModal from './components/FkModal';
import ZjModal from './components/ZjModal';
import qs from 'qs';
import Session from 'utils/session';

@connect(({tjfx, loading, history}) => ({
  tjfx: tjfx,
  loading: loading.effects['portal/countByAjcx'],
}))
export default class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      haveChild: '',
      searchValue: '',
      dwmc: '',
      dwbm: '',
      ajcxList: [],
      pagination: {
        total: 0,
        current: 0,
        pageSize: 10,
      }
    };
  }

  componentDidMount() {
    const myDate = new Date();
    const endDate = moment(myDate).format('YYYY-MM-DD');
    const {dispatch, history} = this.props;
    const query = history.location.query;
    dispatch({
      type: 'tjfx/getTree',
      payload: {
        dwbm: '32',
      },
    });
    dispatch({
      type: 'tjfx/getCbrTree',
      payload: {
        dwbm: query.ajcxdwbm ? query.ajcxdwbm : '',
      }
    });

    const searchValue = query.searchValue ?
      {
        ...query.searchValue,
        ysay: [query.searchValue.ysay],
        ajlb: query.searchValue.ajlb === 'sp' ? ['SP'] : (query.searchValue.ajlb === 'nosp' ? ['ZJ', 'GS'] : query.searchValue.ajlb === 'all' ? ['ZJ', 'GS', 'SP'] : [query.searchValue.ajlb]),
        gh: query.cbrgh,
        bmsah: query.bmsah
      } :
      {
        ajlb: ['ZJ', 'GS', 'SP'],
        ysay: ['交通肇事罪'],
        sasjStart: '2017-10-24',
        sasjEnd: endDate,
        bjsjStart: '2017-11-01',
        bjsjEnd: endDate,
        gh: '',
        bmsah: ''
      };

    this.setState({
      dwmc: query.ajcxdwmc ? query.ajcxdwmc : '',
      dwbm: query.ajcxdwbm ? query.ajcxdwbm : '',
      searchValue: searchValue,
      haveChild: query.haveChild && query.dwbm === '320000'
    }, () => {
      this.getAjcxList()
    });
  }

  onBack = () => {
    const {dispatch, history} = this.props;
    const query = history.location.query;

    dispatch(
      routerRedux.push({
        pathname: `${CONTEXT}/${query.path}`,
        query: query,
      })
    );
  };

  // 搜索
  onSearch = (values) => {
    this.setState({
      searchValue: values,
    }, () => {
      this.getAjcxList()
    });
  };

  // 树选择
  treeSelect = (values) => {
    const {dispatch} = this.props;
    this.setState({
      dwmc: values.name,
      dwbm: values.value,
      haveChild: values.children ? true : false,
    }, () => {
      this.getAjcxList()
    });

    //承办人调用接口调整位置，可能会报错，待调整
    dispatch({
      type: 'tjfx/getCbrTree',
      payload: {
        dwbm: values.value
      }
    });
  };

  getAjcxList = (pageDate) => {
    const {dispatch} = this.props;
    const {searchValue, dwbm, haveChild} = this.state;

    dispatch({
      type: 'portal/countByAjcx',
      payload: {
        pagination: {
          page: pageDate ? pageDate.current - 1 > 0 ? pageDate.current - 1 : 0 : 0,
          size: pageDate ? pageDate.pageSize : 10,
        },
        query: {
          ...searchValue,
          gh: searchValue.gh.toString(),
          ysay: searchValue.ysay,
          dwbm: haveChild ? dwbm === '320000' ? '32' : dwbm.substring(0, 4) : dwbm,
        }
      },
    }).then(({list, success, gh, mc, page}) => {
      const data = list;
      if (data && success) {
        this.setState({
          ajcxList: data.list,
          dwmc: mc,
          // searchValue: {
          //   ...searchValue,
          //   gh: data.gh,
          // },
          pagination: {
            total: data.total ? data.total : 0,
            current: pageDate ? pageDate.current : 0,
            pageSize: pageDate ? pageDate.pageSize : 10,
          }
        })
      }
    });
  };


  render() {
    const {dispatch, tjfx, history, loading} = this.props;
    const {treeList, modelList, cbrTreeList} = tjfx;
    const {ajcxList, pagination, dwmc, searchValue} = this.state;
    const query = history.location.query;
    const ModelList = {dispatch, modelList};
    const session = Session.get();

    const scdb = [
      {
        title: '案件名称',
        dataIndex: 'ajmc',
        key: 'ajmc',
        width: 190,
        render: (text, record) => {
          const ajdwbm = record.dwbm;
          if (ajdwbm && record.bmsah) {
            const cbrdwbm = session.dwbm;
            const _cbrdwbm = cbrdwbm.slice(0, 4);
            const _cbrdwbm2 = cbrdwbm.slice(4, 6);
            const _ajdwbm = ajdwbm.slice(0, 4);

            if (cbrdwbm === '320000' ||
              (_cbrdwbm2 === '00' && _cbrdwbm === _ajdwbm && (Number(ajdwbm) >= Number(cbrdwbm))) ||
              (_cbrdwbm2 !== '00' && cbrdwbm === ajdwbm )
            ) {
              const _sp = record.bmsah.search('审判受');
              const _qs = record.bmsah.search('起诉');

              const stage = _qs > -1 ? 'gsjd' : 'zcjd';
              const time = record.bxt_bjsj ? moment(record.bxt_bjsj).isAfter('2019-04-20T00:00:00') : true;

              const cs = {
                bmsah: record.bmsah,
                stage: _sp > -1 ? 'SP' : _qs > -1 ? 'GS' : 'ZJ',
                ysay: record.ysay
              };

              const SpPath = `/cm/spjd/spdeal/${record.bmsah}/file?${qs.stringify(cs)}`;
              const beforePath = `/cm/${stage}/deal/${record.bmsah}?${qs.stringify(cs)}`;
              const afterPath = `/cm/currencydeal/${record.bmsah}/case?${qs.stringify(cs)}`;

              const path = _sp > -1 ? SpPath : record.ysay === '盗窃罪' || time ? afterPath : beforePath;
              return (<a target="_blank" href={path}>{text}</a>)

            } else {
              return (<span>{text}</span>)
            }
          }
        }
      }, {
        title: '单位',
        dataIndex: 'dwmc',
        key: 'dwmc',
        width: 100,
      }, {
        title: '部门受案号',
        dataIndex: 'bmsah',
        key: 'bmsah',
        width: 300,
      }, {
        title: '承办人',
        dataIndex: 'cbrxm',
        key: 'cbrxm',
        width: 70,
      }, {
        title: '统一系统状态',
        children: [{
          title: '办案阶段',
          dataIndex: 'bajd',
          key: 'bajd',
          width: 160,
        }, {
          title: '处理结果',
          dataIndex: 'cljg',
          key: 'cljg',
          width: 100,
        }],
      }, {
        title: '本系统状态',
        children: [
          {
            title: '识别',
            dataIndex: 'sb',
            key: 'sb',
            width: 70,
            render: (text, record) => {
              if (record.bmsah && text === '1') {
                return <span>已识别</span>
              } else if (record.bmsah && text === '0') {
                return <span>未识别</span>
              } else if (record.bmsah && text === '') {
                return <span>未识别</span>
              } else if (record.bmsah) {
                return <span>异常</span>
              }
            }
          },
          {
            title: '审查项规则比对',
            dataIndex: 'zt',
            key: 'zt',
            width: 70,
            render: (text, record) => {
              if (record.bmsah && text === '1') {
                return <span>已比对</span>
              } else if (record.bmsah && text === '0') {
                return <span>未比对</span>
              } else if (record.bmsah && text === '') {
                return <span>未比对</span>
              } else if (record.bmsah) {
                return <span>异常</span>
              }
            }
          }
        ],
      }, {
        title: '案卷数',
        children: [{
          title: '册',
          dataIndex: 'ajzs',
          key: 'ajzs',
          width: 70,
          render: (text, record) => (<span>{text ? text : ''}</span>),
        }],
      }, {
        title: '在线办案时长',
        children: [{
          title: '小时',
          dataIndex: 'basc',
          key: 'basc',
          width: 100,
          render: (text, record) => (<span>{text ? (text / 3600).toFixed(2) : ''}</span>),
        }],
      }, {
        title: '办案及建议',
        children: [{
          title: '笔记',
          children: [{
            title: '条',
            dataIndex: 'gzbj',
            key: 'gzbj',
            width: 70,
            render: (text, record) => (
              <BjModal title="办案笔记" record={record}  {...ModelList}>
                <a>{text ? text : ''}</a>
              </BjModal>),
          }],
        }, {
          title: '文书',
          children: [{
            title: '份',
            dataIndex: 'ws',
            key: 'ws',
            width: 70,
            render: (text, record) => (
              <WsModal title="文书制作" record={record} {...ModelList}>
                <a>{text ? text : ''}</a>
              </WsModal>),
          }],
        }, {
          title: '建议',
          children: [{
            title: '条',
            dataIndex: 'fk',
            key: 'fk',
            width: 70,
            render: (text, record) => (
              <FkModal title="意见建议" record={record} {...ModelList}>
                <a>{text ? text : ''}</a>
              </FkModal>),
          }],
        }],
      }, {
        title: '侦查监督',
        children: [{
          title: '违法瑕疵',
          children: [{
            title: '个',
            dataIndex: 'wfd',
            key: 'wfd',
            width: 70,
            render: (text, record) => (
              <ZjModal title="侦查监督/违法瑕疵" record={record} {...ModelList} sel="1">
                <a>{text ? text : ''}</a>
              </ZjModal>),
          }],
        }, {
          title: '书面纠正',
          children: [{
            title: '件',
            dataIndex: 'smjz',
            key: 'smjz',
            width: 70,
            render: (text, record) => (
              <ZjModal title="侦查监督/书面纠正" record={record} {...ModelList} sel="2">
                <a>{text ? text : ''}</a>
              </ZjModal>),
          }],
        }, {
          title: '检察建议',
          children: [{
            title: '件',
            dataIndex: 'jcjy',
            key: 'jcjy',
            width: 70,
            render: (text, record) => (
              <ZjModal title="侦查监督/检察建议" record={record} {...ModelList} sel="3">
                <a>{text ? text : ''}</a>
              </ZjModal>),
          }],
        }, {
          title: '补侦提纲',
          children: [{
            title: '份',
            dataIndex: 'bztg',
            key: 'bztg',
            width: 70,
            render: (text, record) => (
              <span>
                <ZjModal title="侦查监督/补侦提纲" record={record} {...ModelList} sel="9">
                  <a>
                  {text ? text : ''}
                  </a>
                </ZjModal>
              </span>
            ),
          }]
        }, {
          title: '口头纠正',
          children: [{
            title: '件',
            dataIndex: 'ktjz',
            key: 'ktjz',
            width: 70,
            render: (text, record) => (
              <span>
                <ZjModal title="侦查监督/口头纠正" record={record} {...ModelList} sel="4">
                  <a>
                  {text ? text : ''}
                  </a>
                </ZjModal>
              </span>
            ),
          }],
        }],
      }, {
        title: '审判监督',
        children: [{
          title: '违法瑕疵',
          children: [{
            title: '处',
            dataIndex: 'wfd_spjd',
            key: 'wfd_spjd',
            width: 70,
            render: (text, record) => (
              <ZjModal title="审判监督/违法瑕疵" record={record}  {...ModelList} sel={'5'}>
                <a>{text ? text : ''}</a>
              </ZjModal>),
          }]
        }, {
          title: '抗诉',
          children: [{
            title: '件',
            dataIndex: 'ks',
            key: 'ks',
            width: 70,
            render: (text, record) => (<span>{text ? text : ''}</span>),
          }]
        }, {
          title: '书面纠正',
          children: [{
            title: '份',
            dataIndex: 'smjz_spjd',
            key: 'smjz_spjd',
            width: 70,
            render: (text, record) => (
              <ZjModal title="审判监督/书面纠正" record={record}  {...ModelList} sel={'6'}>
                <a>{text ? text : ''}</a>
              </ZjModal>),
          }]
        }, {
          title: '检察建议',
          children: [{
            title: '份',
            dataIndex: 'jcjy_spjd',
            key: 'jcjy_spjd',
            width: 70,
            render: (text, record) => (
              <ZjModal title="审判监督/检察建议" record={record} {...ModelList} sel="7">
                <a>{text ? text : ''}</a>
              </ZjModal>),
          }]
        }, {
          title: '口头纠正',
          children: [{
            title: '次',
            dataIndex: 'ktjz_spjd',
            key: 'ktjz_spjd',
            width: 70,
            render: (text, record) => (
              <span>
                <ZjModal title="审判监督/口头纠正" record={record} {...ModelList} sel="8">
                  <a>
                  {text ? text : ''}
                  </a>
                </ZjModal>
              </span>),
          }]
        }]
      },
    ];

    const ColumnsData = {title: '刑事办案智能辅助系统案件查询表', columns: scdb, scroll: 2200};
    const MainList = {
      dispatch,
      list: ajcxList,
      pagination,
      dwmc,
      loading,
      treeList,
      ColumnsData,
      onBack: this.onBack,
      treeSelect: this.treeSelect,
      onSearch: this.onSearch,
      getAjcxList: this.getAjcxList,
      cbrTreeList,
      searchValue,
      back: query.ajcxdwmc ? true : false,
    };

    return (
      <Main {...MainList} />
    );
  }
}
