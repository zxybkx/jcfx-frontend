import React, { Component } from 'react';
import { Modal, Form } from 'antd';
import Table from '../TJFX/Table';
import { routerRedux } from 'dva/router';
import { CONTEXT } from '../../constant';

class UserEditModal extends Component {

  constructor(props) {
    super(props);
    this.state = {
      visible: false,
    };
  }

  showModelHandler = (e) => {
    if (e) e.stopPropagation();
    const { dispatch, record } = this.props;
    dispatch({
      type: 'tjfx/getAjxx',
      payload: {
        bmsah: record.bmsah,
        tab: '1',
        sel: '0'
      },
    });
    this.setState({
      visible: true,
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
    const { children, modelList } = this.props;
    const columns=[
      {
        title: '序号',
        key: 'xh',
        width: 50,
        render: (text,record,index)=>{
          if(record.yjfl){
            return(<span>{index+1}</span>)
          }
        }
      },{
        title: '审查项类型',
        dataIndex: 'yjfl',
        key: 'yjfl',
        width: 100,
      },{
        title: '审查项',
        dataIndex: 'gzmc',
        key: 'gzmc',
        width: '20%',
      },{
        title: '推送内容',
        dataIndex: 'wtms',
        key: 'wtms',
        width: '40%',
      },{
        title: '工作笔记',
        dataIndex: 'gzbj',
        key: 'gzbj',
      }
    ];
    const TableList = {
      list: modelList,
      columns: columns,
      scroll: { y: document.body.clientHeight-330 },
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
          footer={null}
          width={'80%'}
        >
          <Table {...TableList} />
        </Modal>
      </span>
    );
  }
}

export default Form.create()(UserEditModal);
