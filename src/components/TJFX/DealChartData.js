import React, { Component } from 'react';
import { Row, Col, Button} from 'antd';
import Chart from './Chart';
import  _  from 'lodash';
const ButtonGroup = Button.Group;

export default class DealChartData extends Component {

  constructor(props) {
    super(props);
    this.state = {
      chart: '',
      pieList: 'sa',
      barList: 'zcjd',
    };
  }

  buildData =(data,cs)=>{
    let arr=[];
    _.map(data, (d,key) => {
      if(key>0){
        arr.push(d[cs])
      }
    });
    return (arr);
  };

  render() {
    const { type, list}=this.props;
    let chart='';
    if(list.length>0){
      switch(type) {
        case '1':
          const x = list&&!list[0].cbrxm?this.buildData(list,'dwmc'):this.buildData(list,'cbrxm');
          const saList={
            option: {
              color: ['#face28','#f04864','#1993ff', '#14c3c5', '#30c466','#ffaf30','#0ec3e4','#fb6161'],
              tooltip : {
                trigger: 'item',
                formatter: "{a} <br/>{b} : {c} ({d}%)"
              },
              legend: {
                orient: 'vertical',
                left: 'right',
                data: ['审查逮捕','审查起诉']
              },
              series : [
                {
                  name:'受案件数',
                  type:'pie',
                  selectedMode: 'single',
                  radius: [0, '30%'],
                  data:[ {value: list[0].sa_scdb, name:'审查逮捕'}, {value:list[0].sa, name:'审查起诉'}],
                },
                {
                  name: '受案人数',
                  type: 'pie',
                  radius: ['45%', '65%'],
                  data: [{value: list[0].sa_scdbrs, name:'审查逮捕'}, {value:list[0].sars, name:'审查起诉'}],
                }
              ]
            }
          };
          const bjList={
            option: {
              // color: ['#f8e400', '#f26378', '#13dbad', '#ff7d48','#a2ef54', '#0092c7', '#005e3q', '#161e3e'],
              tooltip : {
                trigger: 'item',
                formatter: "{a} <br/>{b} : {c} ({d}%)"
              },
              legend: {
                orient: 'vertical',
                left: 'right',
                data: ['审查逮捕','审查起诉']
              },
              series : [
                {
                  name:'办结件数',
                  type:'pie',
                  selectedMode: 'single',
                  radius: [0, '30%'],
                  data:[ {value: list[0].bj_scdb, name:'审查逮捕'}, {value:list[0].bj_scqs, name:'审查起诉'}],
                },
                {
                  name: '办结人数',
                  type: 'pie',
                  radius: ['45%', '65%'],
                  data: [{value: list[0].bj_scdbrs, name:'审查逮捕'}, {value:list[0].bj_scqsrs, name:'审查起诉'}],
                }
              ]
            }
          };
          const clList={
            option: {
              // color: ['#f8e400', '#f26378', '#13dbad', '#ff7d48','#a2ef54', '#0092c7', '#005e3q', '#161e3e'],
              tooltip : {
                trigger: 'item',
                formatter: "{a} <br/>{b} : {c} ({d}%)"
              },
              legend: {
                orient: 'vertical',
                left: 'right',
                data: ['批捕','起诉']
              },
              series : [
                {
                  name:'件数',
                  type:'pie',
                  selectedMode: 'single',
                  radius: [0, '30%'],
                  data:[ {value: list[0].pb, name:'批捕'}, {value:list[0].qs, name:'起诉'}],
                },
                {
                  name: '人数',
                  type: 'pie',
                  radius: ['45%', '65%'],
                  data: [{value: list[0].pbrs, name:'批捕'}, {value:list[0].qsrs, name:'起诉'}],
                }
              ]
            }
          };
          const zqList={
            option :{
              tooltip: {
                trigger: 'axis'
              },
              xAxis: {
                type: 'category',
                axisLabel: {
                  // interval: 0,
                  rotate: 45,
                },
                data: x,
              },
              yAxis: {
                type: 'value'
              },
              series: [{
                name:'审查逮捕',
                data: this.buildData(list,'pjbazq_scdb'),
                type: 'line',
                color: '#f49930'
              },{
                name:'审查起诉',
                data: this.buildData(list,'pjbazq'),
                type: 'line',
                color: '#3eb866'
              }],
              legend: {
                data: ['审查逮捕','审查起诉'],
                align: 'right',
                right: 10
              },
            }
          };
          const zjList={
            option :{
              // backgroundColor: '#2c343c',
              tooltip: {
                trigger: 'axis'
              },
              xAxis: {
                type: 'category',
                data: x
              },
              yAxis: {
                type: 'value'
              },
              series: [{
                name:'书面纠正',
                data: this.buildData(list,'smjz'),
                type: 'bar',
                color: '#f49930'
              },{
                name:'检察建议',
                data: this.buildData(list,'jcjy'),
                type: 'bar',
                color: '#3eb866'
              },{
                name:'书面回复',
                data: this.buildData(list,'smhf'),
                type: 'bar',
                color: 'pink'
              }],
              legend: {
                data: ['书面纠正','检察建议','书面回复'],
                align: 'right',
                right: 10
              },
            }
          };
          const spList={
            option :{
              // backgroundColor: '#2c343c',
              tooltip: {
                trigger: 'axis'
              },
              xAxis: {
                type: 'category',
                data: x
              },
              yAxis: {
                type: 'value'
              },
              series: [{
                name:'抗诉',
                data: this.buildData(list,'ks'),
                type: 'bar',
                color: '#f49930'
              },{
                name:'书面纠正',
                data: this.buildData(list,'smjz_spjd'),
                type: 'bar',
                color: '#3eb866'
              },{
                  name:'检察建议',
                  data: this.buildData(list,'jcjy_spjd'),
                  type: 'bar',
                  color: '#937938'
                },{
                  name:'书面回复',
                  data: this.buildData(list,'smhf_spjd'),
                  type: 'bar',
                  color: '#9eb456'
                }],
              legend: {
                data: ['抗诉','书面纠正','检察建议','书面回复'],
                align: 'right',
                right: 10
              },
            }
          };
          const { pieList, barList }=this.state;
          chart=<Row>
            <Col span={6} offset={1}>
              <ButtonGroup>
                <Button
                  type= { pieList==='sa' ? 'primary':'normal'}
                  onClick={() => {
                    this.setState({
                      pieList: 'sa',
                    });
                  }}
                >受案</Button>

                <Button
                  type= { pieList==='bj' ? 'primary':'normal'}
                  onClick={() => {
                    this.setState({
                      pieList: 'bj',
                    });
                  }}
                >办结</Button>

                <Button
                  type= { pieList==='cl' ? 'primary':'normal'}
                  onClick={() => {
                    this.setState({
                      pieList: 'cl',
                    });
                  }}
                >处理</Button>
              </ButtonGroup>
              { pieList==='sa' ? <Chart {...saList} />:''}
              { pieList==='bj' ? <Chart {...bjList} />:''}
              { pieList==='cl' ? <Chart {...clList} />:''}
            </Col>
            <Col span={7} offset={1}>
              <ButtonGroup>
                <Button type= 'primary'>平均办案周期</Button>
              </ButtonGroup>
              <Chart {...zqList} />
            </Col>
            <Col span={7} offset={1}>
              <ButtonGroup>
                <Button
                  type= { barList==='zcjd' ? 'primary':'normal'}
                  onClick={() => {
                    this.setState({
                      barList: 'zcjd',
                    });
                  }}
                >侦查监督</Button>

                <Button
                  type= { barList==='spjd' ? 'primary':'normal'}
                  onClick={() => {
                    this.setState({
                      barList: 'spjd',
                    });
                  }}
                >审判监督</Button>
              </ButtonGroup>
              { barList==='zcjd' ? <Chart {...zjList} />:''}
              { barList==='spjd' ? <Chart {...spList} />:''}
            </Col>
          </Row>
          break;

        case '2':
          // console.log(type);
          break;

        case '3':
          // console.log(type);
          break;
      }
    }

    return (
      <div>
        {chart}
      </div>
    );
  }
}
