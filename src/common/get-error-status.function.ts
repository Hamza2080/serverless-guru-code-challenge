import {
  BadRequestError,
  ItemNotFoundException,
  AccountAlreadyExistsError,
  UnprocessibleEntity,
  UnauthenticatedClientError,
  DuplicateDataError,
  ForbiddenError,
  ConflictState
}
  from 'src/common/error';

/**
 * @return {number}
 */
export const getErrorStatus = (error: Error): number => {
  switch (true) {
    case error instanceof BadRequestError:
      return 400;
    case error instanceof UnauthenticatedClientError:
      return 401;
    case error instanceof ForbiddenError:
      return 403;
    case error instanceof ItemNotFoundException:
      return 404;
    case error instanceof ConflictState:
      return 409;
    case error instanceof DuplicateDataError:
      return 409;
    case error instanceof UnprocessibleEntity:
    case error instanceof AccountAlreadyExistsError:
      return 422;
    default:
      return 500;
  }
};
