import { Injectable } from '@angular/core';

import * as FHIR from 'fhirclient';
import Client from 'fhirclient/lib/Client';

@Injectable({
  providedIn: 'root'
})
export class FhirClientService {

  private client: Client | null = null;

  constructor() { }

  // 封裝 FHIR.oauth2.ready 邏輯
  async initializeClient(): Promise<Client> {

    if (this.client) return this.client; // 如果已經有了，直接回傳

    try {
      const ReadyOptions = { code: sessionStorage.getItem('code_self'), stateKey: sessionStorage.getItem('state_self') }
      this.client = await FHIR.oauth2.ready(ReadyOptions);
      return this.client;
    } catch (error) {
      console.error('FHIR Client 初始化失敗', error);
      throw error;
    }
  }

  // 供其他頁面取得已建立的 client
  getClient(): Client {
    if (!this.client) {
      throw new Error('Client 尚未初始化，請先呼叫 initializeClient');
    }
    return this.client;
  }

  // 包裝常用的 request 方法，減少重複程式碼
  async request(url: string, options?: any) {
    const client = this.getClient();
    return await client.request(url, options);
  }

}
