import React, {PureComponent} from 'react';
import _ from 'lodash';
import ReactEditor from '../../lib/ReactEditor';

export default class DocEditor extends PureComponent {

  constructor(props) {
    super(props);
    this.state = {
      docData: props.docData || null,
    };
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      docData: nextProps.docData,
    })
  }

  onSave = (content) => {
    const {dispatch, stage} = this.props;
    const {docData} = this.state;
    const basePath = stage === 'ZJ' ? 'zcjd': 'gsjd';
    if (content) {
      dispatch({
        type: `${basePath}/saveDocData`,
        payload: {
          data: {...docData, jsondata: {data: content}},
        }
      });
    }
  };

  onExport = (content) => {
    const {dispatch, stage} = this.props;
    const {docData} = this.state;
    const basePath = stage === 'ZJ' ? 'zcjd': 'gsjd';
    if (content) {
      dispatch({
        type: `${basePath}/exportDocData`,
        payload: {
          data: {...docData},
        }
      });
    }
  };

  onReload = () => {
    this.setState({
      docData: null
    });
    const {dispatch, stage} = this.props;
    const {docData} = this.state;
    const basePath = stage === 'ZJ' ? 'zcjd': 'gsjd';
    dispatch({
      type: `${basePath}/reloadDocData`,
      payload: {
        data: {...docData},
      }
    });
  };

  showProblemResult = (keyid, data) => {
    const {dispatch, ajxx, stage} = this.props;
    const basePath = stage === 'ZJ' ? 'zcjd': 'gsjd';
    if (_.startsWith(keyid, "NLP_")) {
      dispatch({
        type: `${basePath}/changeState`,
        payload: {
          docViewVisible: true,
          coords: data
        }
      });
    } else {
      let _key = _.replace(keyid, /^YSJL_/, '');
      dispatch({
        type: `${basePath}/openResultViewModal`,
        payload: {
          bmsah: ajxx.bmsah,
          keyid: _key
        }
      });
    }
  };

  render() {
    const {docData} = this.state;
    const doc = docData && docData.jsondata ? docData.jsondata.data : null;
    return (
      <ReactEditor doc={doc}
                   fullScreen={this.props.fullScreen}
                   loading={this.state.docData === null}
                   linkClickHandler={this.showProblemResult}
                   onSave={this.onSave}
                   onExport={this.onExport}
                   onReload={this.onReload}/>
    );
  }

}

