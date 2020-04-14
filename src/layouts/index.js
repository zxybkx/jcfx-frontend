import React, {Fragment} from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import {LocaleProvider, Layout, message} from 'antd';
import zhCN from 'antd/lib/locale-provider/zh_CN';
import DocumentTitle from 'react-document-title';
import {connect} from 'dva';
import {Link, routerRedux} from 'dva/router';
import withRouter from 'umi/withRouter';
import {ContainerQuery} from 'react-container-query';
import classNames from 'classnames';
import _ from 'lodash';
import {enquireScreen} from 'enquire-js';
import GlobalHeader from 'lib/GlobalHeader';
import SiderMenu from 'lib/SiderMenu';
import Authorized from '../utils/Authorized';
import Feedback from 'lib/Feedback';
import logo from '../assets/logo.png';
import {APP_NAME, APP_CODE, INTEGRATE, PROVENCE_NAME} from '../constant';
import styles from './index.less';
import {checkPathInclude} from '../utils/utils';
import Session from '../utils/session';

const {Content, Header} = Layout;

/**
 * 根据菜单取得重定向地址.
 */
const redirectData = [];
const getRedirect = (item) => {
  if (item && item.children) {
    if (item.children[0] && item.children[0].path) {
      redirectData.push({
        from: `${item.path}`,
        to: `${item.children[0].path}`,
      });
      item.children.forEach((children) => {
        getRedirect(children);
      });
    }
  }
};

const query = {
  'screen-xs': {
    maxWidth: 575,
  },
  'screen-sm': {
    minWidth: 576,
    maxWidth: 767,
  },
  'screen-md': {
    minWidth: 768,
    maxWidth: 991,
  },
  'screen-lg': {
    minWidth: 992,
    maxWidth: 1199,
  },
  'screen-xl': {
    minWidth: 1200,
  },
};

let isMobile;
enquireScreen((b) => {
  isMobile = b;
});

class BasicLayout extends React.PureComponent {
  static childContextTypes = {
    location: PropTypes.object,
    breadcrumbNameMap: PropTypes.object,
  };
  state = {
    isMobile,
  };

  getChildContext() {
    const {location, } = this.props;
    const authorizedMenu = this.authorizedMenu || this.getMenuData();
    const breadcrumbNameMap = {};
    authorizedMenu.forEach((item) => {
      let breadcrumbName = '';
      if (item.name) {
        breadcrumbName = item.name;
      } else {
        breadcrumbName = item.remark ? item.remark : '';
      }

      breadcrumbNameMap[item.path] = {
        name: breadcrumbName,
        component: item.component,
      };
    });
    return {
      location,
      breadcrumbNameMap: breadcrumbNameMap,
    };
  }

  componentDidUpdate() {
    const {dispatch, location, currentUser} = this.props;
    if (!currentUser || !currentUser.name) {
      this.props.dispatch({
        type: 'user/fetchCurrent',
      });
    }
    ReactDOM.render(<Feedback location={location} dispatch={dispatch} ref={c => this.feedback = c}/>, document.getElementById('feedback'));
  }

  componentDidMount() {
    enquireScreen((mobile) => {
      this.setState({
        isMobile: mobile,
      });
    });
    const {dispatch} = this.props;
    dispatch({
      type: 'user/fetchCurrent',
    });
  }

  getMenuData = () =>{
    const ret = [];

    const session = Session.get();
    if(!session){
      return ret;
    }

    const map = {};
    let resources = session.resources;

    if(resources){
      resources = resources.filter(d => d.module === `${APP_CODE}`);
      resources = _.orderBy(resources, "orderBy");
      resources.forEach(res => {
        map[res.id] = res;
        if(!res.pid || res.pid === 0 || res.pid === '0'){
          ret.push(res);
        }
      });

      resources.forEach(res => {
        let parent = map[res.pid];
        if (parent) {
          if (!parent.children) {
            parent.children = [];
          }
          parent.children.push(res);
        }
      });
    }
    ret.forEach(getRedirect);
    this.authorizedMenu = ret;
    return ret;
  };

  getPageTitle() {
    const {location} = this.props;
    const authorizedMenu = this.authorizedMenu || this.getMenuData();
    const {pathname} = location;
    let title = APP_NAME;
    if (authorizedMenu && authorizedMenu[pathname] && authorizedMenu[pathname].name) {
      title = `${authorizedMenu[pathname].name} - ${APP_NAME}`;
    }
    return title;
  }

