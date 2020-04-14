import React, {Component} from 'react';
import _ from 'lodash';
import {SketchField, Tools} from '../../lib/Sketch';
import {message, Slider, Button, Tooltip} from 'antd';
import {ContextMenu, MenuItem, ContextMenuTrigger} from 'react-contextmenu';
import Fontawesome from 'react-fontawesome';
import classnames from 'classnames';
import styles from './index.less';

class ImageCanvas extends Component {
  constructor(props) {
    super(props);
    this.state = {
      image: props.page.image,
      pos: props.page.pos,
      showRect: props.showRect === undefined ? true : props.showRect,
    };
    this._sketch = null;
  }

  shouldComponentUpdate(nextProps, nextState) {
    return !_.isEqual(this.props.page, nextProps.page) || !_.isEqual(this.state.page, nextState.page);
  }


  componentWillReceiveProps(nextProps) {
    this.setState({
      image: nextProps.page.image,
      pos: nextProps.page.pos,
    });
  }

  componentDidUpdate() {
    this._sketch.clear();
    this.buildCanvasJSON(this.state.image, this.state.pos);
    const {addSketch} = this.props;
    if (addSketch && this._sketch) {
      addSketch(this._sketch);
    }
  }

  componentDidMount() {
    this._sketch.clear();
    this.buildCanvasJSON(this.state.image, this.state.pos);
    const {addSketch} = this.props;
    if (addSketch && this._sketch) {
      addSketch(this._sketch);
    }
  }

  buildCanvasJSON = (image, pos) => {
    let json = {};
    json.objects = [];

    json.objects.push({
      type: 'image',
      scaleX:1,
      scaleY:1,
      originX: 'left',
      originY: 'top',
      left: 0,
      top: 0,
      src: image,
      selectable: false,
      centeredScaling: true,
      evented: false,
      hoverCursor: 'default',
    });

    if (!this.state.showRect) {
      this._sketch.fromJSON(json);
      return;
    }

    if (pos && pos.length > 0) {
      pos.forEach(p => {
        if (p && p.length > 0) {
          const arr = p.split(' ');
          if (arr && arr.length === 4) {
            const top = arr[1], left = arr[0], width = (arr[2] - arr[0]), height = (arr[3] - arr[1]);
            json.objects.push({
              type: 'rect',
              originX: 'left',
              originY: 'top',
              left: left,
              top: top,
              width: width,
              height: height,
              fill: 'rgba(255,0,0,.2)',
              stroke: 'rgba(255,0,0,1)',
              strokeWidth: 2,
              selectable: false,
              hasControls: false,
              hasRotatingPoint: false,
              selectionBackgroundColor: 'red',
              hoverCursor: 'default',
            });
          }
        }
      });
    }

    this._sketch.fromJSON(json);
  };

  getDrawJson = () => {
    return this._sketch.toJSON();
  };

  onChange = (e) => {
    if (e && e.type === 'mouseup' && e.button === 0) {
      const data = this._sketch.toJSON();
      const lastRect = _.last(data.objects);
      const width = lastRect ? lastRect.width : 0;
      const height = lastRect ? lastRect.height : 0;
      if (width === 0 && height === 0) {
        this._sketch.canUndo() && this._sketch.undo();
      } else {
        if (width <= 5 || height <= 5) {
          message.warning('请指定有效的文字选取范围。');
          this._sketch.canUndo() && this._sketch.undo();
        } else {
          const {getLastMark} = this.props;
          if (getLastMark) {
            const coords = {
              x1: lastRect.left / this._sketch._rate,
              y1: lastRect.top / this._sketch._rate,
              x2: lastRect.left / this._sketch._rate + lastRect.width / this._sketch._rate,
              y2: lastRect.top / this._sketch._rate + lastRect.height / this._sketch._rate,
              image: this.state.image,
            };
            getLastMark(coords);
          }
        }
      }
    }
  };

  removeActiveRect = () => {
    this._sketch.removeActiveObject();
  };

  handleClick = (e, data) => {
    const action = data.action;
    if (action === 'remove') {
      this.removeActiveRect();
    } else if (action === 'mark') {
      const rect = this._sketch.getActiveObject();
      if (rect) {
        const {onMark} = this.props;
        if (onMark) {
          //这里构建复制需要的坐标
          const coords = {
            x1: rect.left / this._sketch._rate,
            y1: rect.top / this._sketch._rate,
            x2: rect.left / this._sketch._rate + rect.width / this._sketch._rate,
            y2: rect.top / this._sketch._rate + rect.height / this._sketch._rate,
            image: this.state.image,
          };
          onMark(e, coords);
        }
      }
    } else if (action === 'copy') {
      const rect = this._sketch.getActiveObject();
      if (rect) {
        const {onCopy} = this.props;
        if (onCopy) {
          //这里构建复制需要的坐标
          const coords = {
            x1: rect.left / this._sketch._rate,
            y1: rect.top / this._sketch._rate,
            x2: rect.left / this._sketch._rate + rect.width / this._sketch._rate,
            y2: rect.top / this._sketch._rate + rect.height / this._sketch._rate,
            image: this.state.image,
          };
          onCopy(coords);
          this.removeActiveRect();
        }
      }
    } else {
      console.log(action);
    }
  };

