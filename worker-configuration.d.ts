interface Env {
  SECRET: string;
  PASSWORD: string;

  PING: DurableObjectNamespace;
  INTEGRATION: DurableObjectNamespace;
}

type Bindings = {
  [K in keyof Env]: Env[K];
}
