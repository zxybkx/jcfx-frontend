import React, {Component} from 'react';
import {Modal, Form} from 'antd';
import Table from '../../../components/TJFX/Table';
import {routerRedux} from 'dva/router';
import {CONTEXT} from '../../../constant';

class UserEditModal extends Component {

  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      modelList: [],
      pagination: {}
    };
  }

  showModelHandler = (e) => {
    this.setState({
      visible: true,
    });
    if (e) e.stopPropagation();
    this.onChange();
  };

  onChange = (page) => {
    const {dispatch, record, searchValue, cs, dwbm, haveChild} = this.props;
    const newdwbm = haveChild && dwbm === '320000' ? record.dwbm.substring(0, 4) : record.dwbm;  //此处后台有处理dwbm，前端未再做处理
    dispatch({
      type: 'portal/countByBajdDetail',
      payload: {
        pagination: {
          page: page ? page.current - 1 > 0 ? page.current - 1 : 0 : 0,
          size: page ? page.pageSize : 10,
        },
        query: {
          ...searchValue,
          ysay: [searchValue.ysay],
          ajlb: searchValue.ajlb === 'all' ? ['ZJ', 'GS'] : [searchValue.ajlb],
          dwbm: newdwbm,
          cbrgh: record.cbrgh,
          field: cs
        }
      },
    }).then(({data, success}) => {
      if (data && success) {
        this.setState({
          modelList: data.list,
          pagination: {
            total: data.total,
            current: page ? page.current : 0,
            pageSize: page ? page.pageSize : 10,
          }
        })
      }
    });
  };

  hideModelHandler = () => {
    this.setState({
      visible: false,
    });
  };

  okHandler = () => {
    this.hideModelHandler();
  };

  onClick = (record) => {
    const {dispatch, searchValue, dwbm, dwmc, haveChild} = this.props;
    dispatch(
      routerRedux.push({
        pathname: `${CONTEXT}/ajcx`,
        query: {
          path: 'bajd', dwbm, dwmc,   //返回时使用
          haveChild, searchValue,     //共用
          bmsah: record.bmsah,
          cbrgh: record.cbrgh,
          ajcxdwbm: record.dwbm,
          ajcxdwmc: record.dwmc,
        },
      })
    );
  };

  render() {
    const {children} = this.props;
    const {modelList, pagination} = this.state;
    const columns = [
      {
        title: '序号',
        key: 'xh',
        width: 50,
        render: (text, record, index) => {
          if (record.dwbm) {
            return (<span>{index + 1}</span>)
          }
        }
      }, {
        title: '单位编码',
        dataIndex: 'dwbm',
        key: 'dwbm',
        width: 80,
      }, {
        title: '部门受案号',
        dataIndex: 'bmsah',
        key: 'bmsah',
        width: 200,
      }, {
        title: '案件名称',
        dataIndex: 'ajmc',
        key: 'ajmc',
        width: 140,
        render: (text, record) => {
          return (
            <a onClick={() => this.onClick(record)}>{text}</a>
          )
        },
      }, {
        title: '违法瑕疵',
        dataIndex: 'wfd',
        key: 'wfd',
        width: 100,
      }, {
        title: '受案日期',
        dataIndex: 'sasj',
        key: 'sasj',
        width: 100,
        render: (text, record) => (
          <span>{text && text.split('T')[0]}</span>
        ),
      }, {
        title: '办结日期',
        dataIndex: 'bjsj',
        key: 'bjsj',
        width: 100,
        render: (text, record) => (
          <span>{text && text.split('T')[0]}</span>
        ),
      }, {
        title: '承办人',
        dataIndex: 'cbrxm',
        key: 'cbrxm',
        width: 80,
      }, {
        title: '单位名称',
        dataIndex: 'dwmc',
        key: 'dwmc',
        width: 100,
      }
    ];
    const TableList = {
      onChange: (page, filters, sorter) => {
        this.onChange(page);
      },
      list: modelList,
      columns,
      pagination,
      scroll: {y: document.body.clientHeight - 330},
    };

    return (
      <span>
        <span onClick={this.showModelHandler}>
          { children }
        </span>
        <Modal
          title={this.props.title}
          visible={this.state.visible}
          onOk={this.okHandler}
          onCancel={this.hideModelHandler}
          width={'60%'}
          footer={null}
        >
          <Table {...TableList} />
        </Modal>
      </span>
    );
  }
}

export default Form.create()(UserEditModal);
