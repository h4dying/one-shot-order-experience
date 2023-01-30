import { body } from 'express-validator';
import { AppError, AppErrorCode } from '../../../shared';

/**
 * The create user data-model validator.
 */
export const updateUserValidator = [
  /* firstName field */
  body('firstName').optional({ nullable: true }).isString().withMessage({
    code: AppErrorCode.InvalidType,
    title: AppError.InvalidType,
    detail: 'USER.FIRST_NAME_INVALID_TYPE'
  }),

  /* lastName field */
  body('lastName').optional({ nullable: true }).isString().withMessage({
    code: AppErrorCode.InvalidType,
    title: AppError.InvalidType,
    detail: 'USER.LAST_NAME_INVALID_TYPE'
  }),

  /* email field */
  body('email').optional({ nullable: true }).trim().toLowerCase().isEmail().withMessage({
    code: AppErrorCode.InvalidType,
    title: AppError.InvalidType,
    detail: 'USER.EMAIL_INVALID_TYPE'
  }),

  /* password field */
  body('password')
    .optional({ nullable: true })
    .isString()
    .withMessage({
      code: AppErrorCode.InvalidType,
      title: AppError.InvalidType,
      detail: 'USER.PASSWORD_INVALID_TYPE'
    })
    .notEmpty({ ignore_whitespace: true })
    .withMessage({
      code: AppErrorCode.InvalidLength,
      title: AppError.InvalidLength,
      detail: 'SECURITY.USER.INVALID_PASSWORD_FIELD_LENGTH'
    })
    .isLength({ min: 8, max: 32 })
    .withMessage({
      code: AppErrorCode.InvalidLength,
      title: AppError.InvalidLength,
      detail: 'USER.PASSWORD_INVALID_LENGTH'
    })
];
