interface Service {
  serviceName: string;
  url: string;
  methods: Record<string, { asyncModel: string }>;
}

export interface Env {
  services: Service[];
}
