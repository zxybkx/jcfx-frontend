import * as service from '../services/tjfx';
import $ from 'jquery';
import qs from 'qs';
import _ from 'lodash'


export default {

  namespace: 'tjfx',

  state: {
    saList:[],
    bjList:[],
    wjList:[],
    bascList:[],
    zcjdList:[],
    ajclList:[],

    monthList: [],
    slbjList:[],
    questionList: [],
    mapList: [],
    cycleList: [],
    dealList: [],
    treeList: [],
    cbrTreeList: [],
    list: [],
    modelList: [],
    jcgmc:'',
    gh:'',
    pagination:{},
    queryParam: {}
  },

  effects: {
    // 首页：受案
    *countSa({ payload }, { call, put }) {
      const { success, data } = yield call(service.countSa, payload);
      if (success && data) {
        // console.log('受案',data);
        yield put({
          type: 'changeState',
          payload: {
            saList: data,
          },
        });
      }
    },

    // 首页：办结
    *countBj({ payload }, { call, put }) {
      const { success, data } = yield call(service.countBj, payload);
      if (success && data) {
        // console.log('办结',data);
        yield put({
          type: 'changeState',
          payload: {
            bjList: data,
          },
        });
      }
    },

    // 首页：未结
    *countWj({ payload }, { call, put }) {
      const { success, data } = yield call(service.countWj, payload);
      if (success && data) {
        // console.log('未结',data);
        yield put({
          type: 'changeState',
          payload: {
            wjList: data,
          },
        });
      }
    },

    // 首页：办案时长
    *countBasc({ payload }, { call, put }) {
      const { success, data } = yield call(service.countBasc, payload);
      if (success && data) {
        // console.log('办案时长',data);
        yield put({
          type: 'changeState',
          payload: {
            bascList: data,
          },
        });
      }
    },

    // 首页：侦查监督
    *countZcjd({ payload }, { call, put }) {
      const { success, data } = yield call(service.countZcjd, payload);
      if (success && data) {
        // console.log('侦查监督',data);
        yield put({
          type: 'changeState',
          payload: {
            zcjdList: data,
          },
        });
      }
    },

    // 首页：案件处理
    *countAjcl({ payload }, { call, put }) {
      const { success, data } = yield call(service.countAjcl, payload);
      if (success && data) {
        // console.log('案件处理',data);
        yield put({
          type: 'changeState',
          payload: {
            ajclList: data,
          },
        });
      }
    },

    *getCountByMonth({ payload }, { call, put }) {
      const { success, data } = yield call(service.getCountByMonth, payload);
      if (success && data) {
        // console.log('月份',data);
        yield put({
          type: 'changeState',
          payload: {
            monthList: data,
          },
        });
      }
    },

    // 办结受理
    *getBjCase({ payload }, { call, put }) {
      const  { success, data, page } = yield call(service.getBjCase, payload);
      if(success&&data) {
        // console.log('办结', data,page);
        yield put({
          type: 'changeState',
          payload: {
            slbjList: data,
            pagination:{
              total: page.total,
              current: payload.page,
              pageSize: payload.size,
            }
          },
        });
      }
    },
    *getSlCase({ payload }, { call, put }) {
      const { success, data, page } = yield call(service.getSlCase, payload);
      if(success&&data){
        // console.log('受理',data,page);
        yield put({
          type: 'changeState',
          payload: {
            slbjList: data,
            pagination:{
              total: page.total,
              current: payload.page,
              pageSize: payload.size,
            }
          },
        });
      }
    },

    *getCountByQuestion({ payload }, { call, put }) {
      const { success, data } = yield call(service.getCountByQuestion, payload);
      if (success && data) {
        // console.log('问题',data);
        yield put({
          type: 'changeState',
          payload: {
            questionList: data,
          },
        });
      }
    },
    *getCountByMap({ payload }, { call, put }) {
      const response = yield call(service.getCountByMap, payload);
      return response;
      // if (success && data) {
      //   // console.log('地图',data);
      //   yield put({
      //     type: 'changeState',
      //     payload: {
      //       mapList: data,
      //     },
      //   });
      // }
    },
    *getCountByBazq({ payload }, { call, put }) {
      const { success, data } = yield call(service.getCountByBazq, payload);
      if (success && data) {
        // console.log('办案周期',data);
        yield put({
          type: 'changeState',
          payload: {
            cycleList: data,
          },
        });
      }
    },
    *getCountByCl({ payload }, { call, put }) {
      const { success, data } = yield call(service.getCountByCl, payload);
      if (success && data) {
        // console.log('处理',data);
        yield put({
          type: 'changeState',
          payload: {
            dealList: data,
          },
        });
      }
    },







    *getTree({ payload }, { call, put }) {
      const { success, data } = yield call(service.getTree, payload);
      if (success && data) {
        yield put({
          type: 'changeState',
          payload: {
            treeList: data,
          },
        });
      }
    },

    *getCbrTree({ payload }, { call, put }) {
      const { success, data } = yield call(service.getCbrTree, payload);
      if (success && data) {
        yield put({
          type: 'changeState',
          payload: {
            cbrTreeList: data.list,
          },
        });
      }
    },

    *getDwhzAll({ payload }, { call, put }) {
      // console.log('单位',payload)
      const { success, data } = yield call(service.getDwhzAll, payload);
      if (success && data) {
        yield put({
          type: 'changeState',
          payload: {
            list: data.list,
          },
        });
      }
    },

    *getJcghzAll({ payload }, { call, put }) {
      // console.log('检察官',payload)
      const { success, data } = yield call(service.getJcghzAll, payload);
      if (success && data) {
        yield put({
          type: 'changeState',
          payload: {
            list: data.list,
          },
        });
      }
    },

    *getAllByDw({ payload }, { call, put }) {
      // console.log('单位',payload)
      const { success, data } = yield call(service.getAllByDw, payload);
      if (success && data) {
        yield put({
          type: 'changeState',
          payload: {
            list: data.list,
          },
        });
      }
    },

    *getAllByJcg({ payload }, { call, put }) {
      // console.log('检察官',payload)
      const { success, data } = yield call(service.getAllByJcg, payload);
      if (success && data) {
        yield put({
          type: 'changeState',
          payload: {
            list: data.list,
          },
        });
      }
    },

    // 个案
    *getByJcgga({ payload }, { call, put, select }) {
      const pagination= payload.pagination ? payload.pagination : {page:0,size:10};
      const queryParam = yield select(({tjfx}) => tjfx.queryParam);
      const gaData= payload.query ? payload.query : queryParam;
      // console.log('个案',gaData);
      const { success, data } = yield call(service.getByJcgga, pagination, gaData);
      if (success && data) {
        yield put({
          type: 'changeState',
          payload: {
            queryParam: gaData,
            list: data.list,
            jcgmc: data.mc,
            gh: data.gh,
            pagination:{
              total: data.total,
              current: pagination.page + 1 ,
              pageSize: pagination.size,
            }
          },
        });
      }
    },

    // 案件信息
    *getAjxx({ payload }, { call, put }) {
      const { success, data } = yield call(service.getAjxx, payload);
      if (success && data) {
        yield put({
          type: 'changeState',
          payload: {
            modelList: data.list,
          },
        });
      }
    },

    // 案件状态
    *getAjzt({ payload }, { call, put }) {
      const { success, data } = yield call(service.getAjzt, payload);
      if (success && data) {
        yield put({
          type: 'changeState',
          payload: {
            list: data.list,
          },
        });
      }
    },

    *getBaqk({ payload }, { call, put }) {
      const response = yield call(service.getBaqk, payload);
      return response;
    },

    *getRbBaqk({ payload }, { call, put }) {
      const response = yield call(service.getRbBaqk, payload.pagination,payload.query);
      return response;
    },

    //折线图
    *getZxt({ payload }, { call, put }) {
      const response = yield call(service.getZxt, payload);
      return response;
    },
    /**
     * 导出
     * @param payload
     * @param call
     * @returns {*}
     */* exportRblb({payload}, {call}) {
      let iframe = $('<iframe src="about:blank" name="blankFrame" id="blankFrame" style="display: none;"></iframe>');
      const form = $("<form>");//定义一个form表单
      form.attr("style", "display:none");
      form.attr("target", "blankFrame");
      form.attr("method", "get");  //请求类型
      form.attr("action", "/gateway/tjfxservice/api/exportRblb");
      $('body').append(iframe);
      $("body").append(form);//将表单放置在web中

      _.map(payload, (v, k) => {
        const input = $("<input>");
        input.attr("type", "hidden");
        input.attr("name", k);
        input.attr("value", v);
        form.append(input);
      });
      form.submit();//表单提交
    },

    //导出
    *jyJlDc({payload}, {call, put}) {
      let iframe = $('<iframe src="about:blank" name="blankFrame" id="blankFrame" style="display: none;"></iframe>');
      let form = $('<form>');//定义一个form表单
      form.attr('style', 'display:none');
      form.attr('target', 'blankFrame');
      form.attr('method', 'get');
      form.attr('action', '/gateway/tyywservice/api/ts-ws/excel');
      let input1=$("<input>");
      input1.attr("type","hidden");
      input1.attr("name","dwbm");
      input1.attr("value",payload.dwbm);
      let input2=$("<input>");
      input2.attr("type","hidden");
      input2.attr("name","startTime");
      input2.attr("value",payload.startTime);
      let input3=$("<input>");
      input3.attr("type","hidden");
      input3.attr("name","endTime");
      input3.attr("value",payload.endTime);
      let input4=$("<input>");
      input4.attr("type","hidden");
      input4.attr("name","zm");
      input4.attr("value",payload.zm);
      $('body').append(iframe);
      $('body').append(form);
      form.append(input1);
      form.append(input2);
      form.append(input3);
      form.append(input4);
      form.submit();
    },

    *jyJlDccc({payload}, {call, put}) {
      let iframe = $('<iframe src="about:blank" name="blankFrame" id="blankFrame" style="display: none;"></iframe>');
      let form = $('<form>');//定义一个form表单
      form.attr('style', 'display:none');
      form.attr('target', 'blankFrame');
      form.attr('method', 'get');
      form.attr('action', '/gateway/tyywservice/api/ts-ws/excel2');
      let input1=$("<input>");
      input1.attr("type","hidden");
      input1.attr("name","dwbm");
      input1.attr("value",payload.dwbm);
      let input2=$("<input>");
      input2.attr("type","hidden");
      input2.attr("name","startTime");
      input2.attr("value",payload.startTime);
      let input3=$("<input>");
      input3.attr("type","hidden");
      input3.attr("name","endTime");
      input3.attr("value",payload.endTime);
      let input4=$("<input>");
      input4.attr("type","hidden");
      input4.attr("name","zm");
      input4.attr("value",payload.zm);
      $('body').append(iframe);
      $('body').append(form);
      form.append(input1);
      form.append(input2);
      form.append(input3);
      form.append(input4);
      form.submit();
    },
  },
  reducers: {
    changeState(state, action) {
      return { ...state, ...action.payload };
    },
  },
};
