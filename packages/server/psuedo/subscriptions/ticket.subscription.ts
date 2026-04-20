// import z from 'zod';

// import { schema } from '../../schema';

// export const notificationsSubscription = schema.subscription({
//   models: ['notification'],

//   args: z.object({
//     notificationId: z.string(),
//   }),

//   allow: ({ context, args }) => {
//     return true;
//   },

//   keyFromArgs: ({ context }) => {
//     return `user:${context.user.id}`;
//   },

//   keyFromEntity: ({ entity }) => {
//     return `user:${entity.userId}`;
//   },
// });

// export const ticketSubscription = schema.subscription({
//   models: ['ticket', 'ticketAssignee', 'ticketReporter', 'ticketLabel', 'ticketAttachment', 'ticketComment'],

//   args: z.object({
//     ticketId: z.string(),
//   }),

//   allow: ({ context, args }) => {
//     return true;
//   },

//   keyFromArgs: ({ args }) => {
//     return `ticket:${args.ticketId}`;
//   },

//   keyFromEntity: ({ entity }) => {
//     return `ticket:${entity.ticketId}`;
//   },
// });

// export const chatRoomListSubscription = schema.subscription({
//   models: ['chatRoom', 'chatMessage'],

//   args: z.object({
//     chatRoomId: z.string(),
//   }),

//   allow: ({ context, args }) => {
//     return true;
//   },

//   keyFromArgs: ({ args }) => {
//     return `rooms`;
//   },

//   keyFromEntity: ({ entity }) => {
//     return `rooms`;
//   },

//   filter: ({ connection, args, entity }) => {
//     return connection.rooms.has(entity.roomId);
//   },
// });

// export const chatRoomSubscription = schema.subscription({
//   models: ['chatRoom', 'chatMessage'],

//   args: z.object({
//     chatRoomId: z.string(),
//   }),

//   allow: ({ context, args }) => {
//     return true;
//   },

//   keyFromArgs: ({ args }) => {
//     return `rooms:${args.chatRoomId}`;
//   },

//   keyFromEntity: ({ entity }) => {
//     return `rooms:${entity.chatRoomId}`;
//   },

//   filter: ({ connection, args, entity }) => {
//     return connection.rooms.has(entity.roomId);
//   },
// });
