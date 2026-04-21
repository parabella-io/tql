export enum TQLServerErrorType {
  MutationNotFoundError = 'Mutation not found',
  MutationInputSchemaError = 'Mutation input schema error',
  MutationNotAllowedError = 'Mutation not allowed',
  MutationError = 'Mutation error',
  MutationResponseMalformedError = 'Mutation response malformed',

  QueryNotFoundError = 'Query not found',
  QueryModelNotFoundError = 'Query model not found',
  QueryIncludeNotFoundError = 'Query include not found',
  QueryInputSchemaValidationError = 'Query input schema validation error',
  QueryCursorSchemaValidationError = 'Query cursor schema validation error',
  QueryMetadataSchemaValidationError = 'Query metadata schema validation error',
  QueryEntitySchemaValidationError = 'Query entity schema error',
  QueryError = 'Query error',
  QueryNotAllowedError = 'Query not allowed',

  SubscriptionNotFoundError = 'Subscription not found',
  SubscriptionArgsSchemaError = 'Subscription args schema error',
  SubscriptionNotAllowedError = 'Subscription not allowed',
  SubscriptionError = 'Subscription error',

  DuplicateModelNameError = 'Duplicate model name',

  EntityNotFoundError = 'Entity not found',
  EntityUnauthorizedError = 'Entity unauthorized',

  WebSocketMessageMalformedError = 'WebSocket message malformed',
  WebSocketMessageUnsupportedError = 'WebSocket message type unsupported',
}

export type FormattedTQLServerError = {
  type: string;
  details?: Record<string, any>;
};

export class TQLServerError extends Error {
  constructor(
    type: TQLServerErrorType,
    public details?: Record<string, any>,
  ) {
    super(type);
    this.name = 'TQLServerError';
    this.message = type;
    this.details = details;
  }

  getFormattedError(): FormattedTQLServerError {
    return {
      type: this.message,
      details: this.details,
    };
  }
}

export class NotFoundError extends TQLServerError {
  constructor(message: string = 'Entity not found') {
    super(TQLServerErrorType.EntityNotFoundError, { message });
  }
}

export class UnauthorizedError extends TQLServerError {
  constructor(message: string = 'Entity unauthorized') {
    super(TQLServerErrorType.EntityUnauthorizedError, { message });
  }
}
