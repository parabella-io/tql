import { PrismaClient } from '@prisma/client/extension';
import { User } from '@server/database';
import { UserContext, UserEntity } from '@server/schema/schema';

type UpdateUserArgs = {
  userId: string;
  name: string;
};

export class UserService {
  constructor(private readonly db: PrismaClient) {}

  async update(user: UserContext, args: UpdateUserArgs): Promise<UserEntity> {
    const { userId, name } = args;

    const updatedUser = await this.db.user.update({
      where: { id: userId },
      data: { name },
    });

    return UserService.toEntity(updatedUser);
  }

  async getById(userId: string): Promise<UserEntity> {
    const user = await this.db.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new Error('User not found');
    }

    return UserService.toEntity(user);
  }

  static toEntity(user: User): UserEntity {
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      createdAt: user.createdAt.toISOString(),
      updatedAt: user.updatedAt.toISOString(),
    };
  }
}
