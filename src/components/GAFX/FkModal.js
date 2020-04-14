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
        tab: '3',
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
          if(record.zbjg){
            return(<span>{index+1}</span>)
          }
        }
      },{
        title: '问题类型',
        dataIndex: 'zbjg',
        key: 'zbjg',
        width: '10%',
        render: (text,record,index)=>{
          let a='';
          if(record.zbjg==='A'){
            a='结论'
          }else if(record.zbjg==='B'){
            a='文书'
          }else if(record.zbjg==='C'){
            a='其他'
          }else if(record.zbjg==='D'){
            a='规则'
          }else {
            a='用户反馈'
          }
          return (<span>{a}</span>)
        }
      },{
        title: '问题及建议',
        dataIndex: 'wtms',
        key: 'wtms',
        width: '30%',
      },{
        title: '问题截图(选填)',
        dataIndex: 'jsondata',
        key: 'jsondata',
        width: '30%',
      },{
        title: '回复内容',
        dataIndex: 'hfnr',
        key: 'hfnr',
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
