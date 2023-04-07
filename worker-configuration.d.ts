interface Env {
  SECRET: string;
  PASSWORD: string;

  PING: DurableObjectNamespace;
}

type Bindings = {
  [K in keyof Env]: Env[K];
}
