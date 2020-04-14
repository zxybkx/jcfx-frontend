import React, {Component} from 'react';
import styles from './Chart.less'
import echarts from "echarts";
import ReactEcharts from "echarts-for-react";
import _ from 'lodash';

class MapChart extends Component {

  constructor(props) {
    super(props);
    this.state = {
      city: 'jiangsu',
      dwmc: '江苏省',
      fdwmc: '',
      dwbm: '32',
    };
  }

  componentWillMount() {
    echarts.registerMap("jiangsu", require('../../../data/baqkfx/province/jiangsu.json'));
  }

  EventsDict = {
    'click': (e) => {
      const cityMap = require('../../../data/baqkfx/cityMap.json');
      if (e.name in cityMap) {
        //城市前四位编码
        const code = cityMap[e.name].substr(0, 4);
        this.props.onDwbmChange(code);
        //城市下面区的json文件
        const mapJson = require('../../../data/baqkfx/city/' + cityMap[e.name] + '.json');
        echarts.registerMap(cityMap[e.name], mapJson);
        this.setState({
          dwmc: e.name,
          city: cityMap[e.name],
          fdwmc: e.name,
          dwbm: code,
        });
      } else {
        const mapJson = require('../../../data/baqkfx/city/' + cityMap[this.state.fdwmc] + '.json').features;
        _.map(mapJson, (o) => {
          if (o.properties.name === e.name) {
            if (this.state.dwbm === o.id) {
              // 选择市
              const id = o.id.substring(0, 4);
              this.props.onDwbmChange(id);
              this.setState({
                dwmc: this.state.fdwmc,
                dwbm: id,
              });
            } else {
              // 选择区县
              this.props.onDwbmChange(o.id);
              this.setState({
                dwmc: e.name,
                dwbm: o.id,
              });
            }
          }
        });
      }
    }
  };

  back = (e) => {
    // if (this.state.dwmc === this.state.fdwmc) {
      echarts.registerMap("jiangsu", require('../../../data/baqkfx/province/jiangsu.json'));
      this.setState({city: 'jiangsu', dwmc: '江苏省', dwbm: '32'});
      this.props.onDwbmChange('32');
    // } else {
    //   const code = this.state.dwbm.substr(0, 4);
    //   this.props.onDwbmChange(code);
    //   this.setState({dwmc: this.state.fdwmc, dwbm: code});
    // }
  };

  render() {
    const heatMapOption = {
      title: {
        text: '单位：' + this.state.dwmc,
        left: 'center',
        textStyle: {
          color: '#fff',
          fontWeight: 'normal',
        },
      },
      toolbox: {
        show: true,
        left: '5%',
        top: '5%',
        itemSize: 25,
        feature: {
          myReturn: {
            show: this.state.city != 'jiangsu',
            title: '返回',
            icon: 'path://M778.666667 490.666667H296.533333l220.586667-220.16a21.333333 21.333333 0 0 0-30.293333-30.293334l-256 256a21.333333 21.333333 0 0 0 14.933333 36.266667h532.906667a21.333333 21.333333 0 0 0 0-42.666667zM338.346667 575.573333a21.333333 21.333333 0 0 0-30.293334 30.293334l178.346667 178.346666a21.333333 21.333333 0 0 0 30.293333-30.293333z',
            onclick: this.back,
          },
        },
      },
      // visualMap: {
      //   min: 0,
      //   max: 1200,
      //   splitNumber: 6,
      //   inRange: {
      //     color: ['#d94e5d','#eac736','#50a3ba'].reverse()
      //   },
      //   textStyle: {
      //     color: '#fff',
      //   },
      //   left:"2%",
      //   bottom:"1%"
      // },
      geo: {
        map: this.state.city,
        //selectedMode选中模式，表示是否支持多个选中，默认关闭
        selectedMode: true,
        roam: true,
        //regions，在地图中对特定的区域配置样式
        regions: [{
          name: this.state.dwmc,
          itemStyle: {
            areaColor: 'orange',
          }
        }],
        label: {
          emphasis: {
            show: true
          },
          normal: {
            show: true,
            formatter: (params) => {
              return params.value[2];
            },
            fontSize: 14,
            color: '#D1CE78',
          }
        },
        itemStyle: {
          normal: {
            areaColor: 'rgba(128, 128, 128, 0.3)',
            borderColor: '#1d6dff'
          }
        }
      },
      series: [{
        // name: '热度',
        type: 'scatter',
        coordinateSystem: 'geo',
        symbol: 'pin',
        symbolSize: 40,
        label: {
          normal: {
            show: true,
            /*formatter: (params) => {
              return params.value[2];
            },*/
            textStyle: {
              color: '#fff',
              fontSize: 9,
            }
          }
        },
        data: []
      }]
    };

    return (
      <div className={styles.body}>
        <div className={styles.map}>
          <ReactEcharts
            style={{height: '100%'}}
            option={heatMapOption}
            notMerge={true}
            onEvents={this.EventsDict}
            ref="map"
          />
        </div>

      </div>
    );
  }
}

export default MapChart;
