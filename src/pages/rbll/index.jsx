import {connect} from 'dva';
import React, {Component} from 'react';
import Main from './components/Main';
import _ from 'lodash'
import moment from 'moment';
import 'moment/locale/zh-cn';

moment.locale('zh-cn');

@connect(({tjfx, loading}) => ({
  tjfx: tjfx,
  loading: loading.effects['tjfx/getBaqk'],
}))
export default class Home extends Component {
  constructor(props) {
    super(props);
    const myDate = new Date();
    const endDate = moment(myDate).format('YYYY-MM-DD');
    const startDate = moment().subtract(1, "days").format("YYYY-MM-DD");
    const {location: {query}} = this.props;

    this.state = {
      dwmc: _.isEmpty(props.location.query) ? '' : props.location.query.dwmc,
      dwbm: query && query.dwbm ? query.dwbm : '32',
      ysay: _.isEmpty(props.location.query) ? ['交通肇事罪'] : props.location.query.ysay,
      baqkList: {},    //办案情况列表
      searchValue: query && query.newsearchValue ? query.newsearchValue :
        {
          sasjStart: startDate,
          sasjEnd: endDate
        },
      rbTime: _.isEmpty(props.location.query) ? moment(new Date()).format('YYYY-MM-DD') : props.location.query.rbTime, //日报所选择的时间,默认当天
      page: _.isEmpty(props.location.query) ? 0 : props.location.query.page,
      size: _.isEmpty(props.location.query) ? 10 : props.location.query.size
    };
  }

  componentDidMount() {
    const {dispatch, location} = this.props;
    const query = location.query;
    const {dwbm} = this.state;
    dispatch({
      type: 'tjfx/getTree',
      payload: {
        dwbm: dwbm,
      },
    });
    if (!_.isEmpty(query)) {
      this.setState({
        dwbm: query.dwbm,
        ysay: query.ysay,
        dwmc: query.dwmc,
      });
      dispatch({
        type: 'tjfx/getBaqk',
        payload: {
          ...query.newsearchValue,
          dwbm: query.dwbm,
          ysay: query.ysay,
        },
      }).then(({data, success}) => {
        if (data && success) {
          this.setState({
            baqkList: data
          })
        }
      })
    } else {
      this.doQuery();
    }
  };

  doQuery = () => {
    const {dispatch} = this.props;
    const {dwbm, ysay, searchValue} = this.state;
    dispatch({
      type: 'tjfx/getBaqk',
      payload: {
        ...searchValue,
        dwbm, ysay,
      },
    }).then(({data, success}) => {
      if (data && success) {
        this.setState({
          baqkList: data
        })
      }
    });
  };

  //时间选择
  onTimeChange = (values) => {
    this.setState({searchValue: values}, () => {
      this.doQuery();
    });
  };

  // 树选择
  treeSelect = (values) => {
    const {dispatch} = this.props;
    const {ysay, searchValue} = this.state;
    const haveChild = values.children ? true : false;
    const newdwbm = haveChild ? values.value === '320000' ? '32' : values.value.substring(0, 4) : values.value;
    this.setState({
      dwmc: values.name,
      dwbm: newdwbm,
    });
    dispatch({
      type: 'tjfx/getBaqk',
      payload: {
        ...searchValue,
        dwbm: newdwbm,
        ysay,
      },
    }).then(({data, success}) => {
      if (data && success) {
        this.setState({
          baqkList: data
        })
      }
    });
  };

  //ysay选择
  ysaySelect = (value) => {
    this.setState({ysay: value});
    const {dispatch} = this.props;
    const {dwbm, searchValue} = this.state;
    dispatch({
      type: 'tjfx/getBaqk',
      payload: {
        ...searchValue,
        dwbm,
        ysay: value,
      },
    }).then(({data, success}) => {
      if (data && success) {
        this.setState({
          baqkList: data
        })
      }
    });
  };

  render() {
    const {dispatch, tjfx, loading, jcgloading, location: {query}} = this.props;
    const {treeList} = tjfx;
    const {dwmc, baqkList, rbTime, dwbm, ysay, searchValue, page, size} = this.state;
    const newstarttime = moment(searchValue.sasjStart).format('YYYY-MM-DD');
    const nowtime = moment(searchValue.sasjEnd).format('YYYY-MM-DD');
    const ColumnsData = (newstarttime === nowtime) ? {title: `${nowtime.substr(0, 4)}年${nowtime.substr(5, 2)}月${nowtime.substr(8, 2)}日办案日报`} :
      (newstarttime.substr(0, 4) === nowtime.substr(0, 4) && newstarttime.substr(5, 2) === nowtime.substr(5, 2)) ? {title: `${nowtime.substr(0, 4)}年${nowtime.substr(5, 2)}月${newstarttime.substr(8, 2)}日~${nowtime.substr(8, 2)}日办案日报`} :
        (newstarttime.substr(0, 4) === nowtime.substr(0, 4) && newstarttime.substr(5, 2) !== nowtime.substr(5, 2)) ? {title: `${nowtime.substr(0, 4)}年${newstarttime.substr(5, 2)}月${newstarttime.substr(8, 2)}日~${nowtime.substr(5, 2)}月${newstarttime.substr(8, 2)}日办案日报`} :
          {title: `${newstarttime.substr(0, 4)}年${newstarttime.substr(5, 2)}月${newstarttime.substr(8, 2)}日~${nowtime.substr(0, 4)}年${nowtime.substr(5, 2)}月${nowtime.substr(8, 2)}日办案日报`}

    const MainList = {
      dispatch,
      baqkList,
      rbTime,
      dwmc,
      dwbm,
      searchValue,
      page,
      size,
      field: query && query.field,
      ysay,
      loading: loading || jcgloading,
      treeList,
      ColumnsData,
      onTimeChange: this.onTimeChange,
      treeSelect: this.treeSelect,
      ysaySelect: this.ysaySelect,
      queryType: query && query.queryType,
      // visible: query && query.visible
    };

    return (
      <Main {...MainList} />
    );
  }
}