  handleMenuCollapse = (collapsed) => {
    this.props.dispatch({
      type: 'global/changeLayoutCollapsed',
      payload: collapsed,
    });
  }

  handleNoticeClear = (type) => {
    message.success(`清空了${type}`);
    this.props.dispatch({
      type: 'global/clearNotices',
      payload: type,
    });
  }

  logout = () => {
    this.props.dispatch({
      type: 'login/logout',
    });
    this.props.dispatch({
      type: 'user/saveCurrentUser',
      payload: {
        currentUser: {}
      }
    });
  };

  handleMenuClick = ({key}) => {
    if (key === 'triggerError') {
      this.props.dispatch(routerRedux.push('/exception/trigger'));
      return;
    }
    if (key === 'logout') {
      this.logout();
    }
  }
  handleNoticeVisibleChange = (visible) => {
    if (visible) {
      this.props.dispatch({
        type: 'global/fetchNotices',
      });
    }
  }

  handleNoticeItemClick = (notice) => {
    const {dispatch} = this.props;
    dispatch({
      type: 'global/updateNoticeStatus',
      payload: {
        id: notice.id,
        status: 1,
      }
    }).then(()=> {
      dispatch(routerRedux.push(notice.path))
    });
  };

  onFeedback = () => {
    if (this.feedback) {
      this.feedback.feedback();
    }
  };

  render() {
    const {
      currentUser, collapsed, fetchingNotices, notices, children, location,
    } = this.props;

    const authorizedMenu = this.getMenuData();
    const {pathname} = location;

    let layout = (
      <Layout>
        <SiderMenu logo={logo} title={'智慧检察'}
          // 不带Authorized参数的情况下如果没有权限,会强制跳到403界面
          // If you do not have the Authorized parameter
          // you will be forced to jump to the 403 interface without permission
                   Authorized={Authorized}
                   menuData={authorizedMenu}
                   collapsed={collapsed}
                   location={location}
                   isMobile={this.state.isMobile}
                   onCollapse={this.handleMenuCollapse}
        />
        <Layout>
          <Header style={{padding: 0}}>
            <GlobalHeader
              logo={logo}
              appName={APP_NAME}
              location={location}
              menuData={authorizedMenu}
              currentUser={currentUser}
              fetchingNotices={fetchingNotices}
              notices={notices}
              collapsed={collapsed}
              isMobile={this.state.isMobile}
              onNoticeClear={this.handleNoticeClear}
              onCollapse={this.handleMenuCollapse}
              onMenuClick={this.handleMenuClick}
              onNoticeVisibleChange={this.handleNoticeVisibleChange}
              onNoticeItemClick={this.handleNoticeItemClick}
              onLogout={this.logout}
              onFeedback={this.onFeedback}
            />
          </Header>
          <Content style={{margin: '24px 24px 0', border: 'none'}}>
            {children}
          </Content>
        </Layout>
      </Layout>
    );

    const ignoreLayout = ['/passport/sign-in', '/passport/chose-portal'];
    if (ignoreLayout.includes(pathname)) {
      layout = (
        <div className={styles.container}>
          <div className={styles.content}>
            <div className={styles.top}>
              <div className={styles.header}>
                <Link to="/">
                  <img alt="logo" className={styles.logo} src={logo}/>
                  <span className={styles.title}>{PROVENCE_NAME}人民检察院</span>
                </Link>
              </div>
              <div className={styles.desc}>刑事办案科学决策系统</div>
            </div>
            {children}
          </div>
        </div>
      )
    }

    const integrateConfig = ['/znfz/view', '/znfz/view', '/404', '/500'];
    let integrate = false;
    if (checkPathInclude(pathname, integrateConfig)) {
      integrate = true;
    }

    if(integrate){
      layout = <Fragment>{children}</Fragment>;
    }

    if(INTEGRATE){
      layout = <Fragment>{children}</Fragment>;
    }

    return (
      <LocaleProvider locale={zhCN}>
        <DocumentTitle title={this.getPageTitle()}>
          <ContainerQuery query={query}>
            {params => <div className={classNames(params)}>{layout}</div>}
          </ContainerQuery>
        </DocumentTitle>
      </LocaleProvider>
    );
  }
}

export default withRouter(connect(({user, global, loading}) => ({
  currentUser: user.currentUser,
  collapsed: global.collapsed,
  fetchingNotices: loading.effects['global/fetchNotices'],
  notices: global.notices,
}))(BasicLayout));
