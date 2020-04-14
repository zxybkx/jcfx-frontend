import qs from 'querystring';
import request from '../utils/request';

export async function getAllDepartments(params) {
  return request(`/gateway/ui/api/x-t-zzjg-dwbms/all?${qs.stringify(params)}`, {
    method: 'GET',
  });
}
