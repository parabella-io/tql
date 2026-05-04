import Fastify, { FastifyInstance } from 'fastify';
import cors from '@fastify/cors';
import { db } from './database-client';
import { schema, SchemaContext, UserContext } from './schema/index';
import { auth } from './auth';
import { FastifyRequest, FastifyReply } from 'fastify';
import { InMemoryEffectQueue, Server as TQLServer, createFastifyHttpAdapter } from '@tql/server';
import { createTqlPlugins } from './schema/security';
import {
  workspaceService,
  ticketsService,
  ticketAttachmentsService,
  ticketCommentsService,
  ticketLabelsService,
  ticketReporterService,
  ticketAssigneeService,
  workspaceMemberService,
  ticketListsService,
  storageService,
  workspaceTicketLabelService,
  workspaceMemberInviteService,
  userService,
} from './services';

import z from 'zod';

import type { ClientSchema } from '../__generated__/schema.d.ts';

declare module 'fastify' {
  interface FastifyRequest {
    user: UserContext;
  }
}

export const server = Fastify({
  logger: true,
});

server.register(cors, {
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Access-Control-Allow-Origin', 'Content-Type', 'Authorization'],
  credentials: true,
});

server.register(authRoutes);

server.register(protectedRoutes);

server.listen({ port: 3001 }, (err, address) => {
  if (err) {
    server.log.error(err);
    process.exit(1);
  }

  server.log.info(`Server is running on ${address}`);
});

async function authRoutes(server: FastifyInstance) {
  server.route({
    method: ['GET', 'POST'],
    url: '/api/auth/*',
    async handler(request, reply) {
      try {
        const url = new URL(request.url, `http://${request.headers.host}`);
        const headers = new Headers();
        Object.entries(request.headers).forEach(([key, value]) => {
          if (value) headers.append(key, value.toString());
        });
        const req = new Request(url.toString(), {
          method: request.method,
          headers,
          body: request.body ? JSON.stringify(request.body) : undefined,
        });
        const response = await auth.handler(req);
        reply.status(response.status);
        response.headers.forEach((value, key) => reply.header(key, value));
        reply.send(response.body ? await response.text() : null);
      } catch (error: any) {
        server.log.error(error, 'Authentication Error');
        reply.status(500).send({
          error: 'Internal authentication error',
          code: 'AUTH_FAILURE',
        });
      }
    },
  });
}

async function protectedRoutes(server: FastifyInstance) {
  server.addHook('preHandler', async (request: FastifyRequest, reply: FastifyReply) => {
    const session = await auth.api.getSession({
      headers: request.headers as HeadersInit,
    });

    if (!session) {
      return reply.status(401).send({ error: 'Invalid Session' });
    }

    const workspaces = await db.workspace.findMany({
      where: {
        members: {
          some: {
            userId: session.user.id,
          },
        },
      },
      select: {
        id: true,
      },
    });

    const workspaceIds = workspaces.map((workspace) => workspace.id);

    request.user = {
      id: session.user.id,
      email: session.user.email,
      workspaceIds: workspaceIds,
    };
  });

  server.post('/storage/put-presigned-url', async (request, reply) => {
    const body = z
      .object({
        key: z.string(),
        expiresIn: z.number().default(3600),
      })
      .parse(request.body);

    const signedUrl = await storageService.putPresignedUrl({
      key: body.key,
      expiresIn: body.expiresIn,
    });

    return reply.send({
      signedUrl,
    });
  });

  server.post('/storage/get-presigned-url', async (request, reply) => {
    const body = z
      .object({
        key: z.string(),
        expiresIn: z.number().default(3600),
      })
      .parse(request.body);

    const signedUrl = await storageService.getPresignedUrl({
      key: body.key,
      expiresIn: body.expiresIn,
    });

    return reply.send({
      signedUrl,
    });
  });

  const createContext = async ({ request }: { request: any }): Promise<SchemaContext> => {
    return {
      db: db,
      userService: userService,
      workspaceService: workspaceService,
      workspaceTicketLabelService: workspaceTicketLabelService,
      workspaceMemberInviteService: workspaceMemberInviteService,
      ticketsService: ticketsService,
      ticketListsService: ticketListsService,
      ticketAttachmentsService: ticketAttachmentsService,
      ticketCommentsService: ticketCommentsService,
      ticketLabelsService: ticketLabelsService,
      ticketAssigneeService: ticketAssigneeService,
      ticketReporterService: ticketReporterService,
      workspaceMemberService: workspaceMemberService,
      storageService: storageService,
      user: request.user,
    };
  };

  const tqlServer: TQLServer<ClientSchema> = new TQLServer({
    schema,
    generateSchema: {
      enabled: true,
      outputPath: './__generated__/schema.d.ts',
    },
    createContext,
    effects: {
      queue: new InMemoryEffectQueue(),
    },
    plugins: createTqlPlugins(),
  });

  tqlServer.attachHttp(createFastifyHttpAdapter(server));
}
