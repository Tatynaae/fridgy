import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { databaseOptions } from './database.config.js';

process.loadEnvFile?.(new URL('../../.env', import.meta.url).pathname);

export default new DataSource(databaseOptions());
