import React, { PureComponent } from 'react';
import Redirect from 'umi/redirect';
import moment from 'moment';
import { connect } from 'dva';
import { Link } from 'dva/router';
import { Row, Col, Card, List, Avatar, Icon } from 'antd';
import styles from './page.less';

@connect(({ portal, project, activities, chart, loading }) => ({
  portal,
  project,
  activities,
  chart,
  activitiesLoading: loading.effects['activities/fetchList'],
}))
export default class Workplace extends PureComponent {

  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'chart/clear',
    });
  }

  render() {

    return (
      <Redirect to='/bahz/hz'/>
    );
  }
}
