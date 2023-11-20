import { PrismaClient } from '@prisma/client';

import { env } from '$env/dynamic/private';

const dev = import.meta.env.DEV;
console.log('😍', dev);
console.log('😍', env.NODE_ENV);
const client = global.prisma || new PrismaClient();

if (env.NODE_ENV === 'development') global.prisma = client;

export { client };
