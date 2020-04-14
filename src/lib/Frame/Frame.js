import React, {PureComponent} from 'react';
import {Spin} from 'antd';
import qs from 'querystring';
import styles from './Frame.less';

export default class Frame extends PureComponent {

  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      src: props.src,
      params: props.params,
    };
  }

  componentDidMount() {
    setTimeout(() => this.setState({loading: false}), 1000);
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      src: nextProps.src,
      params: nextProps.params,
    });
  }

  render() {
    const {src, params} = this.state;
    const {fixHeight} = this.props;

    return (
      <div className={styles.default} style={{height: fixHeight}}>
        <Spin style={{width: '100%', position: 'absolute', textAlign: 'center', marginTop: '60px'}}
              spinning={this.state.loading} tip="正在加载..."
              size="large"/>
        <iframe src={params && params.bmsah ? `${src}?${qs.stringify(params)}` : src}/>
      </div>
    );
  }
}