  render() {

    const clientHeight = document.body.clientHeight;
    const editorId = `_contextMenu${Math.random()}`;

    return (
      <div className={styles.image} style={{position: 'relative'}}>
        <ContextMenuTrigger id={editorId} holdToDisplay={-1}>
          <SketchField ref={(c) => this._sketch = c}
                       tool={Tools.Rectangle}
                       lineColor='rgba(255,0,0,1)'
                       fillColor='rgba(255,0,0,.25)'
                       lineWidth={1}
                       height={clientHeight - 90}
                       onChange={this.onChange}/>
        </ContextMenuTrigger>
        <ContextMenu id={editorId}
                     className="ccidit-context-menu"
                     hideOnLeave={false}>
          {
            this.props.onMark && (<MenuItem data={{action: 'mark'}}
                                            onClick={this.handleClick}>
              <Fontawesome name="bookmark"/> 添加标记
            </MenuItem>)
          }
          <MenuItem data={{action: 'copy'}}
                    onClick={this.handleClick}>
            <Fontawesome name="copy"/> 解析文字
          </MenuItem>
          <MenuItem data={{action: 'remove'}}
                    onClick={this.handleClick}>
            <Fontawesome name="trash"/> 删除选择
          </MenuItem>
        </ContextMenu>
      </div>
    );
  }
}

class ToolBar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      scaleFact: 1,
      fullScreen: false,
    };
  }

  shouldComponentUpdate(nextProps, nextState) {
    return !_.isEqual(this.state.scaleFact, nextState.scaleFact) ||
      !_.isEqual(this.state.fullScreen, nextState.fullScreen);
  }

  zoom = (scale) => {
    this.setState({scaleFact: scale});
    const {sketchs} = this.props;
    if (sketchs && sketchs.length > 0) {
      sketchs.map(s => s.zoom(scale));
    }
  };

  onSliderChange = (value) => {
    let scale = value / 100;
    this.zoom(scale);
  };

  onButtonClick = (zoomIn) => {
    if (zoomIn) {
      this.zoom(this.state.scaleFact + 0.5 > 5 ? 5 : this.state.scaleFact + 0.5)
    } else {
      this.zoom(this.state.scaleFact - 0.5 < 1 ? 1 : this.state.scaleFact - 0.5)
    }
  };

  tipFormatter = (value) => {
    return `${value}%`
  };

  hideTrigger = () => {
    const {onHide, sketchs} = this.props;
    this.setState({fullScreen: !this.state.fullScreen});
    if (onHide) {
      onHide();
    }
    if (sketchs && sketchs.length > 0) {
      sketchs.map(s => s._resize());
    }
  };

  render() {
    const {fullScreen} = this.state;

    return (
      <div className={styles.ToolBar}>
        <div className={styles.Hide}>
          <Tooltip title={fullScreen ? '退出全屏' : '全屏'}>
            <Button onClick={this.hideTrigger} type='ghost'
                    style={{color: '#fff', border: 'none'}}
                    icon='laptop'/>
          </Tooltip>
        </div>
        <div className={styles.Scale}>
          <Button onClick={() => this.onButtonClick(false)}
                  type='ghost'
                  icon="minus-circle-o" className={classnames(styles.Icon, styles.left)}/>
          <Slider onChange={this.onSliderChange}
                  value={this.state.scaleFact * 100}
                  min={100}
                  max={500}
                  tipFormatter={this.tipFormatter}/>
          <Button onClick={() => this.onButtonClick(true)}
                  type='ghost'
                  icon="plus-circle-o"
                  className={classnames(styles.Icon, styles.right)}/>
        </div>
      </div>
    );
  }
}

export default class CanvasPreview extends Component {

  constructor(props) {
    super(props);
    this.state = {
      pages: this.buildPages(props.source),
    };

    this._sketchs = [];
  }

  shouldComponentUpdate(nextProps, nextState) {
    return !_.isEqual(this.props.source, nextProps.source) || !_.isEqual(this.state.scaleFact, nextState.scaleFact);
  }

  componentWillReceiveProps(nextProps) {
    this._sketchs = [];
    this.setState({
      pages: this.buildPages(nextProps.source),
    });
  }

  rebuildPos = (pos) => {
    if (_.isArray(pos)) {
      return pos.map(p1 => {
        if (!(/^0\s0\s.+$/.test(p1))) {
          return p1;
        }
      })
    } else if (_.isString(pos)) {
      if (!(/^0\s0\s.+$/.test(pos))) {
        return [pos]
      }
    } else {
      return [];
    }
  };

  rebuildPageData = (source) => {
    source = source || [];

    let pageData = [];
    source.map((page) => {
      if (!page || !page.image || page.image === 'null' || page.image === '') {
        return;
      }
      const index = pageData.findIndex(n => n.image === page.image);
      if (index < 0) {
        let p = {
          image: page.image,
          pos: [],
        };
        if (page.pos && page.pos.length > 0) {
          p.pos = this.rebuildPos(page.pos);
        }
        pageData.push(p);
      } else {
        pageData[index].pos = this.rebuildPos(page.pos);
      }
    });
    return pageData;
  };

  buildPages = (source) => {

    if (source === null || source === undefined) {
      return [{image: ''}];
    }
    const pageData = this.rebuildPageData(source);
    const pages = pageData.map((page, index) => {
      return {
        id: `img-${index}`,
        image: page.image,
        pos: page.pos,
      }
    });
    return pages;
  };

  addSketch = (sketch) => {
    this._sketchs.push(sketch);
  };

  render() {
    return (
      <div className={styles.CanvasPreview}>
        <ToolBar sketchs={this._sketchs} onHide={this.props.onHide}/>
        <div className={styles.Container}>
          {
            this.state.pages.map((page, index) => {
              return (
                <ImageCanvas addSketch={this.addSketch}
                             key={index}
                             page={page}
                             showRect={this.props.showRect}
                             onCopy={this.props.onCopy}
                             getLastMark={this.props.getLastMark}
                             onMark={this.props.onMark}/>
              );
            })
          }
        </div>
      </div>
    );
  }

}
