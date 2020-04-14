import React, {Component} from 'react';
import {Modal, Form} from 'antd';
import Table from '../../../components/TJFX/Table';
import Window from './Window';
import styles from './Table.less';


class UserEditModal extends Component {

  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      modelList: [],
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
        tab: '3',
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
    const {children,title} = this.props;
    const {modelList,visible} = this.state;
    const columns = [
      {
        title: '序号',
        key: 'xh',
        width: 50,
        render: (text, record, index) => {
          if (record.bmsah) {
            return (<span>{index + 1}</span>)
          }
        }
      }, {
        title: '部门受案号',
        key: 'bmsah',
        dataIndex: 'bmsah',
        width: 200
      },{
        title: '案件名称',
        key: 'ajmc',
        dataIndex: 'ajmc',
        width: 140
      },  {
        title: '问题类型',
        dataIndex: 'advice',
        key: 'advice',
        width: 120
      }, {
        title: '处理内容',
        dataIndex: 'clnr',
        key: 'clnr',
        width: 220
      }, {
        title: '处理人',
        dataIndex: 'clr',
        key: 'clr',
        width: 80
      }, {
        title: '类型',
        dataIndex: 'lx',
        key: 'lx',
        width:100,
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
