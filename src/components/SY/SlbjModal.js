import React, { Component } from 'react';
import { Modal, Form } from 'antd';
import Table from '../TJFX/Table';

class UserEditModal extends Component {

  constructor(props) {
    super(props);
  }

  hideModelHandler = () => {
    const {hideModel}=this.props;
    hideModel();
  };

  render() {
    const { slbjList, visible, pagination } = this.props;
    const columns = [
      {
        title: '案件名称',
        dataIndex: 'ajmc',
        key: 'ajmc',
      },
      {
        title: '单位名称',
        dataIndex: 'cbdw_mc',
        key: 'cbdw_mc',
      },
      {
        title: '部门受案号',
        dataIndex: 'bmsah',
        key: 'bmsah',
      },
      {
        title: '承办人',
        dataIndex: 'cbr',
        key: 'cbr',
      },
    ];
    const TableList = {
      onChange: (page) => {
        const {slbjPageChange}=this.props;
        slbjPageChange(page);
      },
      list: slbjList,
      columns: columns,
      pagination,
    };

    return (
        <Modal
          title={this.props.title}
          visible={visible}
          onOk={this.hideModelHandler}
          onCancel={this.hideModelHandler}
          footer={null}
          width={700}
        >
          <Table {...TableList} />
        </Modal>
    );
  }
}

export default Form.create()(UserEditModal);
