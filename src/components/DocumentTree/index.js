import React from 'react';
import {Modal, Tree, Form, Input, Button} from 'antd';
import {ContextMenu, SubMenu, MenuItem, ContextMenuTrigger} from "react-contextmenu";
import Fontawesome from 'react-fontawesome';
import classnames from 'classnames';
import _ from 'lodash';
import styles from './index.less';

const TreeNode = Tree.TreeNode;
const Search = Input.Search;
const FormItem = Form.Item;


const getParentKey = (key, tree) => {
  let parentKey;
  for (let i = 0; i < tree.length; i++) {
    const node = tree[i];
    if (node.children) {
      if (node.children.some(item => item.id === key)) {
        parentKey = node.id;
      } else if (getParentKey(key, node.children)) {
        parentKey = getParentKey(key, node.children);
      }
    }
  }
  return parentKey;
};

let dataList = [];
const generateList = (tree) => {
  for (let i = 0; i < tree.length; i++) {
    const node = tree[i];
    const key = `node-${node.id}`;
    const name = node.name;
    dataList.push({key, name});
    if (node.children) {
      generateList(node.children);
    }
  }
};

const loopExpand = (result, data) => data.map((item) => {
  if (item && item.children) {
    loopExpand(result, item.children)
  }
  result.push(`node-${item.id}`);
});

const generateExpandKeys = (tree, expandRoot, expandKeys, expandAll) => {
  let keys = [];
  if (expandRoot) {
    tree.map((node, index) => {
      keys.push(`node-${node.id}`);
    });
  }

  if (expandKeys) {
    expandKeys.map((k, i) => {
      if (expandAll) {
        let expandNode = tree.filter((node, index) => {
          return node.id === k;
        });
        loopExpand(keys, expandNode);
      } else {
        keys.push(`node-${k}`);
      }
    });
  }

  return keys;
};

