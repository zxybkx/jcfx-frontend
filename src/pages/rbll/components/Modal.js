import React, {Component} from 'react';
import {Table, Form} from 'antd';
import {routerRedux} from 'dva/router';
import {CONTEXT} from '../../../constant';
import Window from './Window';
import {buildEmptyData} from '../../../utils/utils';
import styles from './Table.less';

class UserEditModal extends Component {

  constructor(props) {
    super(props);
    this.state = {
      visible: this.props.field && this.props.field === this.props.title && this.props.visible,
      modelList: [],
      page: this.props.page ? this.props.page : 1,
      size: this.props.size ? this.props.size : 10,
      total: 0,
      pagination: {},
      name: '',
    };
  }

  componentDidMount() {
    if (this.props.field && this.props.field === this.props.title) {
      this.onChange();
    }
  }

  showModelHandler = (e) => {
    this.setState({
      visible: true,
      page: 1
    }, () => {
      if (e) e.stopPropagation();
      this.onChange();
    });
  };

  onChange = () => {
    const {dispatch, title, dwbm, rbTime, ysay, startTime, endTime, newsearchValue} = this.props;
    const {page, size} = this.state;
    dispatch({
      type: 'tjfx/getRbBaqk',
      payload: {
        pagination: {
          page: page - 1,
          size: size,
        },
        query: {
          ...newsearchValue,
          ysay: ysay,
          dwbm: dwbm,
          field: title,
        }
      },
    }).then(({list, success}) => {
      if (list && success) {
        const arr = [];
        _.map(list.list, (v, k) => {
          let data = {
            name: k,
            value: v
          };
          arr.push(data)
        });
        this.setState({
          modelList: title.indexOf('未适用认罪认罚人数_GS') > -1 ? arr : list.list,
          total: list.total && list.total,
        })
      }
    });
  };

  hideModelHandler = () => {
    this.setState({
      visible: false,
      page: 1,
      name: ''
    });
  };

  okHandler = () => {
    this.hideModelHandler();
  };

  exportFile = (fieId) => {
    const {dispatch, dwbm, ysay, startTime, endTime} = this.props;
    dispatch({
      type: 'tjfx/exportRblb',
      payload: {
        sasjStart: startTime,
        sasjEnd: endTime,
        dwbm: dwbm,
        field: fieId,
        ysay: ysay
      }
    })
  };

  onClick = (record) => {
    const {dispatch, dwmc, dwbm, rbTime, ysay, startTime, endTime, newsearchValue, title} = this.props;
    const {page, size} = this.state;
    if (record.name) {
      this.setState({
        visible: true,
        name: record.name
      });
      dispatch({
        type: 'tjfx/getRbBaqk',
        payload: {
          pagination: {
            page: page - 1,
            size: size,
          },
          query: {
            ...newsearchValue,
            ysay: ysay,
            dwbm: dwbm,
            field: record.name,
          }
        },
      }).then(({list, success}) => {
        if (list && success) {
          this.setState({
            modelList: list.list,
            total: list.total && list.total,
          })
        }
      });
    }
    if (!record.name) {
      if (this.props.ajlb === 'SP') {
        dispatch(
          routerRedux.push({
            pathname: `${CONTEXT}/ajcx`,
            query: {
              path: 'rbll',
              dwbm,
              dwmc,
              rbTime,
              startTime,
              newsearchValue,
              page,
              size,
              field: title,
              endTime,
              ysay,//返回时使用
              searchValue: {
                ajlb: 'sp',
                ysay: record.ysay,
              },     //共用
              bmsah: record.bmsah,
              cbrgh: record.cbrgh,
              ajcxdwbm: record.dwbm,
              ajcxdwmc: record.dwmc,
              ajlb: this.props.ajlb ? this.props.ajlb : '',
              // visible: false
            },
          })
        );
      } else {
        dispatch(
          routerRedux.push({
            pathname: `${CONTEXT}/ajcx`,
            query: {
              path: 'rbll',
              dwbm,
              dwmc,
              rbTime,
              startTime,
              newsearchValue,
              page,
              size,
              field: title,
              endTime,
              ysay,//返回时使用
              searchValue: {
                ajlb: 'nosp',
                ysay: record.ysay,
              },     //共用
              bmsah: record.bmsah,
              cbrgh: record.cbrgh,
              ajcxdwbm: record.dwbm,
              ajcxdwmc: record.dwmc,
              ajlb: this.props.ajlb ? this.props.ajlb : '',
              // visible: false
            },
          })
        );
      }
    }

  };

