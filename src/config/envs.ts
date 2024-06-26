import 'dotenv/config';
import * as joi from 'joi';

interface IEnvVars {
    NATS_SERVERS: string[];
    DATABASE_URL: string;
}

const envsSchema = joi.object({
    DATABASE_URL: joi.string().required(),
    NATS_SERVERS: joi.array().items(joi.string().required()),
})
.unknown(true);

const {error,value} = envsSchema.validate({
    ...process.env,
    NATS_SERVERS: process.env.NATS_SERVERS?.split(',')
});

if (error) {
    throw new Error(`Config validation error: ${error.message}`);
}

const envVars : IEnvVars = value;

export const envs = {
    databaseUrl: envVars.DATABASE_URL,
    natsServers: envVars.NATS_SERVERS
}