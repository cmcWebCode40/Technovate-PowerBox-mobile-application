import {
    SESSION_VALIDITY_PERIOD,
    getFromAsyncStore,
    saveToAsyncStore,
  } from './storeManager';

  export const isExpired = async (expirationTime?: string) => {
    if (!expirationTime) {
      return true;
    }
    const currentTime = Math.floor(Date.now() / 1000);
    return currentTime >= parseInt(expirationTime, 10);
  };

  export const getActualExpirationTime = (expiresIn: number) => {
    const currentTime = Math.floor(Date.now() / 1000);
    const expirationTime = currentTime + expiresIn;
    return expirationTime.toString();
  };

  export const saveTokenExpiration = async (expiresIn: number) => {
    await saveToAsyncStore(
      SESSION_VALIDITY_PERIOD,
      getActualExpirationTime(expiresIn),
    );
  };
  export const checkExpiration = async () => {
    const expirationTime = await getFromAsyncStore(SESSION_VALIDITY_PERIOD);
    const hasTokenExpired = await isExpired(String(expirationTime));
    return hasTokenExpired;
  };
