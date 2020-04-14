import {connect} from 'dva';
import React, {Component} from 'react';
import Main from './components/Main';
import Modal from './components/Modal';
import JcModal from './components/JcModal';
import moment from 'moment';
const myDate = new Date();
const endDate = moment(myDate).format('YYYY-MM-DD');

@connect(({tjfx, loading}) => ({
  tjfx: tjfx,
  loading,
}))
export default class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      haveChild: '',
      searchValue: {
        ajlb: ['ZJ'],
        ysay: ['交通肇事罪'],
        start: '2017-10-24',
        end: endDate,
      },
      dwmc: '',
      dwbm: '3201',
      table: '受案情况表',
      record:{},
      cs:'',
      tableLevel: 1,
      columns: [],
      list: [],
      pagination: {},
      type:null  //接口参数
    };
  }

  componentDidMount() {
    const {dispatch} = this.props;
    dispatch({
      type: 'tjfx/getTree',
      payload: {
        dwbm: '32',
      },
    });

    this.onTableChange('受案情况表')
  }

  // 搜索
  onSearch = (values) => {
    this.setState({
      searchValue: values,
    }, () => {
      const {tableLevel} = this.state;
      if (tableLevel === 1) {
        this.switch();
      } else if (tableLevel === 2) {
        this.subSwitch();
      }
    });

  };

  // 树选择
  treeSelect = (values) => {
    const newdwbm = values.children ? values.value === '320000' ? '32' : values.value.substring(0, 4) : values.value;
    this.setState({
      dwmc: values.name,
      dwbm: newdwbm,
    }, () => {
      const {tableLevel, table,cs} = this.state;
      if (tableLevel === 1) {
        this.onTableChange(table)
      } else if (tableLevel === 2) {
        this.onClick(table,cs)
      }
    });

  };

  onBack = () => {
    this.onTableChange(this.state.table)
  };

  //一级表格切换
  onTableChange = (value) => {
    this.setState({
      columns: this.getColumns(value),
      table: value,
      tableLevel: 1,
      list: [],
    }, () => {
      this.switch();
    });
  };

  //一级表Columns
  getColumns = (value) => {
    const {dwbm} = this.state;
    switch (value) {
      case '受案情况表':
        const saqk = [
          {
            title: dwbm.length === 6 ? '承办人' : '单位',
            dataIndex: dwbm.length === 6 ? 'cbrxm' : 'dwmc',
            key: dwbm.length === 6 ? 'cbrxm' : 'dwmc',
            width: 300,
            render: (text, record) =>
              <a>{ text === '江苏省人民检察院' ? '江苏省院' : text }</a>
          }, {
            title: '受理',
            dataIndex: 'sl',
            key: 'sl',
            width: 400,
            sorter: (a, b) => a.sl - b.sl,
            render: (text, record) => <a onClick={() => {
              this.onClick(record, 'sl')
            }}>{ text > 0 ? text : null }</a>
          }, {
            title: '已识别',
            dataIndex: 'ysb',
            key: 'ysb',
            width: 400,
            sorter: (a, b) => a.ysb - b.ysb,
            render: (text, record) => <a onClick={() => {
              this.onClick(record, 'ysb')
            }}>{ text > 0 ? text : null }</a>
          }, {
            title: '未识别',
            dataIndex: 'wsb',
            key: 'wsb',
            sorter: (a, b) => a.wsb - b.wsb,
            render: (text, record) => <a onClick={() => {
              this.onClick(record, 'wsb')
            }}>{ text > 0 ? text : null }</a>
          }
        ];
        return saqk;
        break;
      case '办结情况表-审查逮捕':
        const bjqk_scdb = [
          {
            title: dwbm.length === 6 ? '承办人' : '单位',
            dataIndex: dwbm.length === 6 ? 'cbrxm' : 'dwmc',
            key: dwbm.length === 6 ? 'cbrxm' : 'dwmc',
            width: 200,
            render: (text, record) => <a>{ text === '江苏省人民检察院' ? '江苏省院' : text }</a>
          }, {
            title: '统一系统',
            children: [{
              title: '办结',
              dataIndex: 'bj_tyxt',
              key: 'bj_tyxt',
              width: 100,
              sorter: (a, b) => a.bj_tyxt - b.bj_tyxt,
              render: (text, record) => <a onClick={() => {
                this.onClick(record, 'bj_tyxt')
              }}>{ text > 0 ? text : null }</a>
            }, {
              title: '应结未结',
              dataIndex: 'yjwj_tyxt',
              key: 'yjwj_tyxt',
              width: 100,
              sorter: (a, b) => a.yjwj_tyxt - b.yjwj_tyxt,
              render: (text, record) => <a onClick={() => {
                this.onClick(record, 'yjwj_tyxt')
              }}>{ text > 0 ? text : null }</a>
            }]
          }, {
            title: '本系统',
            children: [{
              title: '办理',
              dataIndex: 'bl_bxt',
              key: 'bl_bxt',
              width: 100,
              sorter: (a, b) => a.bl_bxt - b.bl_bxt,
              render: (text, record) => <a onClick={() => {
                this.onClick(record, 'bl_bxt')
              }}>{ text > 0 ? text : null }</a>
            }, {
              title: '办结',
              dataIndex: 'bj_bxt',
              key: 'bj_bxt',
              width: 100,
              sorter: (a, b) => a.bj_bxt - b.bj_bxt,
              render: (text, record) => <a onClick={() => {
                this.onClick(record, 'bj_bxt')
              }}>{ text > 0 ? text : null }</a>
            }, {
              title: '应结未结（指大统一中办结的案件，本系统未结）',
              dataIndex: 'yjwj_bxt',
              key: 'yjwj_bxt',
              sorter: (a, b) => a.yjwj_bxt - b.yjwj_bxt,
              render: (text, record) => <a onClick={() => {
                this.onClick(record, 'yjwj_bxt')
              }}>{ text > 0 ? text : null }</a>
            }]
          }, {
            title: '批捕',
            dataIndex: 'pb',
            key: 'pb',
            width: 100,
            sorter: (a, b) => a.pb - b.pb,
            render: (text, record) => <a onClick={() => {
              this.onClick(record, 'pb')
            }}>{ text > 0 ? text : null }</a>
          }, {
            title: '不批捕',
            children: [{
              title: '无逮捕必要',
              dataIndex: 'wdbby',
              key: 'wdbby',
              width: 100,
              sorter: (a, b) => a.wdbby - b.wdbby,
              render: (text, record) => <a onClick={() => {
                this.onClick(record, 'wdbby')
              }}>{ text > 0 ? text : null }</a>
            }, {
              title: '存疑不捕',
              dataIndex: 'cybb',
              key: 'cybb',
              width: 100,
              sorter: (a, b) => a.cybb - b.cybb,
              render: (text, record) => <a onClick={() => {
                this.onClick(record, 'cybb')
              }}>{ text > 0 ? text : null }</a>
            }, {
              title: '不构罪',
              dataIndex: 'bgz',
              key: 'bgz',
              width: 100,
              sorter: (a, b) => a.bgz - b.bgz,
              render: (text, record) => <a onClick={() => {
                this.onClick(record, 'bgz')
              }}>{ text > 0 ? text : null }</a>
            }]
          }
        ];
        return bjqk_scdb;
        break;
      case '办结情况表-审查起诉':
        const bjqk_scqs = [
          {
            title: dwbm.length === 6 ? '承办人' : '单位',
            dataIndex: dwbm.length === 6 ? 'cbrxm' : 'dwmc',
            key: dwbm.length === 6 ? 'cbrxm' : 'dwmc',
            width: 200,
            render: (text, record) => <span>{ text === '江苏省人民检察院' ? '江苏省院' : text }</span>
          }, {
            title: '统一系统',
            children: [{
              title: '办结',
              dataIndex: 'bj_tyxt',
              key: 'bj_tyxt',
              width: 100,
              sorter: (a, b) => a.bj_tyxt - b.bj_tyxt,
              render: (text, record) => <a onClick={() => {
                this.onClick(record, 'bj_tyxt')
              }}>{ text > 0 ? text : null }</a>
            }, {
              title: '应结未结',
              dataIndex: 'yjwj_tyxt',
              key: 'yjwj_tyxt',
              width: 100,
              sorter: (a, b) => a.yjwj_tyxt - b.yjwj_tyxt,
              render: (text, record) => <a onClick={() => {
                this.onClick(record, 'yjwj_tyxt')
              }}>{ text > 0 ? text : null }</a>
            }]
          }, {
            title: '本系统',
            children: [{
              title: '办理',
              dataIndex: 'bl_bxt',
              key: 'bl_bxt',
              width: 100,
              sorter: (a, b) => a.bl_bxt - b.bl_bxt,
              render: (text, record) => <a onClick={() => {
                this.onClick(record, 'bl_bxt')
              }}>{ text > 0 ? text : null }</a>
            }, {
              title: '办结',
              dataIndex: 'bj_bxt',
              key: 'bj_bxt',
              width: 100,
              sorter: (a, b) => a.bj_bxt - b.bj_bxt,
              render: (text, record) => <a onClick={() => {
                this.onClick(record, 'bj_bxt')
              }}>{ text > 0 ? text : null }</a>
            }, {
              title: '应结未结（指大统一中办结的案件，本系统未结）',
              dataIndex: 'yjwj_bxt',
              key: 'yjwj_bxt',
              sorter: (a, b) => a.yjwj_bxt - b.yjwj_bxt,
              render: (text, record) => <a onClick={() => {
                this.onClick(record, 'yjwj_bxt')
              }}>{ text > 0 ? text : null }</a>
            }]
          }, {
            title: '起诉',
            dataIndex: 'qs',
            key: 'qs',
            width: 100,
            sorter: (a, b) => a.qs - b.qs,
            render: (text, record) => <a onClick={() => {
              this.onClick(record, 'qs')
            }}>{ text > 0 ? text : null }</a>
          }, {
            title: '不起诉',
            children: [{
              title: '相对不诉',
              dataIndex: 'xdbs',
              key: 'xdbs',
              width: 100,
              sorter: (a, b) => a.xdbs - b.xdbs,
              render: (text, record) => <a onClick={() => {
                this.onClick(record, 'xdbs')
              }}>{ text > 0 ? text : null }</a>
            }, {
              title: '存疑不诉',
              dataIndex: 'cybs',
              key: 'cybs',
              width: 100,
              sorter: (a, b) => a.cybs - b.cybs,
              render: (text, record) => <a onClick={() => {
                this.onClick(record, 'cybs')
              }}>{ text > 0 ? text : null }</a>
            }, {
              title: '绝对不诉',
              dataIndex: 'jdbs',
              key: 'jdbs',
              width: 100,
              sorter: (a, b) => a.jdbs - b.jdbs,
              render: (text, record) => <a onClick={() => {
                this.onClick(record, 'jdbs')
              }}>{ text > 0 ? text : null }</a>
            }]
          }, {
            title: '撤回',
            dataIndex: 'ch',
            key: 'ch',
            width: 100,
            sorter: (a, b) => a.ch - b.ch,
            render: (text, record) => <a onClick={() => {
              this.onClick(record, 'ch')
            }}>{ text > 0 ? text : null }</a>
          }, {
            title: '退查未重报',
            dataIndex: 'tcwcb',
            key: 'tcwcb',
            width: 100,
            sorter: (a, b) => a.tcwcb - b.tcwcb,
            render: (text, record) => <a onClick={() => {
              this.onClick(record, 'tcwcb')
            }}>{ text > 0 ? text : null }</a>
          }
        ];
        return bjqk_scqs;
        break;
      case '侦查监督情况表':
        const zcjdqk = [
          {
            title: dwbm.length === 6 ? '承办人' : '单位',
            dataIndex: dwbm.length === 6 ? 'cbrxm' : 'dwmc',
            key: dwbm.length === 6 ? 'cbrxm' : 'dwmc',
            width: 200,
            render: (text, record) => <span>{ text === '江苏省人民检察院' ? '江苏省院' : text }</span>
          }, {
            title: '违法瑕疵',
            dataIndex: 'wfd',
            key: 'wfd',
            width: 290,
            sorter: (a, b) => a.wfd - b.wfd,
            render: (text, record) => <a onClick={() => {
              this.onClick(record, 'wfd')
            }}>{ text > 0 ? text : null }</a>
          }, {
            title: '书面纠违',
            dataIndex: 'smjz',
            key: 'smjz',
            width: 290,
            sorter: (a, b) => a.smjz - b.smjz,
            render: (text, record) => <a onClick={() => {
              this.onClick(record, 'smjz')
            }}>{ text > 0 ? text : null }</a>
          }, {
            title: '检察建议',
            dataIndex: 'jcjy',
            key: 'jcjy',
            width: 290,
            sorter: (a, b) => a.jcjy - b.jcjy,
            render: (text, record) => <a onClick={() => {
              this.onClick(record, 'jcjy')
            }}>{ text > 0 ? text : null }</a>
          }, {
            title: '口头纠违',
            dataIndex: 'ktjz',
            key: 'ktjz',
            width: 290,
            sorter: (a, b) => a.ktjz - b.ktjz,
            render: (text, record) => <a onClick={() => {
              this.onClick(record, 'ktjz')
            }}>{ text > 0 ? text : null }</a>
          }, {
            title: '补侦提纲',
            dataIndex: 'bztg',
            key: 'bztg',
            sorter: (a, b) => a.bztg - b.bztg,
            render: (text, record) => <a onClick={() => {
              this.onClick(record, 'bztg')
            }}>{ text > 0 ? text : null }</a>
          }
        ];
        return zcjdqk;
        break;
      case '审判监督情况表':
        const spjdqk = [
          {
            title: dwbm.length === 6 ? '承办人' : '单位',
            dataIndex: dwbm.length === 6 ? 'cbrxm' : 'dwmc',
            key: dwbm.length === 6 ? 'cbrxm' : 'dwmc',
            width: 200,
            render: (text, record) => <span>{ text === '江苏省人民检察院' ? '江苏省院' : text }</span>
          }, {
            title: '违法瑕疵',
            dataIndex: 'wfd_spjd',
            key: 'wfd_spjd',
            width: 290,
            sorter: (a, b) => a.wfd_spjd - b.wfd_spjd,
            render: (text, record) => <a onClick={() => {
              this.onClick(record, 'wfd_spjd')
            }}>{ text > 0 ? text : null }</a>
          }, {
            title: '抗诉',
            dataIndex: 'ks',
            key: 'ks',
            width: 290,
            sorter: (a, b) => a.ks - b.ks,
            render: (text, record) => <a onClick={() => {
              this.onClick(record, 'ks')
            }}>{ text > 0 ? text : null }</a>
          }, {
            title: '书面纠违',
            dataIndex: 'smjz_spjd',
            key: 'smjz_spjd',
            width: 290,
            sorter: (a, b) => a.smjz_spjd - b.smjz_spjd,
            render: (text, record) => <a onClick={() => {
              this.onClick(record, 'smjz_spjd')
            }}>{ text > 0 ? text : null }</a>
          }, {
            title: '检察建议',
            dataIndex: 'jcjy_spjd',
            key: 'jcjy_spjd',
            width: 290,
            sorter: (a, b) => a.jcjy_spjd - b.jcjy_spjd,
            render: (text, record) => <a onClick={() => {
              this.onClick(record, 'jcjy_spjd')
            }}>{ text > 0 ? text : null }</a>
          }, {
            title: '口头纠违',
            dataIndex: 'ktjz_spjd',
            key: 'ktjz_spjd',
            sorter: (a, b) => a.ktjz_spjd - b.ktjz_spjd,
            render: (text, record) => <a onClick={() => {
              this.onClick(record, 'ktjz_spjd')
            }}>{ text > 0 ? text : null }</a>
          }
        ];
        return spjdqk;
        break;
      case '办案反馈情况表':
        const bafkqk = [
          {
            title: dwbm.length === 6 ? '承办人' : '单位',
            dataIndex: dwbm.length === 6 ? 'cbrxm' : 'dwmc',
            key: dwbm.length === 6 ? 'cbrxm' : 'dwmc',
            width: 200,
            render: (text, record) => <span>{ text === '江苏省人民检察院' ? '江苏省院' : text }</span>
          }, {
            title: '反馈',
            dataIndex: 'fk',
            key: 'fk',
            width: 600,
            sorter: (a, b) => a.fk - b.fk,
            render: (text, record) => <a onClick={() => {
              this.onClick(record, 'fk')
            }}>{ text > 0 ? text : null }</a>
          }, {
            title: '回复',
            dataIndex: 'hf',
            key: 'hf',
            sorter: (a, b) => a.hf - b.hf,
            render: (text, record) => <a onClick={() => {
              this.onClick(record, 'hf')
            }}>{ text > 0 ? text : null }</a>
          }
        ];
        return bafkqk;
        break;
      case '诉判比对完成情况表':
        const spbdwcqk = [
          {
            title: dwbm.length === 6 ? '承办人' : '单位',
            dataIndex: dwbm.length === 6 ? 'cbrxm' : 'dwmc',
            key: dwbm.length === 6 ? 'cbrxm' : 'dwmc',
            width: 200,
            render: (text, record) => <span>{ text === '江苏省人民检察院' ? '江苏省院' : text }</span>
          }, {
            title: '判决',
            dataIndex: 'pj',
            key: 'pj',
            width: 300,
            sorter: (a, b) => a.pj - b.pj,
            render: (text, record) => <a onClick={() => {
              this.onClick(record, 'pj')
            }}>{ text > 0 ? text : null }</a>
          }, {
            title: '收到判决',
            dataIndex: 'sdpj',
            key: 'sdpj',
            width: 300,
            sorter: (a, b) => a.sdpj - b.sdpj,
            render: (text, record) => <a onClick={() => {
              this.onClick(record, 'sdpj')
            }}>{ text > 0 ? text : null }</a>
          }, {
            title: '审查项处理',
            dataIndex: 'scxcl',
            key: 'scxcl',
            width: 300,
            sorter: (a, b) => a.scxcl - b.scxcl,
            render: (text, record) => <a onClick={() => {
              this.onClick(record, 'scxcl')
            }}>{ text > 0 ? text : null }</a>
          }, {
            title: '文书编辑',
            dataIndex: 'wsbj',
            key: 'wsbj',
            width: 300,
            sorter: (a, b) => a.wsbj - b.wsbj,
            render: (text, record) => <a onClick={() => {
              this.onClick(record, 'wsbj')
            }}>{ text > 0 ? text : null }</a>
          }, {
            title: '诉判比对完成',
            dataIndex: 'spbdwc',
            key: 'spbdwc',
            width: 300,
            sorter: (a, b) => a.spbdwc - b.spbdwc,
            render: (text, record) => <a onClick={() => {
              this.onClick(record, 'spbdwc')
            }}>{ text > 0 ? text : null }</a>
          }
        ];
        return spbdwcqk;
        break;
      default:
        break;
    }
  };

  switch = () => {
    const {table} = this.state;
    switch (table) {
      case '受案情况表':
        this.getList('bajc/countByBajc');
        break;
      case '办结情况表-审查逮捕':
        this.getList('bajc/countByBaqkScdb');
        break;
      case '办结情况表-审查起诉':
        this.getList('bajc/countByBaqkScdb');
        break;
      case '侦查监督情况表':
        this.getList('portal/countByBajd');
        break;
      case '审判监督情况表':
        this.getList('portal/countByBajd');
        break;
      case '办案反馈情况表':
        this.getList('bajc/countByBafkqk');
        break;
      case '诉判比对完成情况表':
        // this.setState({
        //   list:[{
        //     pj:3,sdpj:2,scxcl:2,wsbj:6,spbdwc:9
        //   }]
        // });
        this.getList('bajc/countBySpbdqk');
        break;
      default:
        break;
    }
  };

  getList = (type) => {
    const {dispatch} = this.props;
    const {table, searchValue, dwbm} = this.state;
    const ajlb = table === '办结情况表-审查逮捕' ? ['ZJ'] : table === '办结情况表-审查起诉' ? ['GS'] : searchValue.ajlb;
    dispatch({
      type: type,
      payload: {
        ajlb: ajlb,
        ysay: searchValue.ysay,
        sasjStart: searchValue.start,
        sasjEnd: searchValue.end,
        dwbm: dwbm,
      }
    }).then(({data,success}) => {
      if (data && success) {
        this.setState({
          list: data,
          pagination: false
        })
      }
    })
  };

  //二级表格选择
  onClick = (record, cs) => {
    const {table} = this.state;

    this.setState({
      columns: this.getSubColumns(table, cs),
      tableLevel: 2,
      list: [],
      record:record,
      cs:cs
    }, () => {
      this.subSwitch();
    });
  };

  //二级表Columns
  getSubColumns = (table, cs) => {
    const { dispatch } = this.props;
    let column = [
      {
        title: '序号',
        dataIndex: 'xh',
        key: 'xh',
        width: 50
      }, {
        title: '单位代码',
        dataIndex: 'dwbm',
        key: 'dwbm',
        width: 100
      }, {
        title: '部门受案号',
        dataIndex: 'bmsah',
        key: 'bmsah',
        width: 280,
        render:(text,record)=>{
          if(table==="审判监督情况表"||table==="侦查监督情况表"){
            return (
              <JcModal title="三级表" bmsah={text} dispatch={dispatch}>
                <a>{text ? text : ''}</a>
              </JcModal>
            )
          }else{
            return <span>{text}</span>
          }
        }
      }, {
        title: '案件名称',
        dataIndex: 'ajmc',
        key: 'ajmc',
        width: 280
      }, {
        title: '受案日期',
        dataIndex: 'sasj',
        key: 'sasj',
        width: 280,
        render: (text, record) => (
          <span>{text && text.split('T')[0]}</span>
        ),
      }, {
        title: '办结日期',
        dataIndex: 'bjsj',
        key: 'bjsj',
        width: 280,
        render: (text, record) => (
          <span>{text && text.split('T')[0]}</span>
        ),
      }, {
        title: '承办人',
        dataIndex: 'cbrxm',
        key: 'cbrxm',
        width: 100
      }, {
        title: '单位名称',
        dataIndex: 'dwmc',
        key: 'dwmc'
      }
    ];
    switch (table) {
      case '受案情况表':
        const saqk = [
          {
            title: '序号',
            dataIndex: 'xh',
            key: 'xh',
            width: 50
          }, {
            title: '单位代码',
            dataIndex: 'dwbm',
            key: 'dwbm',
            width: 200
          }, {
            title: '部门受案号',
            dataIndex: 'bmsah',
            key: 'bmsah',
            width: 200
          }, {
            title: '案件名称',
            dataIndex: 'ajmc',
            key: 'ajmc',
            width: 200
          }, {
            title: '受理时间',
            dataIndex: 'sasj',
            key: 'sasj',
            width: 200,
            render: (text, record) => (
              <span>{text && text.split('T')[0]}</span>
            ),
          }, {
            title: '扫描时间',
            dataIndex: 'smsj',
            key: 'smsj',
            width: 200,
            render: (text, record) => (
              <span>{text && text.split('T')[0]}</span>
            ),
          }, {
            title: '识别',
            dataIndex: 'sb',
            key: 'sb',
            width: 100
          }, {
            title: '处理',
            dataIndex: 'cl',
            key: 'cl',
            width: 100
          }, {
            title: '缺少材料',
            dataIndex: 'qscl',
            key: 'qscl',
            width: 100
          }, {
            title: '承办人',
            dataIndex: 'cbrxm',
            key: 'cbrxm',
            width: 100
          }, {
            title: '单位名称',
            dataIndex: 'dwmc',
            key: 'dwmc',
          }
        ];
        return saqk;
        break;
      case '办结情况表-审查逮捕':
        return column;
        break;
      case '办结情况表-审查起诉':
        return column;
        break;
      case '侦查监督情况表':
        return column;
        break;
      case '审判监督情况表':
        return column;
        break;
      case '办案反馈情况表':
        const bafkqk = [
          {
            title: '序号',
            dataIndex: 'xh',
            key: 'xh',
            width: 50,
            render: (text, record) => <span>{ text === '江苏省人民检察院' ? '江苏省院' : text }</span>
          }, {
            title: '单位编码',
            dataIndex: 'dwbm',
            key: 'dwbm',
            width: 100
          }, {
            title: '部门受案号',
            dataIndex: 'bmsah',
            key: 'bmsah',
            width: 200
          }, {
            title: '案件名称',
            dataIndex: 'ajmc',
            key: 'ajmc',
            width: 300
          }, {
            title: '受案日期',
            dataIndex: 'sasj',
            key: 'sasj',
            width: 200,
            render: (text, record) => (
              <span>{text && text.split('T')[0]}</span>
            ),
          }, {
            title: '办结日期',
            dataIndex: 'bjsj',
            key: 'bjsj',
            width: 200,
            render: (text, record) => (
              <span>{text && text.split('T')[0]}</span>
            ),
          }, {
            title: '建议',
            dataIndex: 'fk',
            key: 'fk',
            width: 100,
            render: (text, record) => (
              <Modal title="二级表" record={record} cs={'fk'} dispatch={dispatch}>
                <a>{text ? text : ''}</a>
              </Modal>),
          }, {
            title: '回复',
            dataIndex: 'hf',
            key: 'hf',
            width: 100,
            render: (text, record) => (
              <Modal title="二级表" record={record} cs={'hf'}>
                <a>{text ? text : ''}</a>
              </Modal>),
          }, {
            title: '承办人',
            dataIndex: 'cbrxm',
            key: 'cbrxm',
            width: 100
          }, {
            title: '单位名称',
            dataIndex: 'dwmc',
            key: 'dwmc',
          }
        ];
        return bafkqk;
        break;
      case '诉判比对完成情况表':
        const spbdwcqk = [
          {
            title: '序号',
            dataIndex: 'xh',
            key: 'xh',
            width: 50,
            render: (text, record) => <span>{ text === '江苏省人民检察院' ? '江苏省院' : text }</span>
          }, {
            title: '单位编码',
            dataIndex: 'dwbm',
            key: 'dwbm',
            width: 100
          }, {
            title: '部门受案号',
            dataIndex: 'bmsah',
            key: 'bmsah',
            width: 200
          }, {
            title: '案件名称',
            dataIndex: 'ajmc',
            key: 'ajmc',
            width: 200
          }, {
            title: '受理时间',
            dataIndex: 'sasj',
            key: 'sasj',
            width: 200,
            render: (text, record) => (
              <span>{text && text.split('T')[0]}</span>
            ),
          }, {
            title: '判决时间',
            dataIndex: 'yspjrq',
            key: 'yspjrq',
            width: 200,
            render: (text, record) => (
              <span>{text && text.split('T')[0]}</span>
            ),
          }, {
            title: '判决收到时间',
            dataIndex: 'yspjssdrq',
            key: 'yspjssdrq',
            width: 200,
            render: (text, record) => (
              <span>{text && text.split('T')[0]}</span>
            ),
          },{
            title: '识别',
            dataIndex: 'sb',
            key: 'sb',
            width: 100
          }, {
            title: '处理',
            dataIndex: 'cl',
            key: 'cl',
            width: 100
          },{
            title: '承办人',
            dataIndex: 'cbrxm',
            key: 'cbr',
            width: 100
          }, {
            title: '单位名称',
            dataIndex: 'dwmc',
            key: 'dwmc',
          }
        ];
        const spbdwcqk2 = [
          {
            title: '序号',
            dataIndex: 'xh',
            key: 'xh',
            width: 50
          }, {
            title: '单位代码',
            dataIndex: 'dwbm',
            key: 'dwbm',
            width: 100
          }, {
            title: '部门受案号',
            dataIndex: 'bmsah',
            key: 'bmsah',
            width: 200
          }, {
            title: '案件名称',
            dataIndex: 'ajmc',
            key: 'ajmc',
            width: 200
          }, {
            title: '受理时间',
            dataIndex: 'sasj',
            key: 'sasj',
            width: 200,
            render: (text, record) => (
              <span>{text && text.split('T')[0]}</span>
            ),
          }, {
            title: '判决时间',
            dataIndex: 'yspjrq',
            key: 'yspjrq',
            width: 200,
            render: (text, record) => (
              <span>{text && text.split('T')[0]}</span>
            ),
          }, {
            title: '判决收到时间',
            dataIndex: 'yspjssdrq',
            key: 'yspjssdrq',
            width: 200,
            render: (text, record) => (
              <span>{text && text.split('T')[0]}</span>
            ),
          }, {
            title: '承办人',
            dataIndex: 'cbrxm',
            key: 'cbrxm',
            width: 200
          }, {
            title: '单位名称',
            dataIndex: 'dwmc',
            key: 'dwmc'
          }
        ];
        if (cs === 'pj' || cs === 'sdpj') {
          return spbdwcqk;
        } else {
          return spbdwcqk2;
        }
        break;
      default:
        break;
    }
  };

  subSwitch = () => {
    const {table,cs} = this.state;
    switch (table) {
      case '受案情况表':
        this.setState({
          type:'bajc/countByBajcSub'
        },()=>{
          this.getSubList();
        });
        break;
      case '办结情况表-审查逮捕':
        this.setState({
          type:'bajc/countByBaqkSub'
        },()=>{
          this.getSubList();
        });
        break;
      case '办结情况表-审查起诉':
        this.setState({
          type:'bajc/countByBaqkSub'
        },()=>{
          this.getSubList();
        });
        break;
      case '侦查监督情况表':
        this.setState({
          type:'portal/countByBajdDetail'
        },()=>{
          this.getSubList();
        });
        break;
      case '审判监督情况表':
        this.setState({
          type:'portal/countByBajdDetail'
        },()=>{
          this.getSubList();
        });
        break;
      case '办案反馈情况表':
        this.setState({
          type:'bajc/countByBafkqkSub'
        },()=>{
          this.getSubList();
        });
        break;
      case '诉判比对完成情况表':
        if (cs === 'pj' || cs === 'sdpj') {
          this.setState({
            type:'bajc/countBySpbdqkSub'
          },()=>{
            this.getSubList();
          })
        } else {
          this.setState({
            type:'bajc/countBySpbdqkSubsec'
          },()=>{
            this.getSubList();
          })
        }
        break;
      default:
        break;
    }
  };

  getSubList = (page) => {
    const {dispatch} = this.props;
    const {searchValue, dwbm,table,type,record,cs} = this.state;
    const ajlb = table === '办结情况表-审查逮捕' ? ['ZJ'] : table === '办结情况表-审查起诉' ? ['GS'] : searchValue.ajlb;

    dispatch({
      type: type,
      payload: {
        pagination: {
          page: page ? page.current - 1 > 0 ? page.current - 1 : 0 : 0,
          size: page ? page.pageSize : 10,
        },
        query: {
          cbrgh: record.cbrgh||null,
          ajlb: ajlb,
          ysay: searchValue.ysay,
          sasjStart: searchValue.start,
          sasjEnd: searchValue.end,
          bjsjStart: "",
          bjsjEnd: "",
          dwbm: record.dwbm || dwbm,
          field: cs
        }
      }
    }).then(({data, success}) => {
      if (success && data) {
        this.setState({
          list: data.list,
          pagination: {
            total: data.total || 0,
            current: page ? page.current : 0,
            pageSize: page ? page.pageSize : 10,
          }
        })
      }
    })
  };

  render() {
    const {dispatch, tjfx, loading} = this.props;
    const {treeList} = tjfx;
    const {searchValue, haveChild, dwmc, table,pagination, tableLevel, columns, list} = this.state;

    const ColumnsData = {
      title: `刑事办案智能辅助系统办案情况检查表(${table})`,
      columns: columns,
      scroll: table === '诉判比对完成情况表' && tableLevel === 2 ? 2000 : 1500,
      pagination:tableLevel === 2 ? pagination : {}
    };
    const MainList = {
      dispatch,
      list: list,
      dwmc,
      // loading,
      ajlb: searchValue.ajlb,
      tableLevel,
      treeList,
      haveChild,
      ColumnsData,
      getSubList:this.getSubList,
      treeSelect: this.treeSelect,
      onSearch: this.onSearch,
      onTableChange: this.onTableChange,
      onBack: this.onBack,
    };

    return (
      <Main {...MainList} />
    );
  }
}
