import xRequest from "../../../utils/request";
import qs from "querystring";

//受案情况表
export async function countByBajc(data) {
  // console.log('办案检察',data);
  return xRequest('/gateway/tjfxservice/api/jcfxBaqkjcSa', {
    method: 'POST',
    body: data,
  });
}

export async function countByBajcSub(data) {
  //console.log('办案检察二级表',data);
  return xRequest(`/gateway/tjfxservice/api/jcfxBaqkjc/detail?${qs.stringify(data.pagination)}`, {
    method: 'POST',
    body: data.query,
  });
}

//办结情况表, 侦查监督情况表, 审判监督情况表
export async function countByBaqkScdb(data) {
  // console.log('办结情况表',data);
  return xRequest('/gateway/tjfxservice/api/jcfxBaqkjcBj', {
    method: 'POST',
    body: data,
  });
}

export async function countByZcjdqk(data) {
  // console.log('侦查监督、审判监督情况表',data);
  // return xRequest('/gateway/tjfxservice/api/countByBahz', {
  //   method: 'POST',
  //   body: data,
  // });
}

export async function countByBaqkSub(data) {
 // console.log('二级表',data);
  return xRequest(`/gateway/tjfxservice/api/jcfxBaqkjcBj/detail?${qs.stringify(data.pagination)}`, {
    method: 'POST',
    body: data.query,
  });
}

//侦查监督、审判监督三级表
export async function countByZcjdSpjd(data) {
  //console.log('三级表,原四级表',data);
  return xRequest(`/gateway/tjfxservice/api/znfz-scqs/bajd/detail?${qs.stringify(data.pagination)}`, {
    method: 'POST',
    body: data.query,
  });
}

//办案反馈情况表
export async function countByBafkqk(data) {
  // console.log('办案反馈',data);
  return xRequest('/gateway/tjfxservice/api/jcfxBaqkjcBaJy', {
    method: 'POST',
    body: data,
  });
}

export async function countByBafkqkSub(data) {
 // console.log('办案反馈二级表',data);
  return xRequest(`/gateway/tjfxservice/api/jcfxBaqkjcBaJy/detail?${qs.stringify(data.pagination)}`, {
    method: 'POST',
    body: data.query,
  });
}

export async function countByBafkqkSjb(data) {
  //console.log('办案反馈三级表',data);
  return xRequest(`/gateway/tjfxservice/api/jcfxBaqkjcBaJy/detail/bmsah?${qs.stringify(data.pagination)}`, {
    method: 'POST',
    body: data.query,
  });
}

//诉判比对完成情况表
export async function countBySpbdqk(data) {
  return xRequest('/gateway/tjfxservice/api/jcfxBaqkjcSpjd', {
    method: 'POST',
    body: data,
  });
}

export async function countBySpbdqkSub(data) {
  //console.log('诉判比对二级表',data);
  return xRequest(`/gateway/tjfxservice/api/jcfxBaqkjcSpjd/detail?${qs.stringify(data.pagination)}`, {
    method: 'POST',
    body: data.query,
  });
}

export async function countBySpbdqkSubsec(data) {
  //console.log('诉判比对二级表111111',data);
  return xRequest(`/gateway/tjfxservice/api/jcfxBaqkjcSpjd/detail?${qs.stringify(data.pagination)}`, {
    method: 'POST',
    body: data.query,
  });
}
