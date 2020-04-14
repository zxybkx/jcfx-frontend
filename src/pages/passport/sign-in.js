import React, {Component} from 'react';
import {connect} from 'dva';
import {routerRedux} from 'dva/router';
import {Form, Input, Tabs, Button, Icon, Checkbox, TreeSelect, Alert} from 'antd';
import _ from 'lodash';
import store from '../../utils/store';
import {PORTAL, PROVENCE_SHORT_CODE} from '../../constant';
import Session from '../../utils/session';
import styles from './sign-in.less';

const crypto = require('crypto');

const FormItem = Form.Item;
const {TabPane} = Tabs;

@connect(({login, loading}) => ({
  login: login,
  submitting: loading.effects['login/login'],
}))
@Form.create()
export default class SignIn extends Component {

  constructor(props) {
    super(props);
    const localUser = store.get('__last_login_user');
    this.state = {
      count: 0,
      treeData: this.buildDepartmentTree(props.login.departments),
      department: (localUser && localUser.department) || undefined,
      expandKeys: [],
    };
  }

  buildDepartmentTree = (departments) => {
    let treeNode = [];
    if (departments) {
      let nodeMap = {};
      departments.forEach(d => {
        let node = {
          title: d.dwmc,
          value: d.dwbm,
          key: d.dwbm,
        };
        nodeMap[node.value] = node;
      });

      departments.forEach(d => {
        let parent = nodeMap[d.fdwbm];
        let node = nodeMap[d.dwbm];
        if (parent) {
          if (!parent.children) {
            parent.children = [];
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

  componentDidMount(){
    const {dispatch} = this.props;
    dispatch({
      type: "login/getAllDepartments",
      payload: {
        dwbm: `${PROVENCE_SHORT_CODE}`
      }
    });
  }

  componentWillReceiveProps(nextProps) {

    if (nextProps.submitting && nextProps.login.status === 'ok') {
      const {dispatch} = this.props;
      const session = Session.get();
      if (session) {
        const roles = session.roles;
        if (roles.indexOf('ROLE_ADMIN') >= 0 || roles.indexOf('ROLE_SUPER_ADMIN') >= 0) {
          dispatch(routerRedux.push('/passport/chose-portal'));
        } else {
          dispatch(routerRedux.push(PORTAL));
        }
      } else {
        dispatch(routerRedux.push('/passport/sign-in'));
      }
    } else {
      const {departments} = nextProps.login;
      if (departments && !_.isEqual(this.props.login.departments, departments)) {
        const treeData = this.buildDepartmentTree(departments);
        const department = treeData ? treeData[0].value : '';
        const localUser = store.get('__last_login_user');
        this.setState({
          treeData: treeData,
          department: (localUser && localUser.department) || department,
          expandKeys: [department],
        });
      }
    }
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  onSwitch = (key) => {
    this.setState({
      type: key,
    });
  }

  onGetCaptcha = () => {
    let count = 59;
    this.setState({count});
    this.interval = setInterval(() => {
      count -= 1;
      this.setState({count});
      if (count === 0) {
        clearInterval(this.interval);
      }
    }, 1000);
  }

  onChange = (value, label, extra) => {
    const {setFieldsValue} = this.props.form;
    this.setState({department: value});
    setFieldsValue({
      'department': value,
    })
  };

  filterTreeNode = (input, child) => {
    return String(child.props.title).indexOf(input) === 0;
  };

  handleSubmit = (e) => {
    e.preventDefault();
    const {type} = this.state;
    this.props.form.validateFields({force: true},
      (err, data) => {
        if (!err) {
          store.add('__last_login_user', {
            department: data.department,
            username: data.username,
          });
          data.type = type;
          data.password = crypto.createHash('md5').update(data.password).digest('hex');
          this.props.dispatch({
            type: `login/login`,
            payload: data,
          })
        }
      },
    );
  }

  renderMessage = (message) => {
    return (
      <Alert
        style={{marginBottom: 24}}
        message={message}
        type="error"
        showIcon
      />
    );
  }

  render() {
    const {form, login, submitting} = this.props;
    const {getFieldDecorator} = form;
    const localUser = store.get('__last_login_user');
    return (
      <div className={styles.main}>
        <Form onSubmit={this.handleSubmit}>
          <Tabs animated={false} className={styles.tabs} activeKey="account">
            <TabPane tab="用户登录" key="account">
              {
                login.status === 'error' &&
                submitting === false &&
                this.renderMessage('账户或密码错误')
              }
              <FormItem>
                <TreeSelect
                  showSearch
                  getPopupContainer={() => this.treeContainer}
                  value={this.state.department}
                  dropdownStyle={{maxHeight: 400, overflow: 'auto'}}
                  treeData={this.state.treeData}
                  placeholder="请选择工作部门"
                  searchPlaceholder="名称/拼音首字母"
                  treeDefaultExpandedKeys={this.state.expandKeys}
                  onChange={this.onChange}
                  filterTreeNode={this.filterTreeNode}
                />
                {getFieldDecorator('department', {
                  initialValue: this.state.department,
                  rules: [{required: true, message: '请选择所属部门'}],
                })(
                  <Input type="hidden"/>,
                )}
              </FormItem>
              <FormItem>
                {getFieldDecorator('username', {
                  initialValue: (localUser && localUser.username) || '',
                  rules: [{
                    required: true, message: '请输入账户名！',
                  }],
                })(
                  <Input
                    size="large"
                    prefix={<Icon type="user" className={styles.prefixIcon}/>}
                    placeholder="账户名"
                  />,
                )}
              </FormItem>
              <FormItem>
                {getFieldDecorator('password', {
                  rules: [{
                    required: true, message: '请输入密码！',
                  }],
                })(
                  <Input
                    size="large"
                    prefix={<Icon type="lock" className={styles.prefixIcon}/>}
                    type="password"
                    placeholder="密码"
                  />,
                )}
              </FormItem>
            </TabPane>
          </Tabs>
          <FormItem className={styles.additional}>
            {getFieldDecorator('rememberMe', {
              valuePropName: 'checked',
              initialValue: true,
            })(
              <Checkbox className={styles.autoLogin}>自动登录</Checkbox>,
            )}
            <Button size="large" loading={submitting} className={styles.submit} type="primary" htmlType="submit">
              登录
            </Button>
          </FormItem>
        </Form>
        <div className={styles.other}>
        </div>
        <div className={styles.tree} ref={c => this.treeContainer = c}></div>
      </div>
    );
  }
}
