import {connect} from 'dva';
import React, {Component} from 'react';
import {routerRedux} from 'dva/router';
import {hasClid} from "../../services/tjfx";
import Main from './components/Main';
import Modal from './components/Modal';
import moment from 'moment';

@connect(({tjfx, portal, loading}) => ({
  tjfx: tjfx,
  loading: loading.effects['portal/countByBahz'],
  jcgloading: loading.effects['portal/countByBahzJcg'],
}))
export default class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      haveChild: '',
      searchValue: '',
      dwmc: '',
      dwbm: '',
      hzList: [],
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
        if (a[4] === '0' && a[5] === '0') {
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
    const newdwbm = haveChild ? dwbm === '320000' ? '32' : dwbm.substring(0, 4) : dwbm;   //新接口参数

    const payload = {
      dwbm:newdwbm,
      ...searchValue,
      ysay: [searchValue.ysay],
      ajlb: searchValue.ajlb === 'all' ? ['ZJ', 'GS'] : [searchValue.ajlb]
    };

    dispatch({
      type: 'portal/countByBahz',
      payload: payload,
    }).then(({data, success}) => {
      if (data && success) {
        this.setState({
          hzList: data,
        })
      }
    });
  };

  render() {
    const {dispatch, tjfx, loading, jcgloading} = this.props;
    const {treeList} = tjfx;
    const {hzList, haveChild, dwmc, dwbm, searchValue} = this.state;
    const ModelList = {dispatch, dwbm, searchValue, dwmc, haveChild};
    const hz = [
      {
        title: haveChild ? '单位' : '承办人',
        dataIndex: haveChild ? 'dwmc' : 'mc',
        key: 'dwmc',
        width: 100,
        render: (text, record, key) =>
          <a onClick={() => {
            this.onClick(record, key);
          }}>{ text === '江苏省人民检察院' ? '江苏省院' : text }</a>,
      },
      {
        title: '受理',
        children: [{
          title: '审查逮捕',
          children: [{
            title: '件',
            dataIndex: 'slScdb',
            key: 'slScdb',
            width: 70,
            render: (text, record) => (
              <Modal title="二级表" record={record}  {...ModelList} cs={'slScdb'}>
                <a>{text ? text : ''}</a>
              </Modal>),
          }]
        }, {
          title: '审查起诉',
          children: [{
            title: '件',
            dataIndex: 'slScqs',
            key: 'slScqs',
            width: 70,
            render: (text, record) => (
              <Modal title="二级表" record={record}  {...ModelList} cs={'slScqs'}>
                <a>{text ? text : ''}</a>
              </Modal>),
          }]
        }, {
          title: '合计',
          children: [{
            title: '件',
            dataIndex: 'slAll',
            key: 'slAll',
            width: 70,
            render: (text, record) =>
              (<Modal title="二级表" record={record}  {...ModelList} cs={'slAll'}>
                <a>{text ? text : ''}</a>
              </Modal>),
              // (<span>{text ? text : ''}</span>),
          }]
        }]
      },
      {
        title: '办结',
        children: [{
          title: '审查逮捕',
          children: [{
            title: '件',
            dataIndex: 'bjScdb',
            key: 'bjScdb',
            width: 70,
            render: (text, record) => (
              <Modal title="二级表" record={record}  {...ModelList} cs={'bjScdb'}>
                <a>{text ? text : ''}</a>
              </Modal>),
          }]
        }, {
          title: '审查起诉',
          children: [{
            title: '件',
            dataIndex: 'bjScqs',
            key: 'bjScqs',
            width: 70,
            render: (text, record) => (
              <Modal title="二级表" record={record}  {...ModelList} cs={'bjScqs'}>
                <a>{text ? text : ''}</a>
              </Modal>),
          }]
        }, {
          title: '合计',
          children: [{
            title: '件',
            dataIndex: 'bjAll',
            key: 'bjAll',
            width: 70,
            render: (text, record) =>
              (<Modal title="二级表" record={record}  {...ModelList} cs={'bjAll'}>
                <a>{text ? text : ''}</a>
              </Modal>),
          }]
        }]
      },
      {
        title: '处理',
        children: [{
          title: '批捕',
          children: [{
            title: '人',
            dataIndex: 'pb',
            key: 'pb',
            width: 70,
            render: (text, record) => (
              <Modal title="二级表" record={record}  {...ModelList} cs={'pb'}>
                <a>{text ? text : ''}</a>
              </Modal>),
          }]
        }, {
          title: '起诉',
          children: [{
            title: '人',
            dataIndex: 'qs',
            key: 'qs',
            width: 70,
            render: (text, record) => (
              <Modal title="二级表" record={record}  {...ModelList} cs={'qs'}>
                <a>{text ? text : ''}</a>
              </Modal>),
          }]
        }]
      },
      {
        title: '不批捕',
        children: [{
          title: '无逮捕必要',
          children: [{
            title: '人',
            dataIndex: 'wdbby',
            key: 'wdbby',
            width: 90,
            render: (text, record) => (
              <Modal title="二级表" record={record}  {...ModelList} cs={'wdbby'}>
                <a>{text ? text : ''}</a>
              </Modal>),
          }]
        }, {
          title: '存疑不捕',
          children: [{
            title: '人',
            dataIndex: 'cybb',
            key: 'cybb',
            width: 70,
            render: (text, record) => (
              <Modal title="二级表" record={record}  {...ModelList} cs={'cybb'}>
                <a>{text ? text : ''}</a>
              </Modal>),
          }]
        }, {
          title: '不构罪',
          children: [{
            title: '人',
            dataIndex: 'bgz',
            key: 'bgz',
            width: 70,
            render: (text, record) => (
              <Modal title="二级表" record={record}  {...ModelList} cs={'bgz'}>
                <a>{text ? text : ''}</a>
              </Modal>),
          }]
        }]
      },
      {
        title: '不起诉',
        children: [
          {
            title: '相对不诉',
            children: [{
              title: '人',
              dataIndex: 'xdbs',
              key: 'xdbs',
              width: 70,
              render: (text, record) => (
                <Modal title="二级表" record={record}  {...ModelList} cs={'xdbs'}>
                  <a>{text ? text : ''}</a>
                </Modal>),
            }]
          },
          {
            title: '存疑不诉',
            children: [{
              title: '人',
              dataIndex: 'cybs',
              key: 'cybs',
              width: 70,
              render: (text, record) => (
                <Modal title="二级表" record={record}  {...ModelList} cs={'cybs'}>
                  <a>{text ? text : ''}</a>
                </Modal>),
            }]
          },
          {
            title: '绝对不诉',
            children: [{
              title: '人',
              dataIndex: 'jdbs',
              key: 'jdbs',
              width: 70,
              render: (text, record) => (
                <Modal title="二级表" record={record}  {...ModelList} cs={'jdbs'}>
                  <a>{text ? text : ''}</a>
                </Modal>),
            }]
          },
        ]
      },
      {
        title: '判决',
        children: [{
          title: '有罪判决',
          children: [{
            title: '件',
            dataIndex: 'yzpj',
            key: 'yzpj',
            width: 70,
            render: (text, record) => (
              <Modal title="二级表" record={record}  {...ModelList} cs={'yzpj'}>
                <a>{text ? text : ''}</a>
              </Modal>),
          }]
        }, {
          title: '无罪判决',
          children: [{
            title: '件',
            dataIndex: 'wzpj',
            key: 'wzpj',
            width: 70,
            render: (text, record) => (
              <Modal title="二级表" record={record}  {...ModelList} cs={'wzpj'}>
                <a>{text ? text : ''}</a>
              </Modal>),
          }]
        }, {
          title: '诉判不一',
          children: [{
            title: '件',
            dataIndex: 'spby',
            key: 'spby',
            width: 70,
            render: (text, record) => (
              <Modal title="二级表" record={record}  {...ModelList} cs={'spby'}>
                <a>{text ? text : ''}</a>
              </Modal>),
          }]
        }]
      },
      {
        title: '在线办案时长',
        children: [{
          title: '审查逮捕',
          children: [{
            title: '小时',
            dataIndex: 'bascScdb',
            key: 'bascScdb',
            width: 70,
            // render: (text, record) => (<span>{(text/3600).toFixed(2)}</span>),
            render: (text, record) => (<span>{text ? (text/3600).toFixed(2) : ''}</span>),
          }]
        }, {
          title: '审查起诉',
          children: [{
            title: '小时',
            dataIndex: 'bascSCQS',
            key: 'bascSCQS',
            width: 70,
            render: (text, record) => (<span>{text ? (text/3600).toFixed(2) : ''}</span>),
          }]
        }]
      },
    ];
    const ColumnsData = {title: '刑事办案智能辅助系统办案汇总表', columns: hz, scroll: 1450};
    const MainList = {
      dispatch,
      list: hzList,
      searchValue,
      dwmc,
      loading: loading||jcgloading,
      treeList,
      haveChild,
      ColumnsData,
      treeSelect: this.treeSelect,
      onSearch: this.onSearch,
    };

    return (
      <Main {...MainList} />
    );
  }
}
