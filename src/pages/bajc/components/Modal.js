import React, {Component} from 'react';
import {Modal, Form} from 'antd';
import Table from '../../../components/TJFX/Table';
import * as service from '../services/bajc';
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
    const { record} = this.props;

    service.countByBafkqkSjb({
      pagination: {
        page: page ? page.current - 1 > 0 ? page.current - 1 : 0 : 0,
        size: page ? page.pageSize : 10,
      },
      query: {
        bmsah:record.bmsah
      }
    }).then(({data, success}) => {
      if (data && success) {
        // console.log("data",data);
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



  // onChange = (page) => {
  //   const {dispatch,  record,} = this.props;
  //
  //   dispatch({
  //     type: 'bajc/countByBafkqkSjb',
  //     payload: {
  //       pagination: {
  //         page: page ? page.current - 1 > 0 ? page.current - 1 : 0 : 0,
  //         size: page ? page.pageSize : 10,
  //       },
  //       query: {
  //         bmsah:record.bmsah
  //       }
  //     },
  //   }).then(({data, success}) => {
  //     if (data && success) {
  //       this.setState({
  //         modelList: data.list,
  //         pagination: {
  //           total: data.list && data.total,
  //           current: page ? page.current : 0,
  //           pageSize: page ? page.pageSize : 10,
  //         }
  //       })
  //     }
  //   });
  // };

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
          path: 'hz', dwbm, dwmc,     //返回时使用
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
    const {modelList,pagination} = this.state;
    const columns = [
      {
        title: '序号',
        dataIndex: 'xh',
        key: 'xh',
        width: 50
      }, {
        title: '案件名称',
        dataIndex: 'ajmc',
        key: 'ajmc',
        width: 320
      }, {
        title: '建议内容',
        dataIndex: 'fknr',
        key: 'fknr',
        width: 320
      }, {
        title: '回复内容',
        dataIndex: 'hfnr',
        key: 'hfnr',
        width: 320
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
