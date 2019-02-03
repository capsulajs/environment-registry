import {
  EnvRegistry as EnvRegistryInterface,
  EnvRegistryRequest,
  EnvRegistryResponse
} from './api/EnvRegistry';
import { Env } from "./api/Env";
import { Observable, from } from "rxjs";

export default class EnvRegistry implements EnvRegistryInterface{
  public register(envKey, env: Env): Promise<undefined> {
    return;
  }

  public environment$(envRegistryRequest: EnvRegistryRequest): Observable<EnvRegistryResponse> {
    const conf= [
      { develop: { accessPoints: [{ url: 'http://accessPoint/dev/service1'}, { url: 'http://accessPoint/dev/service2'}] }},
      { master: { accessPoints: [{ url: 'http://accessPoint/master/service1'}, { url: 'http://accessPoint/master/service2'}] }},
      { 'tag-1': { accessPoints: [{ url: 'http://accessPoint/tag-1/service1'}, { url: 'http://accessPoint/tag-1/service2'}] }},
      { 'tag-2': { accessPoints: [{ url: 'http://accessPoint/tag-2/service1'}] }},
    ];
    const mappedConf = conf.map(() => {});
    return from();
  }
}