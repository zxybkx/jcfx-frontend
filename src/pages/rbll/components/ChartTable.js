import React, {Component} from 'react';
import {Table, Form} from 'antd';
import styles from './Table.less';
import {routerRedux} from 'dva/router';
import {CONTEXT} from '../../../constant';

export default class ChartTable extends Component {
  state = {
    modelList: [],
    page: this.props.page ? this.props.page : 1,
    size: this.props.size ? this.props.size : 10,
    total: 0,
    pagination: {},
  };

  componentDidMount() {
    this.onChange();
  }

  onChange = () => {
    const {ModelList: {dispatch, dwbm, newsearchValue, ysay,}, title} = this.props;
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
        })
        this.setState({
          modelList: title.indexOf('未适用认罪认罚人数_GS') > -1 ? arr : list.list,
          total: list.total && list.total,
        })
      }
    });

  };
  onClick = (record) => {
    const {ModelList: {dispatch, dwmc, dwbm, rbTime, ysay, startTime, endTime, newsearchValue}, title, type} = this.props;
    const {page, size} = this.state;
    if (this.props.ajlb === 'SP') {
      dispatch(
        routerRedux.push({
          pathname: `${CONTEXT}/ajcx`,
          query: {
            queryType: type,
            path: 'rbll',
            dwbm,
            dwmc,
            rbTime,
            startTime,
            newsearchValue,
            page,
            size,
            // field: title,
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
            ajlb: this.props.ajlb ? this.props.ajlb : ''
          },
        })
      );
    } else {
      dispatch(
        routerRedux.push({
          pathname: `${CONTEXT}/ajcx`,
          query: {
            queryType: type,
            path: 'rbll',
            dwbm,
            dwmc,
            rbTime,
            startTime,
            newsearchValue,
            page,
            size,
            // field: title,
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
            ajlb: this.props.ajlb ? this.props.ajlb : ''
          },
        })
      );
    }
  };

  render() {
    const {modelList, page, size, total} = this.state;
    const {title} = this.props;
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
    } else if (title.indexOf('诉判超期未比对人数_SP') > -1 || title.indexOf('诉判比对人数_SP') > -1 || title.indexOf('当日超期人数_SP') > -1 || title.indexOf('积存超期人数_SP') > -1) {
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
    } else if (title.indexOf('违法点个数') > -1 || title.indexOf('诉判不一（其他）_SP') > -1 || title.indexOf('改变量刑_SP') > -1 || title.indexOf('改变定性_SP') > -1 || title.indexOf('改变事实_SP') > -1 || title.indexOf('口头纠违') > -1 || title.indexOf('书面纠违') > -1 || title.indexOf('检察建议') > -1 || title.indexOf('抗诉_SP') > -1) {
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
    } else if (title.indexOf('违法点（审判监督）个数_GS') > -1 || title.indexOf('违法点（审判监督）个数_SP') > -1) {
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
    } else if (title.indexOf('人数') > -1 || title.indexOf('犯罪嫌疑人不认罪_GS') > -1 || title.indexOf('犯罪嫌疑人认罪不认罚_GS') > -1 ||
      title.indexOf('值班律师未到位_GS') > -1 || title.indexOf('辩护人作无罪辩护_GS') > -1 || title.indexOf('有影响刑事诉讼活动正常进行的活动_GS') > -1 ||
      title.indexOf('犯罪性质恶劣、犯罪手段残忍、社会危害严重_GS') > -1 || title.indexOf('犯罪嫌疑人自愿放弃_GS') > -1 ||
      title.indexOf('未就赔偿谅解达成一致_GS') > -1 || title.indexOf('移送单位撤回_GS') > -1 || title.indexOf('其他理由_GS') > -1) {
      if (title.indexOf('未适用认罪认罚人数_GS') > -1) {
        columns = [
          {
            title: '类型',
            dataIndex: 'name',
          },
          {
            title: '人数',
            dataIndex: 'value'
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
      <Table
        rowKey={record => Math.random()}
        rowClassName={(record, index) => {
          if (index % 2 === 1) {
            return styles.osh;
          }
        }}
        bordered
        columns={columns}
        dataSource={modelList}
        pagination={_pagination}
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
    )
  }
}
