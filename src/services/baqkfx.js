import qs from 'qs';
import request from '../utils/request';

/**
 * 获取在线检察官列表数据
 * @param params
 * @returns {Promise<Object>}
 */
export async function getOnlineOfficerData(params) {
  return request(`/gateway/elkservice/api/_search/online-jcg`, {
    method: 'POST',
    body: params
  });
}

/**
 * 获取当前案件办理列表
 * @param params
 * @returns {Promise<Object>}
 */
export async function getCaseData(params) {
  return request(`/gateway/elkservice/api/_search/online-ajjbxx`, {
    method: 'POST',
    body: params
  });
}

/**
 * 获取在线峰值数据
 * @param params
 * @returns {Promise<Object>}
 */
export async function getOnlinePeakValueData(params) {
  return request(`/gateway/elkservice/api/_search/online-fz`, {
    method: 'POST',
    body: params
  });
}

/**
 * 获取办案数量数据
 * @param params
 * @returns {Promise<Object>}
 */
export async function getCaseCount(params) {
  return request(`/gateway/tjfxservice/api/znfz-scqs/rlt-aj-count`, {
    method: 'POST',
    body: params
  });
}
