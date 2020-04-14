import React, {Component} from 'react';
import {Card} from 'antd';
import styles from './Chart.less';
import HsModal from './HsModal'

class Batj extends Component {

  constructor(props) {
    super(props);
    this.state = {
      selected: '受理'
    };
  }

  onClick = (dtlb, i) => {
    if (i !== this.state.selected) {
      this.setState({
        selected: i
      });
    }
    this.props.onAqChange(dtlb, i);
  };


  render() {
    const {ajlb, baqkList,ajhsList,searchVal,dispatch} = this.props;
    const {selected} = this.state;
    const item = (dtlb, i) => {
      const name = i.split('（')[0];
      return (
        <div>
          <HsModal title="回溯表" record={ajhsList} cs={i} searchVal={searchVal} dispatch={dispatch}>
            <a style={{color: selected === i ? '#1d6dff' : '#fff'}}
               onClick={() => {
                 this.onClick(dtlb, i)
               }}>
              {name}：{baqkList[i]}
            </a>
          </HsModal>
        </div>
      )
    };

    return (
      <div className={styles.body}>
        <div className={styles.title}>动态</div>
        {/*<div className={styles.title}>办案统计</div>*/}
        <div className={styles.dt}>
          <Card type="inner" className={styles.dtPart}>
            {item('saqk', '受理')}
            {item('saqk', '办结')}
            {item('saqk', '未结')}
            {ajlb === 'ZJ' ? '' :
              <div>
                {item('pjqk', '有罪判决')}
                {item('pjqk', '无罪判决')}
                {item('pjqk', '诉判不一')}
              </div>}
          </Card>
          {ajlb === 'GS' ? '' :
            <Card type="inner" className={styles.dtPart}>
              {item('bybb', '批捕')}
              {item('bybb', '不批捕')}
              {item('bybb', '不构罪')}
              {item('bybb', '存疑不捕')}
              {item('bybb', '无逮捕必要')}
            </Card>}
          {ajlb === 'ZJ' ? '' :
            <Card type="inner" className={styles.dtPart}>
              {item('sybs', '起诉')}
              {item('sybs', '不起诉')}
              {item('sybs', '相对不诉')}
              {item('sybs', '存疑不诉')}
              {item('sybs', '绝对不诉')}
            </Card>}
          <Card type="inner" className={styles.dtPart}>
            {item('zcjd', '侦查监督')}
            {item('zcjd', '书面纠违')}
            {item('zcjd', '检察建议')}
            {item('zcjd', '口头纠违')}
          </Card>
          {ajlb === 'ZJ' ? '' :
            <Card type="inner" className={styles.dtPart}>
              {item('spjd', '审判监督')}
              {item('spjd', '抗诉')}
              {item('spjd', '书面纠违（审判监督）')}
              {item('spjd', '检察建议（审判监督）')}
              {item('spjd', '口头纠违（审判监督）')}
            </Card>}
        </div>


      </div>
    );
  }
}

export default Batj;
