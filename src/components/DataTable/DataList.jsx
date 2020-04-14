import React from "react";
import PropTypes from 'prop-types';
import {Table} from "antd";

function DataList({option, tableOption}) {
  let _pagination;
  if (option.pagination) {
    _pagination = {
      ...option.pagination,
      showSizeChanger: true,
      showTotal: () => `共 ${option.pagination.total} 个`,
      size: "normal",
    };
  } else {
    _pagination = false;
  }

  const _tableOption = tableOption || {};

  return (
    <Table size="middle"
           bordered={true}
           columns={option.columns}
           dataSource={option.dataSource}
           rowKey={record => record.id}
           onChange={option.onChange}
           pagination={_pagination}
           {..._tableOption}
    />
  );
}

export default DataList;
