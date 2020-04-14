import React, { PureComponent } from 'react';
import { Divider } from 'antd';
import styles from './page.less';

export default class RadioLink extends PureComponent {

  constructor(props) {
    super(props);
    this.state={
      selectedIndex:0,
      radioLinkData : [

        {
          text:"日",
          value:"day"
        },
        {
          text:"周",
          value:"week"
        },
        {
          text:"月",
          value:"month"
        }
      ],
    };
  }


  handleClick=(value)=>{
    this.props.getData(this.state.radioLinkData[value].value);
    this.setState({selectedIndex:value});
  };

  render() {
    const {radioLinkData} = this.state;
    const radioLink = [];
    radioLinkData.map((item,index)=>{
      if(index == this.state.selectedIndex){
        radioLink.push(<a key={index} href="#" onClick={(e)=>{this.handleClick(index)}}  className={styles.selectedLink}>{item.text}</a>);
        radioLink.push(<Divider key={index+radioLinkData.length} type="vertical" />);
      }else{
        radioLink.push(<a key={index} href="#" onClick={(e)=>{this.handleClick(index)}}  className={styles.unselectedLink}>{item.text}</a>);
        radioLink.push(<Divider key={index+radioLinkData.length} type="vertical" />);
      }
    });
    radioLink.splice(radioLink.length-1,1);

    return(
      <div>
        {radioLink}
      </div>
    );
  }
}
