import React, {Component} from 'react';
import Chart from './Chart';
import styles from './Chart.less';
import ZbModel from './ZbModel';

class ZcjdChart extends Component {

  constructor(props) {
    super(props);
    this.state = {
      buttonA: true,
      visible: false,
      detailData: [],
      cs: '',
      modelList: [],
      pagination: {},
    };
  }

  onChange = (cs) => {
    this.getHsList(cs);
  };

  hideModelHandler = () => {
    this.setState({
      visible: false,
    })
  };

  okHandler = () => {
    this.hideModelHandler();
  };

  getHsList = (type, page) => {
    const {dispatch, searchVal} = this.props;
    dispatch({
      type: 'portal/getAjHs',
      payload: {
        pagination: {
          page: page ? page.current - 1 > 0 ? page.current - 1 : 0 : 0,
          size: page ? page.pageSize : 10,
        },
        query: {
          ...searchVal,
          field: type,
          ysay: [searchVal.ysay],
          dwbm: searchVal.dwbm,
          ajlb: searchVal.ajlb === 'all' ? ['ZJ', 'GS'] : [searchVal.ajlb],
          cbrgh: null,
        }
      }
    }).then(({data, success}) => {
      if (data && success) {
        this.setState({
          modelList: data.list,
          pagination: {
            total: data.list && data.total,
            current: page ? page.current : 0,
            size: page ? page.pageSize : 10,
          }
        })
      }
    });
  }


  render() {
    const {btList, searchVal, dispatch, dtlb} = this.props;

    const zbProps = {
      onEvents: (e) => {
        this.setState({
          visible: true,
          cs: e.name,
        });
        if(dtlb === 'spjd'){
          if(e.name === '书面纠违' || e.name === '检察建议' || e.name === '口头纠违'){
            e.name = e.name+"（审判监督）";
          }
        }
        switch(e.name){
          case '无罪':
            e.name = "无罪判决";
            break;
          case '无逮捕必要不捕':
            e.name = "无逮捕必要";
            break;
          case '不构罪不捕':
            e.name = "不构罪";
            break;
        };
        this.onChange(e.name);
      },
      option: {
        // title: {
        //   text: '案件处理',
        //   x: 'left',
        //   textStyle: {
        //     color: 'white',
        //   },
        // },
        color: ['#45a1ff', '#30fe4b', '#f6fb11', '#f02a16'],
        //提示框
        tooltip: {
          trigger: 'item',
          formatter: '{b} : {c} ({d}%)',
        },
        // legend: {
        //   orient: 'vertical',
        //   left: 'right',
        //   data: _.map(btList && btList['占比'], (d) => d.name),
        //   textStyle: {
        //     color: 'white',
        //   },
        // },
        series: [
          {
            // name: '',
            type: 'pie',
            radius: ['0', '40%'],
            center: ['50%', '50%'],
            data: btList['占比'],
            minAngle: 5,
            avoidLabelOverlap: true,
            itemStyle: {
              normal: {
                shadowBlur: 200,
                shadowColor: 'rgba(26, 107, 255, 0.3)',
              },
            },
            label: {
              normal: {
                show: true,
                position: 'outside',
                formatter: '{b}\n{c}件\n{d}%',
                textStyle: {
                  fontSize: 12
                }
              },
            },
          },
        ],
      },
    };
    const {cs, visible, modelList, pagination} = this.state;

    return (
      <div className={styles.body}>
        <ZbModel title="回溯表"
                 record={modelList}
                 pagination={pagination}
                 hideModelHandler={this.hideModelHandler}
                 visible={visible}
                 cs={cs}
                 searchVal={searchVal}
                 onTableChange={this.getHsList}
                 dispatch={dispatch}/>
        <div className={styles.title}>占比</div>
        <div className={styles.chart}>
          <Chart {...zbProps} />
        </div>
      </div>
    );
  }
}

export default ZcjdChart;
