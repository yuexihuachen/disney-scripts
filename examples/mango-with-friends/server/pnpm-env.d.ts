declare module '*.html' {
  const value: string;
  export default value;
}

declare module "bun" {
  interface Env {
    AT_SECRET: string;
    RT_SECRET: string;
    JWT_SECRET: string;
    XSRF_SECRET: string;
    PORT: string;
    SESSION_SECRET: string;
    MONGO_URI: string;
  }
}

declare module 'nunjucks';
