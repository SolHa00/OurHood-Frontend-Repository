import authApiClient from '../api/clients/authApiClient';
import {
  CreateMomentRequest,
  FetchMomentInfoResponse,
} from '../types/apis/moment';

export const createMoment = async (
  data: CreateMomentRequest
): Promise<number> => {
  const res = await authApiClient.post('/moments', data, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return res.data.result.momentId;
};

export const fetchMomentInfo = async (
  momentId: number
): Promise<FetchMomentInfoResponse> => {
  const res = await authApiClient.get(`/moments/${momentId}`);
  return res.data.result;
};
