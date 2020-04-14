import React, {Component, Fragment} from 'react';
import { Button, Row, Col} from 'antd';
import classnames from 'classnames';
import PageHeaderLayout from 'lib/Layout/PageHeaderLayout';
import TreeLayout from 'lib/Layout/TreeLayout';
import Search from './Search';
import SearchTree from '../../../components/Tree/SearchTree';
import Table from '../../../components/TJFX/Table';
import {INTEGRATE} from '../../../constant';
import styles from './Main.less';

export default class TJFX extends Component {

  constructor(props) {
    super(props);
    this.state = {
      fullScreen: false,
      expandForm: false,
    };
  }

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

  //导出
  onExport = (values) => {
    this.props.dispatch({
      type: 'tjfx/jyJlDccc',
      payload: {
        ...values,
        dwbm:"",
        startTime:`${values.startTime.format('YYYY-MM-DD')}T00:00:00`,
        endTime:`${values.endTime.format('YYYY-MM-DD')}T00:00:00`
      }
    })
  };

  // 全屏切换
  showModal = () => {
    this.setState({fullScreen: !this.state.fullScreen});
  };

  render() {
    const {dwmc, dispatch, treeList, list, ColumnsData, loading, onSearch, treeSelect, searchValue,onTableChange,pagination} = this.props;
    const {fullScreen, expandForm} = this.state;
    const SearchList = {
      dispatch, searchValue,
      onSearch: onSearch,
      onExport:this.onExport,
      onExpandForm: this.onExpandForm,
    };
    const SearchTreeList = {
      tree: this.buildTreeData(treeList),
      expandRoot: [],
      onSelect: treeSelect,
    };
    const h = document.body.clientHeight;
    const TableList = {
      loading,
      list,
      pagination,
      columns: ColumnsData.columns,
      onChange: (page, filters, sorter) => {
        onTableChange && onTableChange(page);
      },
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
          {/*<TreeLayout tree={<SearchTree {...SearchTreeList} />} className={styles.content}>*/}
          <div style={{width: '100%', padding: '10px'}}>
            <Row className={styles.title}>
              <Col span={4}>
                <div style={{fontWeight: 'bold', paddingTop: 8}}>
                  {/*<span>&nbsp;&nbsp;{dwmc}</span>*/}
                  <span>&nbsp;&nbsp;</span>
                </div>
              </Col>
              <Col span={16} style={{color: '#286BC8'}}>
                <div className={styles.titlehide}>
                  {ColumnsData.title}
                </div>
              </Col>
            </Row>
            <Search {...SearchList} />
            <Table {...TableList} />
          </div>
          {/*</TreeLayout>*/}
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