class DocumentTree extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      initExpand: props.expandKeys,
      expandRoot: props.expandRoot,
      expandAll: props.expandAll,
      expandedKeys: generateExpandKeys(props.tree, props.expandRoot, props.expandKeys, props.expandAll),
      searchValue: '',
      autoExpandParent: true,
      treeData: props.tree,
      modalVisible: false,
      currentNode: {}
    };
    generateList(props.tree);
  }

  shouldComponentUpdate(nextProps, nextState) {
    return !_.isEqual(this.props, nextProps) || !_.isEqual(this.state, nextState);
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      treeData: nextProps.tree,
      expandedKeys: [...this.state.expandedKeys, ...generateExpandKeys(nextProps.tree, this.state.expandRoot, this.state.initExpand, this.state.expandAll)],
    })
  }

  onExpand = (expandedKeys) => {
    this.setState({
      expandedKeys,
      autoExpandParent: false,
    });
  };

  onChange = (e) => {
    const value = e.target.value;
    const expandedKeys = dataList.map((item) => {
      if (item.name.indexOf(value) > -1) {
        return getParentKey(item.key, this.state.treeData);
      }
      return null;
    }).filter((item, i, self) => item && self.indexOf(item) === i);

    this.setState({
      expandedKeys,
      searchValue: value,
      autoExpandParent: true,
    });
  };

  onSelect = (selectedKeys, e) => {
    this.props.onSelect(e.node.props.data);
  };

  onDragStart = ({event, node}) => {
    event.dataTransfer.setData("node", JSON.stringify(node.props.data));
  };

  handleMenuClick = (e, data, ele)=>{
    if(!data){
      return false;
    }
    const action = data.action;
    if (action === 'rename') {
      this.setState({
        currentNode: data.item,
        modalVisible: true,
      });
    }else if(action === 'move'){
      const wsData = {
        id: data.item.id,
        catalog: data.catalog
      };
      const {changeCatalog} = this.props;

      if(changeCatalog){
        changeCatalog(wsData);
      }
    }else if(action === 'mark'){
      const {onMark} = this.props;
      if(onMark){
        onMark(data.item);
      }
    }
  };

  collect = (props) => {
    return { item: props.item };
  };

  hideModelHandler = () => {
    this.setState({
      modalVisible: false
    })
  };

  onSave = (data) =>{
    const {renameTreeNode} = this.props;
    if(renameTreeNode){
      renameTreeNode(data);
    }
    this.setState({
      modalVisible:false,
    });
  };

  render() {

    const {treeData, searchValue, expandedKeys, autoExpandParent} = this.state;

    const filteredData = data => data.filter(item => item && item.name);

    const docMenuId = `_contextMenu${Math.random()}`;
    const problemMenuId = `_contextMenu${Math.random()}`;

    const loop = data => data.map((item) => {
      const index = item.name.search(searchValue);
      const beforeStr = item.name.substr(0, index);
      const afterStr = item.name.substr(index + searchValue.length);
      const folderOpen = expandedKeys.filter((key) => key === `node-${item.id}`).length > 0;
      const title = index > -1 ? (
        <span>{beforeStr}
          <span style={{color: '#f50'}}>{searchValue}</span>
          {afterStr}
        </span>
      ) : <span>{item.name}</span>;

      if (item.children) {
        const isFile = item.isFile;
        return (
          <TreeNode key={`node-${item.id}`}
                    title={ <span style={{fontWeight: 'bold'}}>
                                <Fontawesome className={classnames(styles.Icon, styles.Folder, item.children.length > 0 ? '' : styles.empty)}
                                             name={isFile ? "file-image-o" : (folderOpen ? "folder-open" : "folder")}/>{title}
                              </span>
                    }
                    data={item}>
            {loop(filteredData(item.children))}
          </TreeNode>
        );
      }

      const isProblem = item.isProblem;
      const isMarked = item.isProblem && item.isMarked;
      if(isProblem){
        if(item.fieldpath){
          return (
            <TreeNode key={`node-${item.id}`}
                      title={<ContextMenuTrigger id={problemMenuId} holdToDisplay={-1} item={item} collect={this.collect}>
                          <span style={{color: isMarked? 'red': 'inherit'}}>
                            <Fontawesome className={classnames(styles.Icon, styles.File)} name="question-circle"/>
                            {title}
                          </span></ContextMenuTrigger>}
                      data={item}/>
          );
        }else{
          return (
            <TreeNode key={`node-${item.id}`}
                      title={
                        <span style={{color: isMarked? 'red': 'inherit'}}>
                            <Fontawesome className={classnames(styles.Icon, styles.File)} name="question-circle"/>
                          {title}
                          </span>}
                      data={item}/>
          );
        }
      }else{
        return (
          <TreeNode key={`node-${item.id}`}
                    title={
                      <ContextMenuTrigger id={docMenuId} holdToDisplay={-1} item={item} collect={this.collect}>
                          <span style={{color: isMarked? 'red': 'inherit'}}>
                            <Fontawesome className={classnames(styles.Icon, styles.File)} name="file-image-o"/>
                            <span className="title">{title}</span>
                          </span>
                      </ContextMenuTrigger>}
                    data={item}/>
        );
      }
    });

    const EditForm = Form.create()(MyForm);

    return (
      <div className={styles.Tree}>
        <Search style={{width: '99%'}} placeholder="查找..." onChange={this.onChange}/>
        <Tree showLine={true}
              onExpand={this.onExpand}
              defaultExpandedKeys={expandedKeys}
              expandedKeys={expandedKeys}
              autoExpandParent={autoExpandParent}
              onSelect={this.onSelect}
              draggable={true}
              onDragStart={this.onDragStart}>
          {loop(treeData)}
        </Tree>
        <ContextMenu id={problemMenuId}
                     className="ccidit-context-menu"
                     hideOnLeave={false}>
          <MenuItem data={{action: 'mark'}} onClick={this.handleMenuClick}>添加标记</MenuItem>
        </ContextMenu>
        <ContextMenu id={docMenuId}
                     className="ccidit-context-menu"
                     hideOnLeave={false}>
          <MenuItem data={{action: 'rename'}} onClick={this.handleMenuClick}>重命名</MenuItem>
          <SubMenu title={<a>移动到</a>}>
            <MenuItem data={{action: 'move', catalog: '诉讼程序文书'}} onClick={this.handleMenuClick}>诉讼程序文书</MenuItem>
            <MenuItem data={{action: 'move', catalog: '物证'}} onClick={this.handleMenuClick}>物证</MenuItem>
            <MenuItem data={{action: 'move', catalog: '书证'}} onClick={this.handleMenuClick}>书证</MenuItem>
            <MenuItem data={{action: 'move', catalog: '证人证言、被害人陈述'}} onClick={this.handleMenuClick}>证人证言、被害人陈述</MenuItem>
            <MenuItem data={{action: 'move', catalog: '犯罪嫌疑人供述和辩解'}} onClick={this.handleMenuClick}>犯罪嫌疑人供述和辩解</MenuItem>
            <MenuItem data={{action: 'move', catalog: '鉴定意见'}} onClick={this.handleMenuClick}>鉴定意见</MenuItem>
            <MenuItem data={{action: 'move', catalog: '勘验、检查、辨认、侦查实验等笔录'}} onClick={this.handleMenuClick}>勘验、检查、辨认、侦查实验等笔录</MenuItem>
            <MenuItem data={{action: 'move', catalog: '视听资料、电子数据'}} onClick={this.handleMenuClick}>视听资料、电子数据</MenuItem>
            <MenuItem data={{action: 'move', catalog: '其它'}} onClick={this.handleMenuClick}>其它</MenuItem>
          </SubMenu>
        </ContextMenu>
        <Modal title='修改文件名称'
               visible={this.state.modalVisible}
               maskClosable={false}
               closable={true}
               onCancel={this.hideModelHandler}
               footer={null}>
          <EditForm item={this.state.currentNode} onSave={this.onSave} onCancel={this.hideModelHandler}/>
        </Modal>
      </div>
    );
  }
}

class MyForm extends React.Component{

  constructor(props){
    super(props);
    this.state = {
      item: {},
    }
  }

  componentWillReceiveProps(nextProps){
    this.setState({item: nextProps.item})
  }

  handleOk = ()=>{
    const {validateFields, getFieldsValue} = this.props.form;
    const {onSave} = this.props;
    validateFields((errors) => {
      if (errors) {
        return;
      }
      const data = {...getFieldsValue()};
      onSave(data);
    });
  };


  render()
  {
    const { getFieldDecorator} = this.props.form;
    const { item, onCancel} = this.props;

    return (
      <Form style={{height: '100%'}}>
        <FormItem>
          {getFieldDecorator('title', {
            initialValue: `${item.name}`,
            rules: [
              {required: true, message: "请输入文件名称"},
            ],
          })(
            <Input/>
          )}
        </FormItem>
        <FormItem style={{textAlign: 'right',marginBottom: '5px'}}>
          {getFieldDecorator('id', {
            initialValue: `${item.id}`
          })(
            <Input type="hidden"/>
          )}
          <Button type="primary" onClick={this.handleOk}>保存</Button>
          <Button  onClick={onCancel} style={{marginLeft: '5px'}}>取消</Button>
        </FormItem>
      </Form>
    );
  }
}

export default DocumentTree;
