/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import { Table } from "antd";

const Datatable = ({ props, columns, dataSource }) => {
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const onSelectChange = (newSelectedRowKeys) => {
    setSelectedRowKeys(newSelectedRowKeys);
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };
  return (
    <Table
      key={props}
      className="table datanew dataTable no-footer custom-table"
      // rowSelection={rowSelection}
      columns={columns}
      dataSource={dataSource}
      rowKey={(record) => record.id}
      pagination={{
        pageSize: 300, // 300 items per page
        showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`,
      }}
    />
  );
};

export default Datatable;
