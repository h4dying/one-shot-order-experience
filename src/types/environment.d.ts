declare global {
  namespace NodeJS {
    interface ProcessEnv {
      SERVER_PORT: number;
      DB_PORT: number;
      DB_USER: string;
      ENV: 'development' | 'production';
      DB_HOST: string;
      DB_NAME: string;
      DB_PASSWORD: string;
      DB_REQUIRES_SSL: boolean;
      DB_MAX_POOL_SIZE: number;
      HASHING_SALT_ROUNDS: number;
    }
  }
}

export {};
