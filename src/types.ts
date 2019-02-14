import { Env } from './api/Env';

export type configEntry = { key: string, value: Env };

export type entriesResponse = { entries: configEntry[] };
