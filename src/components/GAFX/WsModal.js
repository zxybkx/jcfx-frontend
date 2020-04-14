import React, { Component } from 'react';
import { Modal, Form } from 'antd';
import Table from '../TJFX/Table';

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
        tab: '2',
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
          if(record.wsmc){
            return(<span>{index+1}</span>)
          }
        }
      },{
        title: '文书名称',
        dataIndex: 'wsmc',
        key: 'wsmc',
        width: '30%',
      },{
        title: '数据变动',
        dataIndex: 'sjbd',
        key: 'sjbd',
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
          width={'60%'}
        >
          <Table {...TableList} />
        </Modal>
      </span>
    );
  }
}

export default Form.create()(UserEditModal);
