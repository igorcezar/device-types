import type { AxiosResponse } from 'axios';

import axios from 'axios';

export async function registerDevice(deviceType: string, userKey: string): Promise<AxiosResponse> {
  const response = await axios.post(
    '/Device/register',
    { deviceType, userKey },
    {
      baseURL: process.env.DEVICE_REGISTRATION_API ?? 'http://localhost:3001',
      headers: {
        'Content-Type': 'application/json',
      },
    },
  );
  return response;
}
