import React, {PureComponent} from 'react';
import {Collapse, Button} from 'antd';
import AjxxInfo from '../AjxxInfo';
import styles from './index.less';

const Panel = Collapse.Panel;

export default class CardTitle extends PureComponent {

  constructor(props){
    super(props);
    this.state = {fullScreen :false};
  }

  toggleFullScreen = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const {fullScreenHandler} = this.props;
    if(fullScreenHandler){
      fullScreenHandler();
      this.setState({fullScreen: !this.state.fullScreen}) ;
    }
  };

  render() {
    const {title, ajxx} = this.props;
    return (
      <Collapse bordered={false} className={styles.CardTitle}>
        <Panel key={1} header={
          <div className={styles.PanelTitle}>
            <div className={styles.title}>
              {title} <span> - {ajxx.ajmc} (点击查看详情)</span>
            </div>
            <div className={styles.action}>
              <Button type='ghost' onClick={this.toggleFullScreen} icon={this.state.fullScreen ? 'shrink' : 'arrows-alt'}/>
            </div>
          </div>
        } key="1">
          <AjxxInfo ajxx={ajxx}/>
        </Panel>
      </Collapse>
    );
  }
}
