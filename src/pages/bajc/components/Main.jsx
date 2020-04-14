import React, {Component, Fragment} from 'react';
import {Icon, Button, Row, Col, Card, Select} from 'antd';
import classnames from 'classnames';
import PageHeaderLayout from 'lib/Layout/PageHeaderLayout';
import TreeLayout from 'lib/Layout/TreeLayout';
import Search from './Search';
import _ from 'lodash';
import SearchTree from '../../../components/Tree/SearchTree';
import Table from '../../../components/TJFX/Table';
import {INTEGRATE} from '../../../constant/index';
import styles from '../../../components/TJFX/HzMain.less';

const Option = Select.Option;

export default class TJFX extends Component {

  constructor(props) {
    super(props);
    this.state = {
      searchValue: '',
      fullScreen: false,
      expandForm: false,
    };
  }

  // 搜索条件展开
  onExpandForm = (values) => {
    this.setState({
      expandForm: !values,
    });
  };

  // 构建树
  buildTreeData = (departments) => {
    let treeNode = [];
    if (departments) {
      let nodeMap = {};
      departments.map(d => {
        const a = d.dwbm.split('');
        let node = {};
        if (a[4] === '0' && a[5] === '0') {
          if (a[2] === '0' && a[3] === '7') {
            node = {
              name: d.dwmc,
              value: d.dwbm,
              id: d.dwbm,
            };
          } else {
            const b = d.dwmc.split('');
            node = {
              name: b[0] + b[1] + b[2],
              value: d.dwbm,
              id: d.dwbm,
            };
          }
        } else {
          node = {
            name: d.dwmc,
            value: d.dwbm,
            id: d.dwbm,
          };
        }
        nodeMap[node.value] = node;
      });
      departments.map(d => {
        let parent = nodeMap[d.fdwbm];
        let node = nodeMap[d.dwbm];
        if (parent) {
          if (!parent.children) {
            let node1 = {};
            if (parent.name === '江苏省') {
              node1 = {
                name: '江苏省院',
                value: parent.value,
                id: parent.id + '_1',
              };
            } else {
              node1 = {
                name: parent.name + '院',
                value: parent.value,
                id: parent.id + '_1',
              };
            }
            parent.children = [node1];
          }
          parent.children.push(node);
        }

        if (d.dwjb === '2') {
          treeNode.push(node);
        }
      });

    }
    return treeNode;
  };

  // 全屏切换
  showModal = () => {
    this.setState({fullScreen: !this.state.fullScreen});
  };

  //表格切换
  onTableChange = (value) => {
    this.props.onTableChange(value);
  };

  onBack = () => {

  }

  render() {
    const {dwmc, dispatch, onSearch, treeSelect, treeList, list, ColumnsData, loading, ajlb, tableLevel, onBack} = this.props;
    const {expandForm, fullScreen} = this.state;
    const SearchList = {
      dispatch,
      onSearch: onSearch,
      onExpandForm: this.onExpandForm,
    };
    const SearchTreeList = {
      // loadData: this.loadData,
      tree: this.buildTreeData(treeList),
      expandRoot: [],
      onSelect: treeSelect,
    };
    const h = document.body.clientHeight;
    const TableList = {
      onChange: (page, filters, sorter) => {
        if(this.props.tableLevel === 2){
            this.props.getSubList(page)
        }
      },
      pagination:this.props.tableLevel === 2 ? ColumnsData.pagination: false,
      loading: loading,
      list: list,
      columns: ColumnsData.columns,
      scroll: ColumnsData.scroll ? {
        x: ColumnsData.scroll,
        y: fullScreen ? expandForm ? h - 322 : h - 236 : expandForm ? h - 462 : h - 376
      } :
        {y: fullScreen ? expandForm ? h - 322 : h - 236 : expandForm ? h - 462 : h - 376},
    };

    const content = (
      <Fragment>
        <div className={classnames(styles.mask, fullScreen ? styles.fullScreen : '')}/>
        <Card
          className={classnames(styles.default, INTEGRATE ? styles.integrate : '', fullScreen ? styles.fullScreen : '')}>
          {
            !INTEGRATE && <Button className={styles.trigger}
                                  type='ghost'
                                  onClick={this.showModal}
                                  icon={fullScreen ? 'shrink' : 'arrows-alt'}/>
          }
          <TreeLayout tree={<SearchTree {...SearchTreeList} />} className={styles.content}>
            <div style={{width: '100%', padding: '10px'}}>
              <Row className={styles.title}>
                <Col span={6}>
                  <div style={{fontWeight: 'bold', paddingTop: 8, marginLeft: 20}}>
                    {tableLevel === 2 ?
                      <Button type='primary'
                              style={{marginRight: 20}}
                              onClick={onBack}
                      >返回</Button> : ''}
                    <span>&nbsp;&nbsp;{dwmc}</span>
                  </div>
                </Col>
                <Col span={12} style={{color: '#286BC8'}}>
                  <div style={{fontWeight: 'bold', paddingTop: 8, textAlign: 'center'}}>
                    {ColumnsData.title}
                  </div>
                </Col>
                <Col span={6}>
                  <Select defaultValue="受案情况表" onChange={this.onTableChange}
                          style={{width: '60%', float: 'right', paddingTop: 8}}>
                    <Option value={'受案情况表'}>受案情况表</Option>
                    {_.indexOf(ajlb, 'ZJ') !== -1 ? <Option value={'办结情况表-审查逮捕'}>办结情况表-审查逮捕</Option> : ''}
                    {_.indexOf(ajlb, 'GS') !== -1 ? <Option value={'办结情况表-审查起诉'}>办结情况表-审查起诉</Option> : ''}
                    <Option value={'侦查监督情况表'}>侦查监督情况表</Option>
                    <Option value={'审判监督情况表'}>审判监督情况表</Option>
                    <Option value={'办案反馈情况表'}>办案反馈情况表</Option>
                    <Option value={'诉判比对完成情况表'}>诉判比对完成情况表</Option>
                  </Select>
                </Col>
              </Row>
              <Search {...SearchList} />
              <Table {...TableList} />
            </div>
          </TreeLayout>
        </Card>
      </Fragment>
    );

    if (INTEGRATE) {
      return content;
    }

    return (
      <PageHeaderLayout>
        {content}
      </PageHeaderLayout>
    );
  }
}
