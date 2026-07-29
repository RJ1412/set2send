import pkg from '@prisma/client';
const { PrismaClient } = pkg;
import { env } from "../config/env.js";

export const prisma = new PrismaClient();
