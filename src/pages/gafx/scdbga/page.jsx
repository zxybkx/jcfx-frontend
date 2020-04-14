import {connect} from 'dva';
import React, {Component} from 'react';
import moment from 'moment';
import {routerRedux} from 'dva/router';
import {CONTEXT} from '../../../constant';
import Main from '../../../components/GAFX/GaMain';
import BjModal from '../../../components/GAFX/BjModal';
import WsModal from '../../../components/GAFX/WsModal';
import FkModal from '../../../components/GAFX/FkModal';
import ZjModal from '../../../components/GAFX/ZjModal';
import qs from 'qs';

@connect(({tjfx, loading, history}) => ({
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
    dispatch({
      type: 'tjfx/getCbrTree',
      payload: {
        dwbm: query.dwbm ? query.dwbm : '',
      }
    });

    const searchValue = {
      sasj_startDate: query.sasj_startDate ? query.sasj_startDate : sasj_startDate,
      sasj_endDate: query.sasj_endDate ? query.sasj_endDate : sasj_endDate,
      bjsj_startDate: '',
      bjsj_endDate: '',
      ysay: query.ysay && query.ysay != '交通肇事罪' ? query.ysay : ['交通肇事罪'],
      gh: query.gh ? query.gh : '',
      ajmc: '',
      bmsah: '',
    };
    this.setState({
      back: query.dwmc ? true : false,
      jcgmc: query.jcgmc ? query.jcgmc : '',
      dwbm: query.dwbm ? query.dwbm : '',
      searchValue: searchValue,
      by: query.by ? query.by : '1'
    });
    dispatch({
      type: 'tjfx/getByJcgga',
      payload: {
        query: {
          ajlb_bm: '0201',
          ...searchValue,
          dwbm: query.dwbm ? query.dwbm : '',
          cs: query.cs ? query.cs : '',
          by: query.by ? query.by : '1'
        },
      },
    });
  }


  constructor(props) {
    super(props);
    this.state = {
      back: false,
      haveChild: '',
      searchValue: '',
      jcgmc: props.tjfx.jcgmc,
      loading: true,
      dwbm: '',
    };
  }

  componentWillReceiveProps(nextProps) {
    if (!this.state.jcgmc) {
      this.setState({
        jcgmc: nextProps.tjfx.jcgmc,
        loading: nextProps.loading,
      })
    } else {
      this.setState({
        loading: nextProps.loading,
      })
    }
  }

  onBack = () => {
    const {dispatch, history} = this.props;
    const query = history.location.query;
    dispatch(
      routerRedux.push({
        pathname: `${CONTEXT}/bahz/scdb`,
        query: query,
      })
    );
  };

  // 搜索
  onSearch = (values) => {
    const {dispatch} = this.props;
    const {dwbm, by} = this.state;
    this.setState({
      searchValue: values,
    });
    dispatch({
      type: 'tjfx/getByJcgga',
      payload: {
        query: {
          ajlb_bm: '0201',
          ...values,
          dwbm: dwbm,
          cs: '',
          by: by
        },
      },
    });

  };

  // 树选择
  treeSelect = (values) => {
    const {dispatch} = this.props;
    const {searchValue} = this.state;
    this.setState({
      jcgmc: values.name,
      dwbm: values.value,
      by: values.children ? '0' : '1',
    });
    dispatch({
      type: 'tjfx/getByJcgga',
      payload: {
        query: {
          ajlb_bm: '0201',
          ...searchValue,
          dwbm: values.value,
          gh: '',
          cs: '',
          by: values.children ? '0' : '1',
        },
      },
    });
  };


  render() {
    const {dispatch, tjfx} = this.props;
    const {list, treeList, modelList, pagination, cbrTreeList, gh} = tjfx;
    const {loading, jcgmc, back, searchValue} = this.state;
    const ModelList = {
      dispatch: dispatch,
      modelList: modelList
    };
    const scdb = [
      {
        title: '案件名称',
        dataIndex: 'ajmc',
        key: 'ajmc',
        width: 160,
        render: (text, record) => {
          return (<a target="_blank" href={`/cm/zcjd/deal/${record.bmsah}`}>{text}</a>)
        }
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
          width: 100,
        }, {
          title: '处理结果',
          dataIndex: 'cljg',
          key: 'cljg',
          width: 100,
        }],
      }, {
        title: '本系统状态',
        children: [{
          title: '抽取',
          dataIndex: 'cq',
          key: 'cq',
          width: 100,
        }, {
          title: '识别',
          dataIndex: 'sb',
          key: 'sb',
          width: 70,
        }, {
          title: '状态',
          dataIndex: 'zt',
          key: 'zt',
          width: 70,
        }],
      }, {
        title: '案卷数',
        children: [{
          title: '册',
          dataIndex: 'ajzs',
          key: 'ajzs',
          width: 70,
        }],
      }, {
        title: '办案周期',
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
            } else if (record.ajmc) {
              return (<span>—</span>)
            } else {
              return (<span></span>)
            }
          }
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
              <span>
                <BjModal title="工作笔记二级表" record={record}  {...ModelList} sel={'0'}>
                  <a>{text}</a>
                </BjModal>
              </span>),
          }],
          // }, {
          //   title: '文书',
          //   children: [{
          //     title: '份',
          //     dataIndex: 'ws',
          //     key: 'ws',
          //     width: 70,
          //     render: (text, record) => (
          //       <span>
          //         <WsModal  title="文书制作二级表"  record={record} {...ModelList}>
          //           <a>{text}</a>
          //         </WsModal>
          //       </span>),
          //   }],
        }, {
          title: '建议',
          children: [{
            title: '条',
            dataIndex: 'fk',
            key: 'fk',
            width: 70,
            render: (text, record) => (
              <span>
                <FkModal title="反馈及回复二级表" record={record} {...ModelList}>
                  <a>{text}</a>
                </FkModal>
              </span>),
          }],
        }, {
          title: '回复',
          children: [{
            title: '条',
            dataIndex: 'hf',
            key: 'hf',
            width: 70,
            // render: (text, record) => (
            //   <span>
            //     <FkModal  title="反馈及回复二级表"  record={record} {...ModelList}>
            //       <a>{text}</a>
            //     </FkModal>
            //   </span>),
          }],
        }],
      }, {
        title: '处理情况',
        children: [{
          title: '违法点',
          children: [{
            title: '个',
            dataIndex: 'wfd',
            key: 'wfd',
            width: 70,
            render: (text, record) => (
              <span>
                <ZjModal title="侦查监督及回复二级表" record={record} {...ModelList} sel="1">
                  <a>{text}</a>
                </ZjModal>
              </span>),
          }],
        }, {
          title: '书面纠正',
          children: [{
            title: '件',
            dataIndex: 'smjz',
            key: 'smjz',
            width: 70,
            render: (text, record) => (
              <span>
                <ZjModal title="侦查监督及回复二级表" record={record} {...ModelList} sel="2">
                  <a>{text}</a>
                </ZjModal>
              </span>),
          }],
        }, {
          title: '检察建议',
          children: [{
            title: '件',
            dataIndex: 'jcjy',
            key: 'jcjy',
            width: 70,
            render: (text, record) => (
              <span>
                <ZjModal title="侦查监督及回复二级表" record={record} {...ModelList} sel="3">
                  <a>{text}</a>
                </ZjModal>
              </span>),
          }],
        }, {
          title: '口头纠正',
          children: [{
            title: '件',
            dataIndex: 'ktjz',
            key: 'ktjz',
            width: 70,
            render: (text, record) => (
              <span>
                <ZjModal title="侦查监督及回复二级表" record={record} {...ModelList} sel="4">
                  <a>{text}</a>
                </ZjModal>
              </span>),
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
            render: (text, record) => (
              <span>
                <ZjModal title="侦查监督及回复二级表" record={record} {...ModelList}>
                  <a>{text}</a>
                </ZjModal>
              </span>),
          }],
        }, {
          title: '超期未回复',
          children: [{
            title: '件',
            dataIndex: 'cqwhf',
            key: 'cqwhf',
            width: 90,
            render: (text, record) => (
              <span>
                <ZjModal title="侦查监督及回复二级表" record={record} {...ModelList}>
                  <a>{text}</a>
                </ZjModal>
              </span>),
          }],
        }],
      },
    ];
    const ColumnsData = {title: '刑事办案智能辅助系统案件查询表（审查逮捕）', columns: scdb, scroll: 1300};
    const MainList = {
      dispatch,
      list,
      pagination,
      jcgmc,
      loading,
      treeList,
      ColumnsData,
      onBack: this.onBack,
      treeSelect: this.treeSelect,
      onSearch: this.onSearch,
      cbrTreeList,
      searchValue,
      gh,
      back
    };

    return (
      <Main {...MainList} />
    );
  }
}
