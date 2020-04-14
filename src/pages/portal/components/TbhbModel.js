import React, {Component} from 'react';
import {Modal, Form} from 'antd';
import Table from '../../../components/TJFX/Table';
import {routerRedux} from 'dva/router';
import {CONTEXT} from '../../../constant';

class HsTable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modelList: [],
      pagination: {},
      type: null,
    }
  };

  //返回
  onClick = (record)=>{
    const {dispatch, searchVal, haveChild} = this.props;
    dispatch(
      routerRedux.push({
        pathname: `${CONTEXT}/ajcx`,
        query:{
          path: 'portal',
          dwbm: searchVal.dwbm,
          dwmc: searchVal.dwmc,
          haveChild,
          searchVal: searchVal,
          bmsah: record.bmsah,
          cbrgh: record.cbrgh,
          ajcxdwbm: record.dwbm,
          ajcxdwmc: record.dwmc,
        }
      })
    );
  }

  render(){
    const {children, record, cs, pagination} = this.props;
    const columns = [
      {
        title: '序号',
        key: 'xh',
        width: 50,
        render: (text, record, index) =>{
          if(record.dwbm){
            return(<span>{index + 1}</span>)
          }
        }
      },{
        title: '单位编码',
        dataIndex: 'dwbm',
        key: 'dwbm',
        width: 80,
      },{
        title: '部门受案号',
        dataIndex: 'bmsah',
        key: 'bmsah',
        widtn: 200,
      },{
        title: '案件名称',
        dataIndex: 'ajmc',
        key: 'ajmc',
        width: 140,
        render: (text, record)=>{
          return(
            <a onClick = {() =>this.onClick(record)}>{text}</a>
          )
        }
      },{
        title: '受案日期',
        dataIndex: 'sasj',
        key: 'sasj',
        width: 100,
        render: (text, record) =>(
          <span>{text && text.split('T')[0]}</span>
        )
      },{
        title: '办结日期',
        dataIndex: 'bjsj',
        key: 'bjsj',
        width: 100,
        render: (text, record) =>(
          <span>{text && text.split('T')[0]}</span>
        )
      },{
        title: '承办人',
        dataIndex: 'cbrxm',
        key: 'cbrxm',
        width: 80,
      },{
        title: '单位名称',
        dataIndex: 'dwmc',
        key: 'dwmc',
        width: 100,
      }
    ];

    const TableList = {
      onChange: (page) =>{
        this.props.onTableChange(cs, page);
      },
      list: record,
      columns,
      pagination,
      scroll: {y: document.body.clientHeight - 330},
    };

    return(
      <span>
        <span>
          {children}
        </span>
        <Modal
          title = {this.props.title}
          visible = {this.props.visible}
          onCancel = {this.props.hideModelHandler}
          width={'80vw'}
          style={{ top: 40 }}
          footer = {null}
        >
          <Table {...TableList}/>
        </Modal>
      </span>
    )
  }
}

export default Form.create()(HsTable);
