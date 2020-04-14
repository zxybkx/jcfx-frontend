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
      'click': (e) => {
        this.props.onEvents(e)
      },
    };
    const {type} = this.props;
    return (
      <ReactEcharts
        option={this.props.option}
        notMerge={true}
        lazyUpdate={true}
        theme={"my_theme"}
        onChartReady={() => {
        }}
        onEvents={EventsDict}
        style={{
          // height: type==='drillDown'?'80%':'100%'
          height: '80%'
        }}
      />
    )
  }
}
