import React, {Component, Fragment} from 'react';
import {Icon, Button, Row, Col, Card} from 'antd';
import classnames from 'classnames';
import PageHeaderLayout from 'lib/Layout/PageHeaderLayout';
import TreeLayout from 'lib/Layout/TreeLayout';
import Search from './Search';
import SearchTree from '../../../components/Tree/SearchTree';
import Table from '../../../components/TJFX/Table';
import {INTEGRATE} from '../../../constant/index';
import styles from '../../../components/TJFX/HzMain.less';

export default class TJFX extends Component {

  constructor(props) {
    super(props);
    this.state = {
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

  render() {
    const {dwmc, dispatch, treeList, list, pagination, ColumnsData, loading, cbrTreeList, searchValue, back, onSearch, treeSelect, onBack} = this.props;
    const {expandForm, fullScreen} = this.state;
    const SearchList = {
      cbrTreeList,
      dispatch,
      onSearch: onSearch,
      onExpandForm: this.onExpandForm,
      searchValue,
    };
    const SearchTreeList = {
      tree: this.buildTreeData(treeList),
      expandRoot: [],
      onSelect: treeSelect,
    };
    const h = document.body.clientHeight;
    const TableList = {
      onChange: (page, filters, sorter) => {
        this.props.getAjcxList(page);
      },
      loading,
      list,
      columns: ColumnsData.columns,
      scroll: INTEGRATE ?
        ColumnsData.scroll ? {x: ColumnsData.scroll, y: expandForm ? h - 390 : h - 300} : {y: expandForm ? h - 390 : h - 300} :
        ColumnsData.scroll ?
          {x: ColumnsData.scroll, y: fullScreen ? expandForm ? h - 410 : h - 320 : expandForm ? h - 500 : h - 410} :
          {y: fullScreen ? expandForm ? h - 410 : h - 320 : expandForm ? h - 500 : h - 410},
      pagination,
    };
    const content = (
      <Fragment>
        <div className={classnames(styles.mask, fullScreen ? styles.fullScreen : '')}/>
        <div
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
                  <div style={{fontWeight: 'bold', paddingTop: 8}}>
                    <span>{ back ? <Button type="primary" onClick={onBack}>返回</Button> : ''}&nbsp;&nbsp;{dwmc}</span>
                  </div>
                </Col>
                <Col span={12} style={{color: '#286BC8'}}>
                  <div className={styles.titlehide}>
                    {ColumnsData.title}
                  </div>
                </Col>
              </Row>
              <Search {...SearchList} />
              <Table {...TableList} />
            </div>
          </TreeLayout>
        </div>
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
