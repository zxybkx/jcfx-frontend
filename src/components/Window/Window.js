import React, {Component} from 'react';
import  $  from 'jquery';
import  _  from 'lodash';
import classnames from 'classnames';
import Fontawesome from 'react-fontawesome';
import styles from './Window.less';

let commonZIndex = 300;
let commonWindows = [];
let minimizedWindows = [];
export default class Window extends Component {
  static defaultProps = {
    color: '#4475cc',
    theme: 'light',
    visible: false,
    showStatus: true,
    lastMouseX: 0,
    lastMouseY: 0,
    lastX: 150,
    lastY: 60,
    lastWidth: 400,
    lastHeight: 300,
    x: 350,
    y: 60,
    width: 400,
    height: 300,
    zIndex: commonZIndex,
  };

  constructor(props) {
    super(props);
    this.state = {
      visible: props.visible,
      draggable: true,
      isMaximized: false,
      isMinimized: false,
      zIndex: props.zIndex,
      x: props.x,
      y: props.y,
      w: props.width,
      h: props.height,
    };
    this.id = `window-${Math.floor(Math.random() * 1000)}`;
    this.lastMouseX = props.lastMouseX;
    this.lastMouseY = props.lastMouseY;
    this.lastX = props.lastX;
    this.lastY = props.lastY;
    this.lastWidth = props.width;
    this.lastHeight = props.height;
    this.windowWidth = $(window).width();
    this.windowHeight = $(window).height();
  }

