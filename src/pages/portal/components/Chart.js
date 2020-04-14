import React from 'react';
import echarts from "echarts";
import ReactEcharts from "echarts-for-react";
echarts.registerTheme('my_theme', {
  backgroundColor: 'transparent',
});

export default class DateColumn extends React.PureComponent {

  constructor(props) {
    super(props);
    this.state = {}
  }

  render() {
    const EventsDict = {
      'click': (e) => {this.props.onEvents?this.props.onEvents(e):''},
    };
    return (
      <ReactEcharts
        style={{
          width: '100%',
          // border:'solid 1px red',
          height:'100%'
        }}
        option={this.props.option}
        notMerge={true}
        lazyUpdate={true}
        theme={"my_theme"}
        onChartReady={() => {
        }}
         onEvents={EventsDict}
      />
    )
  }
}
