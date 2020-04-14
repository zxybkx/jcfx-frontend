import {connect} from 'dva';
import React, {Component} from 'react';
import Main from './components/Main';
import moment from 'moment';

@connect(({tjfx, portal, loading}) => ({
  tjfx: tjfx,
  loading: loading.effects['portal/countByzzz'],
}))

export default class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      haveChild: '',
      dwmc: '',
      dwbm: '',
      hzList: [],
      total: 0,
      searchValue: {
        startTime: moment('2017-11-12'),
        endTime: moment(new Date()),
        zm: ['盗窃罪']
      }
    };
  }

  componentDidMount() {
    const {searchValue} = this.state;
    const {dispatch, history} = this.props;
    const query = history.location.query;
    // dispatch({
    //   type: 'tjfx/getTree',
    //   payload: {
    //     dwbm: '32',
    //   },
    // });

    if (query.searchValue) {
      const searchValue = query.searchValue;
      this.setState({
        dwmc: query.dwmc,
        searchValue: searchValue
      });
      this.handSearch(searchValue)
    } else {
      this.handSearch(searchValue)
    }
  }

  // 搜索
  onSearch = (values) => {
    this.setState({
      searchValue: values,
    }, () => {
      this.handSearch(values);
    });
  };

  // 树选择
  // treeSelect = (values) => {
  //   this.setState({
  //     dwmc: values.name,
  //   });
  //   const {searchValue} = this.state;
  //   this.handSearch(values.children, values.value, searchValue)
  // };

  handSearch = (searchValue) => {
    const {dispatch} = this.props;
    dispatch({
      type: 'portal/countByzzz',
      payload: {
        pageSize: {
          page: 0,
          size: 10,
        },
        searchValue: {
          ...searchValue,
          dwbm: "",
          startTime: searchValue.startTime ? `${searchValue.startTime.format('YYYY-MM-DD')}T00:00:00` : '',
          endTime: searchValue.endTime ? `${searchValue.endTime.format('YYYY-MM-DD')}T00:00:00` : '',
        },
      },
    }).then(({data, success, page}) => {
      if (data && success) {
        this.setState({
          hzList: data,
          total: page.total,
        })
      }
    });
  };

  onTableChange = (page) => {
    const {dispatch} = this.props;
    const {searchValue} = this.state;
    dispatch({
      type: 'portal/countByzzz',
      payload: {
        pageSize: {
          page: page.current - 1 > 0 ? page.current - 1 : 0,
          size: page.pageSize,
        },
        searchValue: {
          ...searchValue,
          dwbm: "",
          startTime: searchValue.startTime ? `${searchValue.startTime.format('YYYY-MM-DD')}T00:00:00` : '',
          endTime: searchValue.endTime ? `${searchValue.endTime.format('YYYY-MM-DD')}T00:00:00` : '',
        },
      },
    }).then(({data, success, page}) => {
      if (success) {
        this.setState({
          hzList: data,
          total: page.total,
        })
      }
    })
  };

  render() {
    const {dispatch, tjfx, loading, jcgloading} = this.props;
    const {treeList, xm} = tjfx;
    const {hzList, dwmc, dwbm, searchValue, total} = this.state;
    const ModelList = {dispatch, dwbm, searchValue, xm, dwmc};
    const hz = [
      {
        title: '单位名称',
        dataIndex: 'dwmc',
        key: 'dwmc',
        width: 100,
      },
      {
        title: '移送案由',
        dataIndex: 'ysay',
        key: 'ysay',
        width: 100,
      },
      {
        title: '部门受案号',
        dataIndex: 'bmsah',
        key: 'bmsah',
        width: 100,
      },
      {
        title: '案件名称',
        dataIndex: 'ajmc',
        key: 'ajmc',
        width: 100,
      },
      {
        title: '创建时间',
        dataIndex: 'createdDate',
        key: 'createdDate',
        width: 100,
        render: (text) => {
          return <span>{text && text.split(' ')[0]}</span>
        }
      },
      {
        title: '更新时间',
        dataIndex: 'lastModifiedDate',
        key: 'lastModifiedDate',
        width: 100,
        render: (text) => {
          return <span>{text && text.split(' ')[0]}</span>
        }
      },
    ];
    const ColumnsData = {title: '案卡统计查询表', columns: hz, scroll: 1450};
    const MainList = {
      dispatch,
      list: hzList,
      searchValue,
      dwmc,
      xm,
      pagination: {
        total
      },
      loading: loading,
      treeList,
      ColumnsData,
      treeSelect: this.treeSelect,
      onSearch: this.onSearch,
      onTableChange: this.onTableChange,
    };
    return (
      <Main {...MainList} />
    );
  }
}