  componentDidMount() {
    //initial the content size
    if (this.props.onResize) {
      this.props.onResize(this.state.w, this.state.h);
    }
    if (commonWindows) {
      this.setState({
        x: this.state.x + commonWindows.length ,
        y: this.state.y + commonWindows.length ,
      });
      commonWindows.push(this);
    }
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      visible: nextProps.visible,
    })
  }

  setFocus = () => {
    this.setState({zIndex: commonZIndex++});
  };

  onTitleDown = (e) => {
    if (this.state.isMinimized || this.state.isMaximized) {
      return false;
    }
    this.setFocus();
    const _this = this;
    e = e ? e : window.event;
    this.lastMouseX = e.nativeEvent.clientX;
    this.lastMouseY = e.nativeEvent.clientY;

    $(document).bind('mousemove', function (e) {
      _this.dragging(e);
    });

    $(document).bind('mouseup', function (e) {
      $(document).unbind('mousemove');
      $(document).unbind('mouseup');
    });
  };

  dragging = (e) => {
    if (this.state.draggable) {
      e = e ? e : window.event;
      this.move(e);
    }
  };

  move = function (e) {

    let {x, y} = this.state;
    x = x + (e.clientX - this.lastMouseX);
    y = y + (e.clientY - this.lastMouseY);

    this.lastMouseX = e.clientX;
    this.lastMouseY = e.clientY;
    this.lastX = x;
    this.lastY = y;

    this.setState({
      x: x,
      y: y,
    });
  };

  onResizeTriggerDown = (e) => {
    if (this.state.isMinimized || this.state.isMaximized) {
      return false;
    }
    this.setFocus();
    const _this = this;
    e = e ? e : window.event;
    this.lastMouseX = e.nativeEvent.clientX;
    this.lastMouseY = e.nativeEvent.clientY;

    const trigger = $(e.target).attr("data");

    $(document).bind('mousemove', function (e) {
      _this.resizing(e, trigger);
    });

    $(document).bind('mouseup', function (e) {
      $(document).unbind('mousemove');
      $(document).unbind('mouseup');
    });
  };

  resizing = (e, trigger) => {

    e = e ? e : window.event;
    let {w, h, x, y} = this.state;

    let newh, neww, newx, newy;
    switch (trigger) {
      case 't':
        newh = h - (e.clientY - this.lastMouseY);
        newy = y + (e.clientY - this.lastMouseY);
        this.resize(this.state.w, newh, this.state.x, newy);
        break;
      case 'b':
        newh = h + (e.clientY - this.lastMouseY);
        this.resize(this.state.w, newh, this.state.x, this.state.y);
        break;
      case 'l':
        neww = w - (e.clientX - this.lastMouseX);
        newx = x + (e.clientX - this.lastMouseX);
        this.resize(neww, this.state.h, newx, this.state.y);
        break;
      case 'r':
        neww = w + (e.clientX - this.lastMouseX);
        this.resize(neww, this.state.h, this.state.x, this.state.y);
        break;
      case 'br':
        neww = w + (e.clientX - this.lastMouseX);
        newh = h + (e.clientY - this.lastMouseY);
        this.resize(neww, newh, this.state.x, this.state.y);
        break;
    }

    this.lastMouseX = e.clientX;
    this.lastMouseY = e.clientY;
  };

  resize = (w, h, x, y) => {

    h = h < 150 ? 150 : h;
    w = w < 250 ? 250 : w;

    this.lastWidth = w;
    this.lastHeight = h;
    this.lastX = x;
    this.lastY = y;

    this.setState({
      w: w,
      h: h,
      x: x,
      y: y,
    });

    if (this.props.onResize) {
      this.props.onResize(w, h);
    }
  };


  close = () => {
    if (this.props.onClose) {
      this.props.onClose();
    }
  };

  toggleMinimize = () => {
    let x, y, w, h;
    if (this.state.isMinimized) {
      x = this.lastX;
      y = this.lastY;
      w = this.lastWidth;
      h = this.lastHeight;
    } else {
      w = 300;
      h = 30;
      if (minimizedWindows.length === 1 && minimizedWindows[0] === this.id) {
        x = $(window).width() - 300;
      } else {
        x = $(window).width() - 300 * (minimizedWindows.length + 1);
      }
      y = $(window).height() - 50;

      const index = _.findIndex(minimizedWindows, (id) => id === this.id);
      if (index < 0) {
        minimizedWindows.push(this.id);
      }
    }

    this.setState({
      isMinimized: !this.state.isMinimized,
      x: x,
      y: y,
      w: w,
      h: h,
    });

    if (this.props.onResize) {
      this.props.onResize(w, h);
    }
  };

  toggleMaximize = () => {
    let x, y, w, h;
    if (this.state.isMaximized) {
      x = this.lastX;
      y = this.lastY;
      w = this.lastWidth;
      h = this.lastHeight;
    } else {
      w = $(window).width() - 40;
      h = $(window).height() - 80;
      x = 10;
      y = 45;
    }

    this.setState({
      isMaximized: !this.state.isMaximized,
      x: x,
      y: y,
      w: w,
      h: h,
    });
    if (this.props.onResize) {
      this.props.onResize(w, h);
    }
  };

  render() {
    const {title, icon} = this.props;
    const {visible, isMaximized, isMinimized, zIndex, w, h, x, y} = this.state;
    const left = x < 0 ? 0 : ( x > this.windowWidth ? this.windowWidth - 50 : x);
    const top = y < 0 ? 0 : ( y > this.windowHeight ? this.windowHeight - 50 : y);

    return (
      <div className={styles.Window}
           style={{
             display: visible ? 'block' : 'none',
             zIndex: zIndex,
             left: left,
             top: top,
             width: w,
             height: h
           }}>
        <div onMouseDown={this.onResizeTriggerDown} data="t"
             className={classnames(styles.ResizeTrigger, styles.top)}>&nbsp;</div>
        <div onMouseDown={this.onResizeTriggerDown} data="l"
             className={classnames(styles.ResizeTrigger, styles.left)}>&nbsp;</div>
        <div onMouseDown={this.onResizeTriggerDown} data="b"
             className={classnames(styles.ResizeTrigger, styles.bottom)}>&nbsp;</div>
        <div onMouseDown={this.onResizeTriggerDown} data="r"
             className={classnames(styles.ResizeTrigger, styles.right)}>&nbsp;</div>
        <div className={styles.TitleBar}>
          <div className={styles.Title} onMouseDown={this.onTitleDown} onDoubleClick={this.toggleMaximize}>
            {
              icon && icon.length > 0 && <Fontawesome className={styles.Icon} name={icon}/>
            }
            &nbsp;{title}
          </div>
          <div className={styles.Operation}>
            <ul>
              <li onClick={this.toggleMinimize}><Fontawesome className={styles.Icon}
                                                             name={isMinimized ? "window-restore" : "window-minimize"}/>
              </li>
              <li onClick={this.toggleMaximize}>
                <Fontawesome className={styles.Icon} name={isMaximized ? "window-restore" : "window-maximize"}/>
              </li>
              <li onClick={this.close} className={styles.close}>
                <Fontawesome className={styles.Icon} name="close"/>
              </li>
            </ul>
          </div>
        </div>
        <div className={styles.Container}>
          {this.props.children}
        </div>
        <div className={styles.StatusBar} style={{display: this.state.showStatus}}>
          &nbsp;
          <div className={classnames(styles.ResizeTrigger)} onMouseDown={this.onResizeTriggerDown} data="br">
          </div>
        </div>
      </div>
    );
  }
}
