import xRequest from "../utils/request";
import qs from "querystring";

export async function query(params) {
  return xRequest(`/gateway/ui/api/z-nfz-yhfks?${qs.stringify(params)}`, {
    method: 'GET',
  });
}

export async function saveFeedback(data) {
  return xRequest('/gateway/ui/api/z-nfz-yhfks', {
    method: 'POST',
    body: data,
  });
}

// portal
/**
 *案件信息
 * @param params
 * @returns {Promise.<Object>}
 */
export async function getBaqk(params) {
  return xRequest(`/gateway/tjfxservice/api/kxjcBaqk?${qs.stringify(params)}`, {
    method: 'GET',
  });
}

/**
 * 每日动态
 * @param params
 * @returns {Promise.<Object>}
 */
/*export async function getDrbaqk(params) {
  return xRequest(`/gateway/tjfxservice/api/kxjcMrdt?${qs.stringify(params)}`, {
    method: 'GET',
  });
}*/

/**
 * 饼图占比
 * @param params
 * @returns {Promise.<Object>}
 */
export async function getZb(params) {
  return xRequest(`/gateway/tjfxservice/api/countKxjcBt?${qs.stringify(params)}`, {
    method: 'GET',
  });
}

/**
 * 同比环比
 * @param params
 * @returns {Promise.<Object>}
 */
export async function getTbhb(params) {
  return xRequest(`/gateway/tjfxservice/api/kxjcTbHb?${qs.stringify(params)}`, {
    method: 'GET',
  });
}


/**
 * 案件态势
 * @param params
 * @returns {Promise.<Object>}
 */
export async function getAjts(params) {
  return xRequest(`/gateway/tjfxservice/api/countKxjcAjqs?${qs.stringify(params)}`, {
    method: 'GET',
  });
}

export async function getAjHs(data) {
  console.log('1----1',data)
  return xRequest(`/gateway/tjfxservice/api/kxjcBaqk/detail?${qs.stringify(data.pagination)}`, {
    method: 'POST',
    body: data.query,
  });
}

/**
 * 区域分布
 * @param params
 * @returns {Promise.<Object>}
 */
export async function getQyfb(params) {
  return xRequest(`/gateway/tjfxservice/api/countKxjcQyfb?${qs.stringify(params)}`, {
    method: 'GET',
  });
}

/**
 * 案件排名
 * @param params
 * @returns {Promise.<Object>}
 */
export async function getAjpm(params) {
  return xRequest(`/gateway/tjfxservice/api/countKxjcBapm?${qs.stringify(params)}`, {
    method: 'GET',
  });
}

// 汇总hz
export async function countByBahz(data) {
  // console.log('hz单位',data);
  return xRequest('/gateway/tjfxservice/api/countByBahz', {
    method: 'POST',
    body: data,
  });
}

export async function countByBahzJcg(data) {
  // console.log('hz检察官',data);
  return xRequest('/gateway/tjfxservice/api/countByBahzJcg', {
    method: 'POST',
    body: data,
  });
}

export async function countByJcgga(data) {
  // console.log('hz二级',data);
  return xRequest(`/gateway/tjfxservice/api/countByBahz/detail?${qs.stringify(data.pagination)}`, {
    method: 'POST',
    body: data.query,
  });
}

//办案监督bajd
export async function countByBajd(data) {
  // console.log('bajd',data);
  return xRequest('/gateway/tjfxservice/api/znfz-scqs/bajd', {
    method: 'POST',
    body: data,
  });
}

export async function countByBajdDetail(data) {
  //console.log('bajd二级',data);
  return xRequest(`/gateway/tjfxservice/api/znfz-scqs/bajd-detail?${qs.stringify(data.pagination)}`, {
    method: 'POST',
    body: data.query,
  });
}


//案件查询ajcx
export async function countByAjcx(data) {
  // console.log('ajcx',data);
  return xRequest(`/gateway/tjfxservice/api/countByAjcx?${qs.stringify(data.pagination)}`, {
    method: 'POST',
    body: data.query,
  });
}

export async function getAjxx(params) {
  return xRequest(`/gateway/tjfxservice/api/ajxxxx?${qs.stringify(params)}`, {
    method: 'GET',
  });
}

export async function countByzz(data) {
  return xRequest(`/gateway/tyywservice/api/ts-ws/wstj?${qs.stringify(data.pageSize)}`, {
    method: 'POST',
    body: data.searchValue,
  });
}

export async function countByzzz(data) {
  return xRequest(`/gateway/tyywservice/api/ts-ws/aktj?${qs.stringify(data.pageSize)}`, {
    method: 'POST',
    body: data.searchValue,
  });
}

export async function countBysou(data) {
  return xRequest('/gateway/tyywservice/api/ts-ws/wstj', {
    method: 'POST',
    body: data,
  });
}

export async function countBysousou(data) {
  return xRequest('/gateway/tyywservice/api/ts-ws/antj', {
    method: 'POST',
    body: data,
  });
}

export async function countBylili(data) {
  return xRequest('/gateway/tyywservice/api/ts-ws/zmxs', {
    method: 'POST',
    body: data,
  });
}

export async function countByhaohao(data) {
  return xRequest('/gateway/tyywservice/api/ts-ws/zmxs2', {
    method: 'POST',
    body: data,
  });
}
