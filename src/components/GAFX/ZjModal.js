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
    const { dispatch, record, sel } = this.props;
    dispatch({
      type: 'tjfx/getAjxx',
      payload: {
        bmsah: record.bmsah,
        tab: '4',
        sel: sel
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
        width: 100,
        dataIndex: 'yjfl',
        key: 'yjfl',
      },{
        title: '审查项',
        width: '20%',
        dataIndex: 'gzmc',
        key: 'gzmc',
      },{
        title: '工作笔记',
        dataIndex: 'gzbj',
        key: 'gzbj',
        width: '40%',
      },{
        title: '生成文书',
        dataIndex: 'scws',
        key: 'scws',
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
