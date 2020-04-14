import React from "react";
import classnames from 'classnames';
import styles from "./TreeLayout.less";
import $ from "jquery";
import {Icon} from 'antd';

class TreeLayout extends React.PureComponent {

  constructor(props){
    super(props);
    this.state = {
      w: 200,
    };
    this.lastMouseX = 260;
  }

  onResizeTriggerDown = (e) => {
    const _this = this;
    e = e ? e : window.event;
    this.lastMouseX = e.nativeEvent.clientX;

    $(document).bind('mousemove', function (e) {
      _this.resizing(e);
    });

    $(document).bind('mouseup', function (e) {
      $(document).unbind('mousemove');
      $(document).unbind('mouseup');
    });
  };

  resizing = (e) => {
    e = e ? e : window.event;
    let {w} = this.state;
    let neww = w + (e.clientX - this.lastMouseX);
    this.resize(neww);
    this.lastMouseX = e.clientX;
  };

  resize = (w) => {
    w = w < 50 ? 50 : w;
    this.setState({
      w: w,
    });
    if (this.props.onResize) {
      this.props.onResize(w);
    }
  };

  render() {
    const {tree, children, className} = this.props;
    const {w} = this.state;
    return (
      <div className={classnames(styles.TreeLayout, className)}>
        <div className={styles.aside} style={{width: w}}>
          {tree}
        </div>
        <div onMouseDown={this.onResizeTriggerDown} className={styles.ResizeTrigger}>&nbsp;</div>
        <div className={styles.main}>
          <a style={{ position:'absolute',left: 0, top: 0, fontSize:20, zIndex:99, color:'grey'}}>
            {w>0 ?
              <Icon type="menu-fold" onClick={()=>{this.setState({w: 0})}} />:
              <Icon type="menu-unfold" onClick={()=>{this.setState({w: 200})}} />
            }
          </a>
          {children}
        </div>
      </div>
    );
  }
}

export default TreeLayout;
