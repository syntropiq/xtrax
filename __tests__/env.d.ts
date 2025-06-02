declare module "cloudflare:test" {
  // ProvidedEnv controls the type of `import("cloudflare:test").env`
  interface ProvidedEnv {
    NODE_ENV: string;
  }
}