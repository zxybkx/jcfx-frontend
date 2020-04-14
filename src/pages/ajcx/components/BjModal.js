import React, {Component} from 'react';
import {Modal, Form} from 'antd';
import Table from '../../../components/TJFX/Table';
import {routerRedux} from 'dva/router';
import {CONTEXT} from '../../../constant';
import Window from './Window';
import styles from './Table.less';

class UserEditModal extends Component {

  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      modelList: []
    };
  }

  showModelHandler = (e) => {
    this.setState({
      visible: true,
    });
    if (e) e.stopPropagation();
    this.getCount();
  };

  getCount = () => {
    const {dispatch, record} = this.props;
    dispatch({
      type: 'portal/getAjxx',
      payload: {
        bmsah: record.bmsah,
        tab: '1',
        sel: '0'
      },
    }).then(({data, success}) => {
      if (data && success) {
        this.setState({
          modelList: data.list,
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
    const {children, title} = this.props;
    const {modelList, visible} = this.state;
    const columns = [
      {
        title: '序号',
        key: 'xh',
        width: 50,
        render: (text, record, index) => {
          if (record.yjfl) {
            return (<span>{index + 1}</span>)
          }
        }
      }, {
        title: '审查项类型',
        dataIndex: 'yjfl',
        key: 'yjfl',
        width: 100,
      }, {
        title: '审查项',
        dataIndex: 'gzmc',
        key: 'gzmc',
        width: '20%',
      }, {
        title: '推送内容',
        dataIndex: 'wtms',
        key: 'wtms',
        width: '40%',
      }, {
        title: '工作笔记',
        dataIndex: 'gzbj',
        key: 'gzbj',
      }
    ];
    const TableList = {
      list: modelList,
      columns: columns,
      scroll: {y: document.body.clientHeight - 270},
    };
    const windowProps = {
      title,
      visible,
      onClose: this.hideModelHandler,
      onResize: (w, h) => {
        this.table && this.table.resize && this.table.resize();
      }
    };

    return (
      <span>
        <span onClick={this.showModelHandler}>
          { children }
        </span>
           <Window  {...windowProps} ref={c => this.container = c}>
          <Table {...TableList} bordered rowKey={record => Math.random()}
                 rowClassName={(record, index) => {
                   if (index % 2 === 1) {
                     return styles.osh;
                   }
                 }}/>
           </Window>
      </span>
    );
  }
}

export default Form.create()(UserEditModal);
