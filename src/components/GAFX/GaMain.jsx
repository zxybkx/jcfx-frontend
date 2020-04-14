import React, {Component, Fragment} from 'react';
import {Icon, Button, Row, Col, Card } from 'antd';
import classnames from 'classnames';
import PageHeaderLayout from 'lib/Layout/PageHeaderLayout';
import TreeLayout from 'lib/Layout/TreeLayout';
import Search from './GaSearch';
import SearchTree from '../Tree/SearchTree';
import Table from '../TJFX/Table';
import {INTEGRATE} from '../../constant/index';
import styles from '../TJFX/HzMain.less';

export default class TJFX extends Component {

  constructor(props) {
    super(props);
    this.state = {
      searchValue: '',
      fullScreen: false,
      expandForm: false,
      showCharts: false,
    };
  }

  // 返回
  onBack = (values) => {
    const {onBack} = this.props;
    onBack(values);
  };

  // 搜索条件展开
  onExpandForm = (values) => {
    this.setState({
      expandForm: !values,
    });
  };

  // 搜索
  onSearch = (values) => {
    const {onSearch} = this.props;
    onSearch(values);
  };

  // 构建树
  buildTreeData = (departments) => {
    let treeNode = [];
    if (departments) {
      let nodeMap = {};
      departments.map(d => {
        const a=d.dwbm.split('');
        let node = {};
        if(a[4]==='0'&&a[5]==='0'){
          if(a[2]==='0'&&a[3]==='7'){
            node = {
              name: d.dwmc,
              value: d.dwbm,
              id: d.dwbm,
            };
          }else {
            const b=d.dwmc.split('');
            node = {
              name: b[0]+b[1]+b[2],
              value: d.dwbm,
              id: d.dwbm,
            };
          }
        }else {
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
            if(parent.name==='江苏省'){
              node1 = {
                name: '江苏省院',
                value: parent.value,
                id: parent.id+'_1',
              };
            }else {
              node1 = {
                name: parent.name+'院',
                value: parent.value,
                id: parent.id+'_1',
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

  // 树选择
  onSelect = (values) => {
      const {dispatch}=this.props;
      dispatch({
        type: 'tjfx/getCbrTree',
        payload: {
          dwbm: values.value
        }
      });
    const {treeSelect} = this.props;
    treeSelect(values);
  };

  // 全屏切换
  showModal = () => {
    this.setState({fullScreen: !this.state.fullScreen});
  };

  render() {
    const { jcgmc, dispatch, treeList, list, pagination, ColumnsData, loading, cbrTreeList, searchValue, gh, back}  = this.props;
    const { expandForm, fullScreen, showCharts} = this.state;
    const SearchList = {
      cbrTreeList,
      dispatch,
      onSearch: this.onSearch,
      onExpandForm: this.onExpandForm,
      searchValue,
      gh
    };
    const SearchTreeList = {
      // cbrTreeList:  this.buildCbrTreeData(cbrTreeList),
      tree: this.buildTreeData(treeList),
      expandRoot: [],
      onSelect: this.onSelect,
    };
    const h = document.body.clientHeight;
    const TableList = {
      onChange: (page,filters,sorter) => {
        dispatch({
          type: 'tjfx/getByJcgga',
          payload: {
            pagination:{
              page: page.current - 1 > 0 ? page.current - 1 : 0,
              size: page.pageSize,
              sort: sorter.field ? sorter.field + ',' + (sorter.order === 'ascend' ? 'asc' : 'desc') : '',
            }
          },
        });
      },
      loading: loading,
      list: list,
      columns: ColumnsData.columns,
      scroll:INTEGRATE?
        ColumnsData.scroll?{x: ColumnsData.scroll, y: expandForm ? h - 390 : h - 300}: { y:expandForm ? h - 390 : h - 300}:
        ColumnsData.scroll?{x: ColumnsData.scroll, y: fullScreen ? expandForm ? h - 410  : h - 320  : expandForm ? h - 500 : h - 410}:
          { y: fullScreen ? expandForm ? h - 410  : h - 320  : expandForm ? h - 500 : h - 410},
      pagination: pagination,
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
                    <span>{ back ?<Button type="primary" onClick={this.onBack}>返回</Button>:''}&nbsp;&nbsp;{jcgmc}</span>
                  </div>
                </Col>
                <Col span={12} style={{color: '#286BC8'}}>
                  <div className={styles.titlehide}>
                    {ColumnsData.title}
                  </div>
                </Col>
              </Row>
              <Search {...SearchList} />
              {
                showCharts ? <div>1234</div> : <Table {...TableList} />
              }
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
