import { body } from 'express-validator';
import { AppError, AppErrorCode } from '../../../shared';

export const loginUserValidator = [
  /* email field */
  body('email')
    .exists({ checkNull: true })
    .withMessage({
      code: AppErrorCode.IsRequired,
      title: AppError.IsRequired,
      detail: 'USER.EMAIL_REQUIRED'
    })
    .trim()
    .toLowerCase()
    .isEmail()
    .withMessage({
      code: AppErrorCode.InvalidType,
      title: AppError.InvalidType,
      detail: 'USER.EMAIL_INVALID_TYPE'
    }),

  /* password field */
  body('password')
    .exists({ checkNull: true })
    .withMessage({
      code: AppErrorCode.IsRequired,
      title: AppError.IsRequired,
      detail: 'USER.PASSWORD_REQUIRED'
    })
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
