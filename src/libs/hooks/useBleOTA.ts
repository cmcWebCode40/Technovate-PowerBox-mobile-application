/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useCallback, useEffect } from 'react';
import SparkMD5 from 'spark-md5';
import { useBluetoothContext } from '../context';

const CHUNK_SIZE = 240;
const DEFAULT_RETRIES = 3;
const CHUNK_DELAY = 50;
const RETRY_DELAY = 100;
const COMPLETION_DELAY = 2000;

export interface FirmwareResponse {
  version: string;
  filename: string;
  sha256: string;
}

export interface OTAStats {
  progress: number; // 0 to 1
  status: 'idle' | 'downloading' | 'updating' | 'completed' | 'failed';
  isSending: boolean;
  isActive: boolean;
  currentChunk?: number;
  totalChunks?: number;
  error?: string;
}

export interface OTAConfig {
  chunkSize?: number;
  retries?: number;
  chunkDelay?: number;
  retryDelay?: number;
  completionDelay?: number;
}

const delay = (ms: number): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, ms));

const FIRMWARE_INFO_URL = 'https://obiot.duckdns.org/PowerBox/firmware/firmware.json';

export const useOTA = () => {
  const [stats, setStats] = useState<OTAStats>({
    progress: 0,
    status: 'idle',
    isSending: false,
    isActive: false,
  });
  const [isCancelled, setIsCancelled] = useState(false);
  const [firmwareVersion, setFirmwareVersion] = useState<FirmwareResponse>({
  version: '',
  filename: '',
  sha256: '',
  });
  const {sendOTA} = useBluetoothContext();


  useEffect(() => {
     (async() =>{
      getFirmwareVersion(FIRMWARE_INFO_URL);
     })();
  }, []);


  const updateStats = useCallback((updates: Partial<OTAStats>) => {
    setStats(prev => ({ ...prev, ...updates }));
  }, []);


  const sendWithRetry = useCallback(async (
    chunk: string,
    retries: number = DEFAULT_RETRIES,
    retryDelay: number = RETRY_DELAY
  ): Promise<void> => {
    for (let attempt = 1; attempt <= retries; attempt++) {
      if (isCancelled) {
        throw new Error('OTA cancelled by user');
      }

      try {
        await sendOTA(chunk);
      } catch (err) {
        console.warn(`⚠️ Retry ${attempt}/${retries} failed for chunk:`, err);

        if (attempt === retries) {
          throw new Error(`Failed to send chunk after ${retries} attempts: ${err}`);
        }
        // Exponential backoff
        const backoffDelay = retryDelay * Math.pow(2, attempt - 1);
        await delay(backoffDelay);
      }
    }
  }, [isCancelled]);

  /**
   * Perform OTA update via BLE
   */
  const startOTA = useCallback(async (): Promise<void> => {
    console.log('🚀 Initiating OTA update...');
    
     const chunkSize = CHUNK_SIZE;
      const retries = DEFAULT_RETRIES;
       const chunkDelay = CHUNK_DELAY;
      const retryDelay = RETRY_DELAY;
      const completionDelay = COMPLETION_DELAY;


    // Reset cancellation flag
    setIsCancelled(false);

    try {
      updateStats({
        status: 'downloading',
        progress: 0,
        isActive: true,
        error: undefined,
      });

      console.log('🚀 Starting OTA update from:', FIRMWARE_INFO_URL);

      const response = await fetch(FIRMWARE_INFO_URL);
      if (!response.ok) {
        throw new Error(`Failed to fetch firmware binary: ${response.status} ${response.statusText}`);
      }

      const data: FirmwareResponse = await response.json();
      if (isCancelled) {throw new Error('OTA cancelled by user');}

      const arrayBuffer = await response.arrayBuffer();
      const firmware = new Uint8Array(arrayBuffer);
      const md5 = SparkMD5.ArrayBuffer.hash(arrayBuffer);
      const totalChunks = Math.ceil(firmware.length / chunkSize);

      console.log('🔐 Firmware MD5:', md5);
      console.log('📦 Total chunks:', totalChunks);
      console.log('📏 Firmware size:', firmware.length, 'bytes');

      updateStats({
        status: 'updating',
        totalChunks,
        currentChunk: 0,
        isSending: true,
      });

      // Send start payload
      const startPayload = JSON.stringify({
        type: 'ota_start',
        size: firmware.length,
        version: data.version,
        md5,
        chunks: totalChunks,
      });

      console.log('📤 Sending start payload:', JSON.parse(startPayload));
      

      // await sendWithRetry(startPayload, retries, retryDelay);
      // await delay(100);

      // // Send firmware chunks
      // for (let i = 0; i < totalChunks; i++) {
      //   if (isCancelled) {
      //     throw new Error('OTA cancelled by user');
      //   }

      //   const start = i * chunkSize;
      //   const end = Math.min(start + chunkSize, firmware.length);
      //   const chunk = firmware.slice(start, end) as unknown as string;

      //   await sendWithRetry(chunk, retries, retryDelay);

      //   const progress = (i + 1) / totalChunks;

      //   updateStats({
      //     progress,
      //     currentChunk: i + 1,
      //     status: 'updating',
      //   });

      //   console.log(`📤 Sent chunk ${i + 1}/${totalChunks} (${Math.round(progress * 100)}%)`);

      //   if (i < totalChunks - 1) { // Don't delay after the last chunk
      //     await delay(chunkDelay);
      //   }
      // }

      // // Send end payload (commented out in original, keeping for consistency)
      // await sendWithRetry(JSON.stringify({ type: 'ota_end' }), retries, retryDelay);

      // updateStats({
      //   progress: 1,
      //   status: 'completed',
      //   currentChunk: totalChunks,
      // });

      // console.log('✅ OTA update completed successfully');

      // // Auto-reset after completion delay
      // setTimeout(() => {
      //   if (!isCancelled) {
      //     updateStats({
      //       isActive: false,
      //       isSending: false,
      //     });
      //   }
      // }, completionDelay);

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown OTA error';
      console.error('❌ OTA failed:', errorMessage);

      updateStats({
        status: 'failed',
        error: errorMessage,
        isSending: false,
        isActive: false,
      });

      throw err;
    }
  }, [updateStats, sendWithRetry, isCancelled]);


  const getFirmwareVersion = useCallback(async (jsonURL: string) => {
    try {
      const response = await fetch(jsonURL);
      if (!response.ok) {
        throw new Error(`Failed to fetch firmware info: ${response.status} ${response.statusText}`);
      }
      const data: FirmwareResponse = await response.json();
      // console.log('📄 Firmware Info:', data);
       setFirmwareVersion(data);
    } catch (err) {
      return null;
    }
  }, []);


  const cancelOTA = useCallback(() => {
    setIsCancelled(true);

    updateStats({
      status: 'failed',
      error: 'Cancelled by user',
      isSending: false,
      isActive: false,
    });
  }, [updateStats]);


  const resetStats = useCallback(() => {
    setIsCancelled(false);
    setStats({
      progress: 0,
      status: 'idle',
      isSending: false,
      isActive: false,
    });
  }, []);

  return {
    stats,
    startOTA,
    cancelOTA,
    resetStats,
    firmwareVersion,
    getFirmwareVersion,
  };
};

export default useOTA;
