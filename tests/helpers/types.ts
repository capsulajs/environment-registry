export interface Env {
  services: {
    serviceName: string;
    url: string;
    methods: Record<string, { asyncModel: string }>;
  }[];
}
