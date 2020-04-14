import * as service from '../services/baqkfx';

export default {

  namespace: 'baqkfx',

  state: {},

  effects: {
    /**
     * 获取在线检察官列表数据
     * @param payload
     * @param call
     * @param put
     * @returns {*}
     */
    *getOnlineOfficerData({ payload }, { call, put }) {
      const response = yield call(service.getOnlineOfficerData,payload);
      return response;
    },
    /**
     * 获取当前案件办理列表
     * @param payload
     * @param call
     * @param put
     * @returns {*}
     */
    *getCaseData({ payload }, { call, put }) {
      const response = yield call(service.getCaseData,payload);
      return response;
    },
    /**
     * 获取在线峰值数据
     * @param payload
     * @param call
     * @param put
     * @returns {*}
     */
    *getOnlinePeakValueData({ payload }, { call, put }) {
      const response = yield call(service.getOnlinePeakValueData,payload);
      return response;
    },
    /**
     * 获取办案数量数据
     * @param payload
     * @param call
     * @param put
     * @returns {*}
     */
    *getCaseCount({ payload }, { call, put }) {
      const response = yield call(service.getCaseCount,payload);
      return response;
    },

  },

  reducers: {},
};
