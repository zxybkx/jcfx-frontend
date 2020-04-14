import React from "react";
import PropTypes from 'prop-types';
import {Form, Input, Button, Select, Icon} from "antd";
import styles from "./SearchBar.less";
const Search = Input.Search;

const SearchBar = ({
                     showSearch,
                     field,
                     keyword,
                     onSearch,
                     searchFields,
                     buttons,
                     form: {
                       getFieldDecorator,
                       validateFields,
                       getFieldsValue,
                     },
                   }) => {
  function handleSubmit() {
    // e.preventDefault();
    validateFields((errors) => {
      if (!!errors) {
        return;
      }
      onSearch(getFieldsValue());
    });
  }

  let _searchFields = searchFields && searchFields.length > 0 ? searchFields : [{id: "name", label: "名称"}];

  let _buttons = buttons || [];

  if (showSearch === undefined) {
    showSearch = true;
  }

  return (
    <div className={styles.normal}>
      <div className={styles.search} style={{display: showSearch ? "block" : "none"}}>
        <Form layout="inline">
          <Form.Item>
            {getFieldDecorator('field', {
              initialValue: field || 'name',
            })(
              <Select dropdownMatchSelectWidth={false} style={{width: '160px'}}>
                {_searchFields.map((item, index) => {
                  return <Select.Option key={index} value={item.id}>{item.label}</Select.Option>
                })}
              </Select>
            )}
          </Form.Item>
          <Form.Item
            hasFeedback
          >
            {getFieldDecorator('keyword', {
              initialValue: keyword || '',
            })(
              <Search placeholder="输入关键字搜索" onSearch={handleSubmit}/>
            )}
          </Form.Item>
        </Form>
      </div>
      <div className={styles.operation}>
        {_buttons.map((button, index) => {
          return <Button key={index} style={{marginLeft: '5px'}} type={button.type || "ghost"}
                         onClick={button.handler}>{button.label}</Button>;
        })}
      </div>
    </div>
  );
};

SearchBar.propTypes = {
  form: PropTypes.object.isRequired,
  onSearch: PropTypes.func,
  onAdd: PropTypes.func,
  field: PropTypes.string,
  keyword: PropTypes.string,
};

export default Form.create()(SearchBar);