  render() {
    const {children, title} = this.props;
    const {modelList, pagination, visible, total, page, size, name} = this.state;
    let columns = [];

    if (title.indexOf('无罪判决人数_SP') > -1) {
      columns = [
        {
          title: '序号',
          key: 'xh',
          width: 50,
          render: (text, record, index) => {
            const num = (page - 1) * size + index + 1;
            if (record.dwbm) {
              return (<span>{num}</span>)
            }

          }
        }, {
          title: '部门受案号',
          dataIndex: 'bmsah',
          key: 'bmsah',
          width: 200,
        }, {
          title: '案件名称',
          dataIndex: 'ajmc',
          key: 'ajmc',
          width: 140,
        }, {
          title: '受案日期',
          dataIndex: 'sasj',
          key: 'sasj',
          width: 100,
          render: (text, record) => (
            <span>{text && text.split('T')[0]}</span>
          ),
        }, {
          title: '办结日期',
          dataIndex: 'bjsj',
          key: 'bjsj',
          width: 100,
          render: (text, record) => (
            <span>{text && text.split('T')[0]}</span>
          ),
        }, {
          title: '承办人',
          dataIndex: 'cbrxm',
          key: 'cbrxm',
          width: 80,
        }, {
          title: '单位名称',
          dataIndex: 'dwmc',
          key: 'dwmc',
          width: 100,
        }, {
          title: '人数',
          dataIndex: 'rs',
          key: 'rs',
          width: 100,
        }
      ];
    } else if (title.indexOf('判决人数_SP') > -1) {
      columns = [
        {
          title: '序号',
          key: 'xh',
          width: 50,
          render: (text, record, index) => {
            const num = (page - 1) * size + index + 1;
            if (record.dwbm) {
              return (<span>{num}</span>)
            }

          }
        }, {
          title: '部门受案号',
          dataIndex: 'bmsah',
          key: 'bmsah',
          width: 200,
        }, {
          title: '案件名称',
          dataIndex: 'ajmc',
          key: 'ajmc',
          width: 140,
        }, {
          title: '受案日期',
          dataIndex: 'sasj',
          key: 'sasj',
          width: 100,
          render: (text, record) => (
            <span>{text && text.split('T')[0]}</span>
          ),
        }, {
          title: '办结日期',
          dataIndex: 'bjsj',
          key: 'bjsj',
          width: 100,
          render: (text, record) => (
            <span>{text && text.split('T')[0]}</span>
          ),
        }, {
          title: '承办人',
          dataIndex: 'cbrxm',
          key: 'cbrxm',
          width: 80,
        }, {
          title: '单位名称',
          dataIndex: 'dwmc',
          key: 'dwmc',
          width: 100,
        }, {
          title: '人数',
          dataIndex: 'rs',
          key: 'rs',
          width: 100,
        }
      ];
    } else if (title.indexOf('诉判超期未比对人数_SP') > -1 || title.indexOf('诉判比对人数_SP') > -1 || title.indexOf('当日超期人数_SP') > -1 || title.indexOf('积存超期人数_SP') > -1 || name) {
      columns = [
        {
          title: '序号',
          key: 'xh',
          width: 50,
          render: (text, record, index) => {
            const num = (page - 1) * size + index + 1;
            if (record.dwbm) {
              return (<span>{num}</span>)
            }
          }
        }, {
          title: '部门受案号',
          dataIndex: 'bmsah',
          key: 'bmsah',
          width: 200,
        }, {
          title: '案件名称',
          dataIndex: 'ajmc',
          key: 'ajmc',
          width: 140,
        }, {
          title: '受案日期',
          dataIndex: 'sasj',
          key: 'sasj',
          width: 100,
          render: (text, record) => (
            <span>{text && text.split('T')[0]}</span>
          ),
        }, {
          title: '办结日期',
          dataIndex: 'bjsj',
          key: 'bjsj',
          width: 100,
          render: (text, record) => (
            <span>{text && text.split('T')[0]}</span>
          ),
        }, {
          title: '承办人',
          dataIndex: 'cbrxm',
          key: 'cbrxm',
          width: 80,
        }, {
          title: '单位名称',
          dataIndex: 'dwmc',
          key: 'dwmc',
          width: 100,
        }, {
          title: '人数',
          dataIndex: 'rs',
          key: 'rs',
          width: 100,
        }
      ];
    } else if (title.indexOf('违法点个数') > -1) {
      columns = [
        {
          title: '序号',
          key: 'xh',
          width: 50,
          render: (text, record, index) => {
            const num = (page - 1) * size + index + 1;
            if (record.dwbm) {
              return (<span>{num}</span>)
            }

          }
        }, {
          title: '部门受案号',
          dataIndex: 'bmsah',
          key: 'bmsah',
          width: 200,
        }, {
          title: '案件名称',
          dataIndex: 'ajmc',
          key: 'ajmc',
          width: 140,
        }, {
          title: '受案日期',
          dataIndex: 'sasj',
          key: 'sasj',
          width: 100,
          render: (text, record) => (
            <span>{text && text.split('T')[0]}</span>
          ),
        }, {
          title: '办结日期',
          dataIndex: 'bjsj',
          key: 'bjsj',
          width: 100,
          render: (text, record) => (
            <span>{text && text.split('T')[0]}</span>
          ),
        }, {
          title: '承办人',
          dataIndex: 'cbrxm',
          key: 'cbrxm',
          width: 80,
        }, {
          title: '单位名称',
          dataIndex: 'dwmc',
          key: 'dwmc',
          width: 100,
        }, {
          title: '个数',
          dataIndex: 'gs',
          key: 'gs',
          width: 80,
        }
      ];
    } else if (title.indexOf('案卷总数') > -1) {
      columns = [
        {
          title: '序号',
          key: 'xh',
          width: 50,
          render: (text, record, index) => {
            const num = (page - 1) * size + index + 1;
            if (record.dwbm) {
              return (<span>{num}</span>)
            }

          }
        }, {
          title: '部门受案号',
          dataIndex: 'bmsah',
          key: 'bmsah',
          width: 200,
        }, {
          title: '案件名称',
          dataIndex: 'ajmc',
          key: 'ajmc',
          width: 140,
        }, {
          title: '受案日期',
          dataIndex: 'sasj',
          key: 'sasj',
          width: 100,
          render: (text, record) => (
            <span>{text && text.split('T')[0]}</span>
          ),
        }, {
          title: '办结日期',
          dataIndex: 'bjsj',
          key: 'bjsj',
          width: 100,
          render: (text, record) => (
            <span>{text && text.split('T')[0]}</span>
          ),
        }, {
          title: '承办人',
          dataIndex: 'cbrxm',
          key: 'cbrxm',
          width: 80,
        }, {
          title: '单位名称',
          dataIndex: 'dwmc',
          key: 'dwmc',
          width: 100,
        }, {
          title: '册数',
          dataIndex: 'gs',
          key: 'gs',
          width: 80,
        }
      ];
    } else if (title.indexOf('违法点（审判监督）个数_GS') > -1 ||
      title.indexOf('诉判不一个数_SP') > -1 || title.indexOf('违法点（审判监督）个数_SP') > -1 || title.indexOf('改变事实_SP') > -1 || title.indexOf('改变定性_SP') > -1 || title.indexOf('改变量刑_SP') > -1 || title.indexOf('诉判不一（其他）_SP') > -1 || title.indexOf('书面纠违') > -1 || title.indexOf('检察建议') > -1 || title.indexOf('口头纠违') > -1) {
      columns = [
        {
          title: '序号',
          key: 'xh',
          width: 50,
          render: (text, record, index) => {
            const num = (page - 1) * size + index + 1;
            if (record.dwbm) {
              return (<span>{num}</span>)
            }

          }
        }, {
          title: '部门受案号',
          dataIndex: 'bmsah',
          key: 'bmsah',
          width: 200,
        }, {
          title: '案件名称',
          dataIndex: 'ajmc',
          key: 'ajmc',
          width: 140,
        }, {
          title: '受案日期',
          dataIndex: 'sasj',
          key: 'sasj',
          width: 100,
          render: (text, record) => (
            <span>{text && text.split('T')[0]}</span>
          ),
        }, {
          title: '办结日期',
          dataIndex: 'bjsj',
          key: 'bjsj',
          width: 100,
          render: (text, record) => (
            <span>{text && text.split('T')[0]}</span>
          ),
        }, {
          title: '承办人',
          dataIndex: 'cbrxm',
          key: 'cbrxm',
          width: 80,
        }, {
          title: '单位名称',
          dataIndex: 'dwmc',
          key: 'dwmc',
          width: 100,
        }, {
          title: '个数',
          dataIndex: 'gs',
          key: 'gs',
          width: 80,
        }
      ];
    } else if (title.indexOf('_SP') > -1) {
      columns = [
        {
          title: '序号',
          key: 'xh',
          width: 50,
          render: (text, record, index) => {
            const num = (page - 1) * size + index + 1;
            if (record.dwbm) {
              return (<span>{num}</span>)
            }

          }
        }, {
          title: '部门受案号',
          dataIndex: 'bmsah',
          key: 'bmsah',
          width: 200,
        }, {
          title: '案件名称',
          dataIndex: 'ajmc',
          key: 'ajmc',
          width: 140,
        }, {
          title: '受案日期',
          dataIndex: 'sasj',
          key: 'sasj',
          width: 100,
          render: (text, record) => (
            <span>{text && text.split('T')[0]}</span>
          ),
        }, {
          title: '办结日期',
          dataIndex: 'bjsj',
          key: 'bjsj',
          width: 100,
          render: (text, record) => (
            <span>{text && text.split('T')[0]}</span>
          ),
        }, {
          title: '承办人',
          dataIndex: 'cbrxm',
          key: 'cbrxm',
          width: 80,
        }, {
          title: '单位名称',
          dataIndex: 'dwmc',
          key: 'dwmc',
          width: 100,
        }
      ];
    } else if (title.indexOf('人数') > -1) {
      if (title.indexOf('未适用认罪认罚人数_GS') > -1) {
        columns = [
          {
            title: '类型',
            dataIndex: 'name',
            render: (text, record, index) => {
              if (text === '其他理由') {
                text = '其他'
              }
              return text
            }
          },
          {
            title: '人数',
            dataIndex: 'value',
          }
        ]
      } else {
        columns = [
          {
            title: '序号',
            key: 'xh',
            width: 50,
            render: (text, record, index) => {
              const num = (page - 1) * size + index + 1;
              if (record.dwbm) {
                return (<span>{num}</span>)
              }
            }
          }, {
            title: '部门受案号',
            dataIndex: 'bmsah',
            key: 'bmsah',
            width: 200,
          }, {
            title: '案件名称',
            dataIndex: 'ajmc',
            key: 'ajmc',
            width: 140,
          }, {
            title: '受案日期',
            dataIndex: 'sasj',
            key: 'sasj',
            width: 100,
            render: (text, record) => (
              <span>{text && text.split('T')[0]}</span>
            ),
          }, {
            title: '办结日期',
            dataIndex: 'bjsj',
            key: 'bjsj',
            width: 100,
            render: (text, record) => (
              <span>{text && text.split('T')[0]}</span>
            ),
          }, {
            title: '承办人',
            dataIndex: 'cbrxm',
            key: 'cbrxm',
            width: 80,
          }, {
            title: '单位名称',
            dataIndex: 'dwmc',
            key: 'dwmc',
            width: 100,
          }, {
            title: '人数',
            dataIndex: 'rs',
            key: 'rs',
            width: 80,
          }
        ];
      }
    } else {
      columns = [
        {
          title: '序号',
          key: 'xh',
          width: 50,
          render: (text, record, index) => {
            const num = (page - 1) * size + index + 1;
            if (record.dwbm) {
              return (<span>{num}</span>)
            }
          }
        }, {
          title: '部门受案号',
          dataIndex: 'bmsah',
          key: 'bmsah',
          width: 200,
        }, {
          title: '案件名称',
          dataIndex: 'ajmc',
          key: 'ajmc',
          width: 140,
        }, {
          title: '受案日期',
          dataIndex: 'sasj',
          key: 'sasj',
          width: 100,
          render: (text, record) => (
            <span>{text && text.split('T')[0]}</span>
          ),
        }, {
          title: '办结日期',
          dataIndex: 'bjsj',
          key: 'bjsj',
          width: 100,
          render: (text, record) => (
            <span>{text && text.split('T')[0]}</span>
          ),
        }, {
          title: '承办人',
          dataIndex: 'cbrxm',
          key: 'cbrxm',
          width: 80,
        }, {
          title: '单位名称',
          dataIndex: 'dwmc',
          key: 'dwmc',
          width: 100,
        }
      ];
    }
    ;
    const windowProps = {
      title: name ? name : title,
      visible,
      onClose: this.hideModelHandler,
      onResize: (w, h) => {
        this.table && this.table.resize && this.table.resize();
      },
      exportFile: this.exportFile
    };
    // const _list = modelList.concat(buildEmptyData(columns, 10 - modelList.length));
    const _pagination =
      {
        current: page,
        pageSize: size,
        total: total,
        showSizeChanger: true,
        showTotal: () => `共 ${total} 个`,
        size: "normal",
      };

    return (
      <span>
        <span onClick={this.showModelHandler}>
          {children}
        </span>
        <Window  {...windowProps}
                 ref={c => this.container = c}
                 height={document.body.clientHeight * 0.7}
        >
          <Table
            rowKey={record => Math.random()}
            rowClassName={(record, index) => {
              if (index % 2 === 1) {
                return styles.osh;
              }
            }}
            bordered
            pagination={_pagination}
            columns={columns}
            dataSource={modelList}
            onChange={(page, filters, sorter) => {
              this.setState({
                page: page.current,
                size: page.pageSize
              }, () => {
                this.onChange();
              })
            }}
            onRow={(record) => {
              return {
                onClick: () => this.onClick(record)
              }
            }}
          />
        </Window>
      </span>
    );
  }
}

export default Form.create()(UserEditModal);
