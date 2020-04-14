import React, {Component} from 'react';
import {Row, Col, Card} from 'antd';
import styles from './Chart.less';
import DrdtModel from './DrdtModel';

class Drdt extends Component {

  constructor(props) {
    super(props);
    this.state = {
      selected: ''
    };
  }

  onClick = (drdt, i) => {
    if (i !== this.state.selected) {
      this.setState({
        selected: i
      });
    }
  };

  render() {
    const {drdtList, searchVal, ajhsList, dispatch} = this.props;
    const {selected} = this.state;
    const item = (drdt, i) => {
      const name = i.split('（')[0];
      return (
        <div>
          <DrdtModel title="回溯表" record={ajhsList} cs={i} searchVal={searchVal} dispatch={dispatch}>
            <a style={{color: selected === i ? '#1d6dff' : '#fff'}} onClick={() => {
              this.onClick(drdt, i)
            }}>
              {name}：{drdtList[i]}
            </a>
          </DrdtModel>
        </div>
      )
    }

    return (
      <div className={styles.body}>
        <div className={styles.title}>今日动态</div>
        <Row className={styles.drdt} gutter={5}>
          <Col span={4} className={styles.dtPart}>
            <Card type="inner" className={styles.dtbody}>
              {item('saqk', '受理')}
              {item('saqk', '办结')}
              {item('saqk', '未结')}
            </Card>
          </Col>
          <Col span={4} className={styles.dtPart}>
            <Card type="inner" className={styles.dtbody}>
              {item('pjqk', '有罪判决')}
              {item('pjqk', '无罪判决')}
              {item('pjqk', '诉判不一')}
            </Card>
          </Col>
          <Col span={4} className={styles.dtPart}>
            <Card type="inner" className={styles.dtbody}>
              {item('bybb', '批捕')}
              {item('bybb', '不批捕')}
              {item('bybb', '不构罪')}
              {item('bybb', '存疑不捕')}
              {item('bybb', '无逮捕必要')}
            </Card>
          </Col>
          <Col span={4} className={styles.dtPart}>
            <Card type="inner" className={styles.dtbody}>
              {item('sybs', '起诉')}
              {item('sybs', '不起诉')}
              {item('sybs', '相对不诉')}
              {item('sybs', '存疑不诉')}
              {item('sybs', '绝对不诉')}
            </Card>
          </Col>
          <Col span={4} className={styles.dtPart}>
            <Card type="inner" className={styles.dtbody}>
              {item('zcjd', '侦查监督')}
              {item('zcjd', '书面纠违')}
              {item('zcjd', '检察建议')}
              {item('zcjd', '口头纠违')}
            </Card>
          </Col>
          <Col span={4} className={styles.dtPart}>
            <Card type="inner" className={styles.dtbody}>
              {item('spjd', '审判监督')}
              {item('spjd', '抗诉')}
              {item('spjd', '书面纠违（审判监督）')}
              {item('spjd', '检察建议（审判监督）')}
              {item('spjd', '口头纠违（审判监督）')}
              {/*<div>审判监督：{drdtList['审判监督']}</div>
              <div>抗诉：{drdtList['抗诉（审判监督）']}</div>
              <div>书面纠正：{drdtList['书面纠正（审判监督）']}</div>
              <div>检察建议：{drdtList['检察建议（审判监督）']}</div>
              <div>口头纠违：{drdtList['口头纠正（审判监督）']}</div>*/}
            </Card>
          </Col>
        </Row>
      </div>
    );
  }
}

export default Drdt;
