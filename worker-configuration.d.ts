interface Env {
  SECRET: string;
  PASSWORD: string;

  PING: DurableObjectNamespace;
  INTEGRATION: DurableObjectNamespace;
}

type Bindings = {
  [K in keyof Env]: Env[K];
}

type Variables<T> = {
  state: T & {
    storage: DurableObjectStorage;
  };
};
