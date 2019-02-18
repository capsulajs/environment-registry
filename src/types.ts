import { Env } from './api/Env';

export interface ConfigEntry {
  key: string;
  value: Env;
}

export interface EntriesResponse {
  entries: ConfigEntry[];
}
