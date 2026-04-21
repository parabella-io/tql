import { PrismaClient } from '@server/database';

type QueryNotificationsArgs = {
  userId: string;
  order: 'asc' | 'desc';
  limit: number;
};

export class NotificationService {
  constructor(private readonly db: PrismaClient) {}

  async query(args: QueryNotificationsArgs) {
    const { userId, order, limit } = args;

    return this.db.notification.findMany({
      where: { userId },
      orderBy: {
        createdAt: order,
      },
      take: limit,
    });
  }
}
