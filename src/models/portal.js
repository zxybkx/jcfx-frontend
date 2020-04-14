import {
  saveFeedback, getBaqk, getAjts, getZb, getTbhb, getQyfb, getAjpm,
  countByBahz, countByBahzJcg, countByJcgga,
  countByBajd, countByBajdDetail,countByzzz,
  countByAjcx, getAjxx,getAjHs,countByzz,countBylili,countByhaohao
} from '../services/portal';
import {message} from 'antd';

export default {

  namespace: 'portal',

  state: {
    message: '',
  },

  subscriptions: {},

  effects: {

    *saveFeedback({payload}, {select, call, put}) {
      const {success, data} = yield call(saveFeedback, payload.data);
      if (success && data) {
        message.success("感谢您的反馈");
      }
    },

    /**
     * 案件信息
     * @param payload
     * @param call
     * @param put
     * @returns {*}
     */
      *getBaqk({payload}, {call, put}){
        return yield  call(getBaqk, payload);
      },

    /**
     * 每日动态
     * @param payload
     * @param call
     * @param put
     * @returns {*}
     */
      /**getDrbaqk({payload}, {call, put}){
        return yield  call(getDrbaqk, payload);
      },*/

    /**
     * 案件态势
     * @param payload
     * @param call
     * @param put
     * @returns {*}
     */
      *getAjts({payload}, {call, put}){
        return yield  call(getAjts, payload);
      },

    /**
     * 案件回溯
     * @param payload
     * @param call
     * @param put
     * @returns {*}
     */
      *getAjHs({payload}, {call, put}){
        return yield  call(getAjHs, payload);
      },


    /**
     * 饼图占比
     * @param payload
     * @param call
     * @param put
     * @returns {*}
     */
      *getZb({payload}, {call, put}){
        return yield  call(getZb, payload);
      },

    /**
     * 同比环比
     * @param payload
     * @param call
     * @param put
     * @returns {*}
     */
      *getTbhb({payload}, {call, put}){
        return yield  call(getTbhb, payload);
      },

    /**
     * 区域分布
     * @param payload
     * @param call
     * @param put
     * @returns {*}
     */
    *getQyfb({payload}, {call, put}){
      return yield  call(getQyfb, payload);
    },

    /**
     * 案件排名
     * @param payload
     * @param call
     * @param put
     * @returns {*}
     */
    *getAjpm({payload}, {call, put}){
      return yield  call(getAjpm, payload);
    },

    //汇总hz
    *countByBahz({payload}, {call, put}){
      return yield  call(countByBahz, payload);
    },

    *countByBahzJcg({payload}, {call, put}){
      return yield  call(countByBahzJcg, payload);
    },

    *countByJcgga({payload}, {call, put}){
      return yield  call(countByJcgga, payload);
    },


    //办案监督bajd
    *countByBajd({payload}, {call, put}){
      return yield  call(countByBajd, payload);
    },

    *countByBajdDetail({payload}, {call, put}){
      return yield  call(countByBajdDetail, payload);
    },

    //案件查询ajcx
    *countByAjcx({payload}, {call, put}){
      return yield  call(countByAjcx, payload);
    },

    *getAjxx({payload}, {call, put}){
      return yield  call(getAjxx, payload);
    },


    *countByzz({payload}, {call, put}){
      return yield  call(countByzz, payload);
    },

    *countByzzz({payload}, {call, put}){
      return yield  call(countByzzz, payload);
    },

    *countBylili({payload}, {call, put}){
      return yield  call(countBylili, payload);
    },

    *countByhaohao({payload}, {call, put}){
      return yield  call(countByhaohao, payload);
    },

  },

  reducers: {
     changeState(state, action) {
      return {...state, ...action.payload};
    },

    updateQueryKey(state, action) {
      return {...state, ...action.payload};
    }
  }

};
