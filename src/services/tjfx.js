import qs from 'qs';
import request from '../utils/request';
/*
 * 首页
 * */
// 首页：受案
export async function countSa(params) {
  return request(`/gateway/tjfxservice/api/countSa?${qs.stringify(params)}`, {
    method: 'GET',
  });
}

// 首页：办结
export async function countBj(params) {
  return request(`/gateway/tjfxservice/api/countBj?${qs.stringify(params)}`, {
    method: 'GET',
  });
}

// 首页：未结
export async function countWj(params) {
  return request(`/gateway/tjfxservice/api/countWj?${qs.stringify(params)}`, {
    method: 'GET',
  });
}

// 首页：办案时长
export async function countBasc(params) {
  return request(`/gateway/tjfxservice/api/countBasc?${qs.stringify(params)}`, {
    method: 'GET',
  });
}

// 首页：侦查监督
export async function countZcjd(params) {
  return request(`/gateway/tjfxservice/api/countZcjd?${qs.stringify(params)}`, {
    method: 'GET',
  });
}

// 首页：案件处理
export async function countAjcl(params) {
  return request(`/gateway/tjfxservice/api/countAjcl?${qs.stringify(params)}`, {
    method: 'GET',
  });
}

export async function getCountByMonth(params) {
  return request(`/gateway/tjfxservice/api/findCountByMonth?${qs.stringify(params)}`, {
    method: 'GET',
  });
}

/*
 * 办结明细
 * */
export async function getBjCase(params) {
  return request(`/gateway/tjfxservice/api/findBjCaseDeal?${qs.stringify(params)}`, {
    method: 'GET',
  });
}
/*
 * 受理明细
 * */
export async function getSlCase(params) {
  return request(`/gateway/tjfxservice/api/findSlCaseDeal?${qs.stringify(params)}`, {
    method: 'GET',
  });
}


export async function getCountByQuestion(params) {
  return request(`/gateway/tjfxservice/api/findQuestionCount?${qs.stringify(params)}`, {
    method: 'GET',
  });
}

export async function getCountByMap(params) {
  return request(`/gateway/tjfxservice/api/findCityCount?${qs.stringify(params)}`, {
    method: 'GET',
  });
}

export async function getCountByBazq(params) {
  return request(`/gateway/tjfxservice/api/countBazqByMonth?${qs.stringify(params)}`, {
    method: 'GET',
  });
}
export async function getCountByCl(params) {
  return request(`/gateway/tjfxservice/api/countClByMonth?${qs.stringify(params)}`, {
    method: 'GET',
  });
}

/*
 * 其他
 * */

export async function getTree(params) {
  return request(`/gateway/ui/api/x-t-zzjg-dwbms/all?${qs.stringify(params)}`, {
    method: 'GET',
  });
}

export async function getCbrTree(params) {
  return request(`/gateway/tjfxservice/api/getAllryByDwbm?${qs.stringify(params)}`, {
    method: 'GET',
  });
}

export async function hasClid() {
  return request(`/gateway/tjfxservice/api/hasClid`, {
    method: 'GET',
  });
}

// 单位对照
export async function getDwhzAll(params) {
  return request(`/gateway/tjfxservice/api/countByDwhz`, {
    method: 'POST',
    body: params
  });
}

// 检察官对照
export async function getJcghzAll(params) {
  return request(`/gateway/tjfxservice/api/countByJcghz`, {
    method: 'POST',
    body: params
  });
}

// 单位汇总
export async function getAllByDw(params) {
  return request(`/gateway/tjfxservice/api/countAllByDw`, {
    method: 'POST',
    body: params
  });
}

// 检察官汇总
export async function getAllByJcg(params) {
  return request(`/gateway/tjfxservice/api/countAllByJcg`, {
    method: 'POST',
    body: params
  });
}

// 检察官个案
export async function getByJcgga(params, data,) {
  // console.log('检察官个案',data)
  return request(`/gateway/tjfxservice/api/countByJcgga?${qs.stringify(params)}`, {
    method: 'POST',
    body: data
  });
}

// 案件信息
export async function getAjxx(params) {
  return request(`/gateway/tjfxservice/api/ajxxxx?${qs.stringify(params)}`, {
    method: 'GET',
  });
}

// 案件状态
export async function getAjzt(params) {
  return request(`/gateway/tjfxservice/api/ajzt`, {
    method: 'POST',
    body: params
  });
}

/**
 *获取所选日期的办案情况
 * @param params
 * @returns {Promise.<Object>}
 */
export async function getBaqk(params) {
  return request(`/gateway/tjfxservice/api/rb/kxjcBaqk`, {
    method: 'POST',
    body: params,
  });
}


export async function getRbBaqk(params, data) {
  return request(`/gateway/tjfxservice/api/rb/kxjcBaqk/detail?${qs.stringify(params)}`, {
    method: 'POST',
    body: data
  });
}

//折线图
export async function getZxt(params) {
  return request(`/gateway/tjfxservice/api/rb/kxjcBaqk/zxt`, {
    method: 'POST',
    body: params
  });
}




