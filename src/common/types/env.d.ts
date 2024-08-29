namespace NodeJs {
  interface ProcessEnv {
    // Application
    PORT: number;

    // Database
    DB_PORT: number;
    DB_NAME: string;
    DB_USERNAME: string;
    DB_PASSWORD: string;
    DB_HOST: string;
  }
}
