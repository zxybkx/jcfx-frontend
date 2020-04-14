import React  from "react";
import {Input, Select, InputNumber, DatePicker, Radio, Checkbox} from "antd";
import moment from 'moment';
import styles from './FormBuilder.less';

const Option = Select.Option;
const RangePicker = DatePicker.RangePicker;
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;
const CheckboxGroup = Checkbox.Group;
const { TextArea } = Input;

const FormBuilder = ({
                       fieldConfig,
                       fieldData,
                       getFieldDecorator,
                       onChange
                     }) => {

  const onChangeHandler = (object)=>{
    if(onChange){
      onChange(object);
    }
  };

  function createField() {
    const verticalStyle = {
      marginLeft: 0,
      display: 'block',
      height: '30px',
      lineHeight: '30px',
    };

    // 时间样式
    const dateStyle = {
      width: '200px',
    };



    let options = [];
    for (let key in fieldConfig.options) {
      options.push({
        "value": key,
        "label": fieldConfig.options[key]
      });
    }

    let field;
    const type = fieldConfig.type.toLowerCase();
    const vertical = fieldConfig.align === 'vertical';
    switch (type) {
      case 'text':
        field = <Input onChange={onChangeHandler} type='text'/>;
        break;

      case 'textarea':
        const rows = fieldConfig.row || 4;
        field = <TextArea onChange={onChangeHandler} rows={rows}/>;
        break;

      case 'select':
        field = <Select placeholder={`请选择${fieldConfig.label}`}>
          {options.map((opt, index) => <Option key={index} value={opt.value}>{opt.label}</Option>)}
        </Select>;
        break;

      case 'date':
        field = <DatePicker showTime format="YYYY-MM-DD HH:mm:ss" style={dateStyle}/>;
        break;

      case 'date-range':
        field = <RangePicker showTime format="YYYY-MM-DD HH:mm:ss"/>;
        break;

      case 'numeric':
        field = <InputNumber onChange={onChangeHandler} min={1}/>;
        break;

      case 'radio-audit':
        field = <RadioGroup onChange={onChangeHandler}>
          <RadioButton value="yes">同意</RadioButton>
          <RadioButton value="no">不同意</RadioButton>
        </RadioGroup>;
        break;

      case 'radiogroup':
        field = <RadioGroup onChange={onChangeHandler}>
          {options.map((opt, index) => <Radio style={vertical ? verticalStyle : {}}  key={index} value={opt.value} defaultChecked={index === 0}>{opt.label}</Radio>)}
        </RadioGroup>;
        break;

      case 'checkboxgroup':
        field = <CheckboxGroup onChange={onChangeHandler}>
          {options.map((opt, index) => <Checkbox style={vertical ? verticalStyle : {}}  key={index} value={opt.value}>{opt.label}</Checkbox>)}
        </CheckboxGroup>;
        break;

      case 'number':
        field = <InputNumber onChange={onChangeHandler} min={0}/>;
        break;

      default:
        field = <Input onChange={onChangeHandler} type='text'/>;
        break;
    }

    return field;
  }

  let type = {};
  if (/.*range.*/.test(fieldConfig.type)) {
    type = {type: 'array'};
  }

  let initValue = fieldData || fieldConfig.default;
  if (/.*numeric.*/.test(fieldConfig.type)) {
    initValue = parseInt(initValue);
  }

  // 日期格式
  if(/.*date.*/.test(fieldConfig.type)){
    initValue = moment(initValue,'YYYY-MM-DD HH:mm:ss');
  }

  let errorMessage = fieldConfig.errorMessage;
  if (!errorMessage || errorMessage.length === 0) {
    errorMessage = fieldConfig.label + "不能为空。";
  }

  return (
        <div className={styles.formItem}>
          <div className={styles.label}>
            {fieldConfig.required && <span className={styles.must}>*</span> }
            {fieldConfig.label}
          </div>
          <div className={styles.control}>
            {getFieldDecorator(`${fieldConfig.name}`, {
              initialValue: initValue,
              rules: [
                {...type, required: fieldConfig.required, message: errorMessage},
              ],
            })(
              createField()
            )}
          </div>
        </div>
  );
};

export default FormBuilder;
