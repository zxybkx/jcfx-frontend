import {connect} from 'dva';
import React, {Component} from 'react';
import {routerRedux} from 'dva/router';
import {hasClid} from "../../services/tjfx";
import Main from './components/Main';
import Modal from './components/Modal';
import moment from 'moment';

@connect(({tjfx, portal, loading}) => ({
  tjfx: tjfx,
  loading: loading.effects['portal/countByBajd'],
}))
export default class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      haveChild: '',
      searchValue: {},
      dwmc: '',
      dwbm: '',
      bajdList: [],
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
    if (query.searchValue) {
      const searchValue = query.searchValue;
      this.setState({
        dwmc: query.dwmc,
        searchValue: searchValue
      });
      this.isChild(query.haveChild, query.dwbm, searchValue)
    } else {
      const searchValue = {
        ajlb: 'all',
        sasjStart: '2017-10-24',
        sasjEnd: endDate,
        bjsjStart: '2017-11-01',
        bjsjEnd: endDate,
        ysay: '交通肇事罪'
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
        if (a[4] === '0' && a[5] === '0' && key !== 1) {
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
      haveChild: haveChild ? true : false,
    });
    const {dispatch} = this.props;
    const newdwbm = haveChild ? dwbm === '320000' ? '32' : dwbm.substring(0, 4) : dwbm;
    const payload = {
      dwbm: newdwbm,
      ...searchValue,
      ysay: [searchValue.ysay],
      ajlb: searchValue.ajlb === 'all' ? ['ZJ', 'GS'] : [searchValue.ajlb]
    };
    dispatch({
      type: 'portal/countByBajd',
      payload: payload,
    }).then(({data, success}) => {
      if (data && success) {
        this.setState({
          bajdList: data,
        })
      }
    });
  };

  render() {
    const {dispatch, tjfx, loading} = this.props;
    const {treeList} = tjfx;
    const {bajdList, haveChild, dwmc, dwbm, searchValue} = this.state;
    const ModelList = {
      dispatch, dwbm, searchValue, dwmc, haveChild,
    };
    const hz = [
      {
        title: haveChild ? '单位' : '承办人',
        dataIndex: haveChild ? 'dwmc' : 'cbrxm',
        key: 'dwmc',
        width: 100,
        render: (text, record, key) =>
          <a onClick={() => {
            this.onClick(record, key);
          }}>{ text === '江苏省人民检察院' ? '江苏省院' : text }</a>,
      },
      {
        title: '侦查监督',
        children: [{
          title: '违法瑕疵',
          children: [{
            title: '处',
            dataIndex: 'wfd',
            key: 'wfd',
            width: 70,
            render: (text, record) => (
              <Modal title="二级表" record={record}  {...ModelList} cs={'wfd'}>
                <a>{text ? text : ''}</a>
              </Modal>),
          }]
        }, {
          title: '书面纠正',
          children: [{
            title: '份',
            dataIndex: 'smjz',
            key: 'smjz',
            width: 70,
            render: (text, record) => (
              <Modal title="二级表" record={record}  {...ModelList} cs={'smjz'}>
                <a>{text ? text : ''}</a>
              </Modal>),
          }]
        }, {
          title: '检察建议',
          children: [{
            title: '份',
            dataIndex: 'jcjy',
            key: 'jcjy',
            width: 70,
            render: (text, record) => (
              <Modal title="二级表" record={record}  {...ModelList} cs={'jcjy'}>
                <a>{text ? text : ''}</a>
              </Modal>),
          }]
        }, {
          title: '补侦提纲',
          children: [{
            title: '份',
            dataIndex: 'bztg',
            key: 'bztg',
            width: 70,
            render: (text, record) => (
              <Modal title="二级表" record={record}  {...ModelList} cs={'bztg'}>
                <a>{text ? text : ''}</a>
              </Modal>),
          }]
        }, {
          title: '口头纠正',
          children: [{
            title: '次',
            dataIndex: 'ktjz',
            key: 'ktjz',
            width: 70,
            render: (text, record) => (
              <Modal title="二级表" record={record}  {...ModelList} cs={'ktjz'}>
                <a>{text ? text : ''}</a>
              </Modal>),
          }]
        }]
      },
      {
        title: '审判监督',
        children: [{
          title: '违法瑕疵',
          children: [{
            title: '处',
            dataIndex: 'wfd_spjd',
            key: 'wfd_spjd',
            width: 70,
            render: (text, record) => (
              <Modal title="二级表" record={record}  {...ModelList} cs={'wfd_spjd'}>
                <a>{text ? text : ''}</a>
              </Modal>),
          }]
        }, {
          title: '抗诉',
          children: [{
            title: '件',
            dataIndex: 'ks',
            key: 'ks',
            width: 70,
            render: (text, record) => (
              <Modal title="二级表" record={record}  {...ModelList} cs={'ks'}>
                <a>{text ? text : ''}</a>
              </Modal>),
          }]
        }, {
          title: '书面纠正',
          children: [{
            title: '份',
            dataIndex: 'smjz_spjd',
            key: 'smjz_spjd',
            width: 70,
            render: (text, record) => (
              <Modal title="二级表" record={record}  {...ModelList} cs={'smjz_spjd'}>
                <a>{text ? text : ''}</a>
              </Modal>),
          }]
        }, {
          title: '检察建议',
          children: [{
            title: '份',
            dataIndex: 'jcjy_spjd',
            key: 'jcjy_spjd',
            width: 70,
            render: (text, record) => (
              <Modal title="二级表" record={record}  {...ModelList} cs={'jcjy_spjd'}>
                <a>{text ? text : ''}</a>
              </Modal>),
          }]
        }, {
          title: '口头纠正',
          children: [{
            title: '次',
            dataIndex: 'ktjz_spjd',
            key: 'ktjz_spjd',
            width: 70,
            render: (text, record) => (
              <Modal title="二级表" record={record}  {...ModelList} cs={'ktjz_spjd'}>
                <a>{text ? text : ''}</a>
              </Modal>),
          }]
        }]
      },
      {
        title: '移诉监督',
        children: [{
          title: '撤回',
          children: [{
            title: '件',
            dataIndex: 'ch',
            key: 'ch',
            width: 70,
            render: (text, record) => (<span>{text ? text : ''}</span>),
          }]
        }, {
          title: '退查未重报',
          children: [{
            title: '件',
            dataIndex: 'tcwcb',
            key: 'tcwcb',
            width: 90,
            render: (text, record) => (<span>{text ? text : ''}</span>),
          }]
        }]
      },
      {
        title: '追诉追漏',
        children: [{
          title: '立案监督',
          children: [{
            title: '人',
            dataIndex: 'lajddx',
            key: 'lajddx',
            width: 70,
            render: (text, record) => (<span>{text ? text : ''}</span>),
          }]
        }, {
          title: '纠正漏捕',
          children: [{
            title: '人',
            dataIndex: 'jzlbdx',
            key: 'jzlbdx',
            width: 70,
            render: (text, record) => (<span>{text ? text : ''}</span>),
          }]
        }, {
          title: '纠正漏犯',
          children: [{
            title: '人',
            dataIndex: 'bcysqstaf',
            key: 'bcysqstaf',
            width: 70,
            render: (text, record) => (<span>{text ? text : ''}</span>),
          }]
        }, {
          title: '纠正漏罪',
          children: [{
            title: '人',
            dataIndex: 'jzylzx',
            key: 'jzylzx',
            width: 70,
            render: (text, record) => (<span>{text ? text : ''}</span>),
          }]
        }]
      },
    ];
    const ColumnsData = {title: '刑事办案智能辅助系统办案监督表', columns: hz, scroll: 1240};
    const MainList = {
      dispatch,
      searchValue,
      list: bajdList,
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
