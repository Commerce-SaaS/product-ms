import { z } from 'zod';
import 'dotenv/config';

const envSchema = z
  .object({
    PORT: z.coerce.number().default(3000),
    NATS_SERVERS: z
      .string()
      .transform((val) => val.split(',').map((s) => s.trim()))
      .refine((arr) => Array.isArray(arr) && arr.every((s) => !!s), {
        message: 'NATS_SERVERS must be a comma-separated list of non-empty strings',
      }),
  })
  .required();

const parsedEnv = envSchema.safeParse(process.env);

if (!parsedEnv.success) {
  console.error(
    '❌ Invalid environment variables:',
    parsedEnv.error.flatten().fieldErrors,
  );
  throw new Error('Invalid environment variables');
}

export const envs = {
  port: parsedEnv.data.PORT,
  natsServers: parsedEnv.data.NATS_SERVERS,
};