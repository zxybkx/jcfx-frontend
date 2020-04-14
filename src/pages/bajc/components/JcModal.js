import React, {Component} from 'react';
import {Modal, Form} from 'antd';
import Table from '../../../components/TJFX/Table';
import * as service from '../services/bajc';

class UserEditModal extends Component {

  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      modelList: [],
      pagination: {
        total:  0,
        current:  0,
        pageSize: 10,
      }
    };
  }

  showModelHandler = (e) => {
    this.setState({
      visible: true,
    },()=>{
      this.onChange();
    });
    if (e) e.stopPropagation();

  };

  //TODO: Issue #2 dispatch调接口弹窗不出现
  // onChange = (page) => {
  //   const {dispatch, bmsah} = this.props;
  //   dispatch({
  //     type: 'bajc/countByZcjdSpjd',
  //     payload: {
  //       pagination: {
  //         page: page ? page.current - 1 > 0 ? page.current - 1 : 0 : 0,
  //         size: page ? page.pageSize : 10,
  //       },
  //       query: {
  //         bmsah:bmsah
  //       }
  //     },
  //   }).then(({data, success}) => {
  //     if (data && success) {
  //       this.setState({
  //         modelList: data.list,
  //         pagination: {
  //           total:  data.total,
  //           current: page ? page.current : 0,
  //           pageSize: page ? page.pageSize : 10,
  //         }
  //       })
  //     }
  //   });
  // };

  onChange = (page) => {
    const { bmsah} = this.props;
    service.countByZcjdSpjd({
      pagination: {
        page: page ? page.current - 1 > 0 ? page.current - 1 : 0 : 0,
        size: page ? page.pageSize : 10,
      },
      query: {
        bmsah:bmsah
        // bmsah:"宁浦检起诉受[2018]32011100327号"
      }
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
        title: '审查项',
        dataIndex: 'scx',
        key: 'scx',
        width: 200,
      }, {
        title: '办案笔记',
        dataIndex: 'babj',
        key: 'bmsah',
        width: '30%',
      }, {
        title: '生成文书',
        dataIndex: 'scws',
        key: 'scws',
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
