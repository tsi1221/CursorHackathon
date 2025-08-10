import { v4 as uuidv4 } from 'uuid';

export function useDeviceId() {
  let deviceId = localStorage.getItem('fixmyhood_device_id');
  if (!deviceId) {
    deviceId = uuidv4();
    localStorage.setItem('fixmyhood_device_id', deviceId);
  }
  return deviceId;
}