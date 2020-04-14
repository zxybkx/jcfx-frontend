import React, { Component } from 'react';
import { Table } from 'antd';
import { buildEmptyData } from '../../utils/utils';
import styles from './Table.less';

export default class TJTable extends Component {

  render() {
    const { list, columns, scroll, pagination, loading, onChange } = this.props;
    const _list = list.concat(buildEmptyData(columns, 10 - list.length));
    const _scroll = scroll ? scroll : {};
    const _pagination = pagination ?
      {
        ...pagination,
        showSizeChanger: true,
        showTotal: () => `共 ${pagination.total} 个`,
        size: "normal",
      } : false;
    const _onChange = onChange ? onChange : ()=>{};
    return (
      <div className={styles.Home}>
        <Table
          rowKey={record => record.id || record.key || Math.random()}
          rowClassName={(record, index) => {
            if (index % 2 === 1) {
              return styles.osh;
            }
          }}
          bordered
          scroll={_scroll}
          pagination={_pagination}
          columns={columns}
          dataSource={_list}
          loading={loading}
          onChange={_onChange}
        />
      </div>
    );
  }
}
