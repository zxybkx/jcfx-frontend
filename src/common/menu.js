import {isUrl} from '../utils/utils';

const menuData = [{
  name: '首页',
  icon: 'desktop',
  path: 'portal',
  hideInMenu: false,
},
{
  name: '办案情况实时分析',
  icon: 'dot-chart',
  path: 'baqkfx',
  hideInMenu: false,
},
  {
  name: '办案汇总',
  icon: 'book',
  path: 'bahz',
  hideInMenu: false,
  children: [{
    name: '汇总',
    icon: 'area-chart',
    path: 'hz',
    hideInMenu: false,
  },{
    name: '审查逮捕',
    icon: 'pushpin-o',
    path: 'scdb',
    hideInMenu: false,
  },{
    name: '审查起诉',
    icon: 'paper-clip',
    path: 'scqs',
    hideInMenu: false,
  }]
},{
  name: '案件查询',
  icon: 'search',
  path: 'gafx',
  hideInMenu: false,
  children: [{
    name: '审查逮捕',
    icon: 'link',
    path: 'scdbga',
    hideInMenu: false,
  },{
    name: '审查起诉',
    icon: 'inbox',
    path: 'scqsga',
    hideInMenu: false,
  }]
},{
  name: '汇总（新）',
  icon: 'pie-chart',
  path: 'hz',
  hideInMenu: false,
},{
  name: '办案监督（新）',
  icon: 'pie-chart',
  path: 'bajd',
  hideInMenu: false,
  },{
    name: '案件查询（新）',
    icon: 'pie-chart',
    path: 'ajcx',
    hideInMenu: false,
  },{
    name: '办案检察（新）',
    icon: 'pie-chart',
    path: 'bajc',
    hideInMenu: false,
}];

function formatter(data, parentPath = '/', parentAuthority) {
  let menus =  data.map((item) => {
    if(item.hideInMenu){
      return null;
    }
    let {path} = item;
    if (!isUrl(path)) {
      path = parentPath + item.path;
    }
    const result = {
      ...item,
      path,
      authority: item.authority || parentAuthority,
    };
    if (item.children) {
      result.children = formatter(item.children, `${parentPath}${item.path}/`, item.authority);
    }
    return result;
  });
  return menus.filter(m => m != null);
}

export const getMenuData = () => formatter(menuData);
