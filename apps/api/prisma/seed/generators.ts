import { faker } from '@faker-js/faker';

export type WorkspaceGenContext = {
  workspaceIndex: number;
  ownerUserId: string;
};

export type TicketListGenContext = {
  workspaceIndex: number;
  listIndex: number;
};

export type TicketGenContext = {
  workspaceIndex: number;
  listIndex: number;
  ticketIndex: number;
};

export type LabelGenContext = {
  workspaceIndex: number;
  labelIndex: number;
};

export type CommentGenContext = {
  workspaceIndex: number;
  ticketIndex: number;
  commentIndex: number;
};

export type SeedGenerators = {
  userName: (email: string) => string;
  workspaceName: (ctx: WorkspaceGenContext) => string;
  ticketListName: (ctx: TicketListGenContext) => string;
  ticketTitle: (ctx: TicketGenContext) => string;
  ticketDescription: (ctx: TicketGenContext) => string;
  workspaceLabelName: (ctx: LabelGenContext) => string;
  commentBody: (ctx: CommentGenContext) => string;
};

const STREAM_NAMES = ['Northstar', 'Orion', 'Velocity', 'Summit', 'Ridge'];

const FALLBACK_LIST_NAMES = ['Backlog', 'In progress', 'Done', 'Review', 'Released'];

export const defaultSeedGenerators: SeedGenerators = {
  userName: (_email: string) => faker.person.fullName(),
  workspaceName: ({ workspaceIndex }) => {
    const stream = STREAM_NAMES[workspaceIndex % STREAM_NAMES.length]!;
    return `${stream} — ${faker.commerce.productName()}`;
  },
  ticketListName: ({ listIndex }) => {
    return FALLBACK_LIST_NAMES[listIndex] ?? `Column ${listIndex + 1}`;
  },
  ticketTitle: ({ ticketIndex, listIndex }) => {
    const verbs = ['Fix', 'Implement', 'Investigate', 'Polish', 'Migrate', 'Document'];
    const noun = faker.commerce.productDescription().split(' ').slice(0, 4).join(' ');
    return `${verbs[(ticketIndex + listIndex) % verbs.length]!} ${noun}`;
  },
  ticketDescription: () => {
    const steps = Array.from({ length: 3 }, () => faker.hacker.phrase());
    return `## Context\n${faker.lorem.paragraph()}\n\n## Acceptance\n- ${steps.join('\n- ')}`;
  },
  workspaceLabelName: ({ labelIndex }) => {
    const presets = ['bug', 'enhancement', 'ops', 'design', 'blocked', 'customer', 'security'];
    return presets[labelIndex % presets.length]!;
  },
  commentBody: () => faker.lorem.paragraph({ min: 1, max: 3 }),
};

export function mergeGenerators(partial: Partial<SeedGenerators>): SeedGenerators {
  return { ...defaultSeedGenerators, ...partial };
}
