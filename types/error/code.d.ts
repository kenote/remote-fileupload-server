import { Maps } from 'kenote-config-helper'

export type ErrorCode = {
  ERROR_STATUS_NULL                : number

  ERROR_AUTH_FLAG_ACCESS           : number
  ERROR_AUTH_FLAG_OPERATE          : number
  ERROR_BYLOND_LEVEL_OPERATE       : number
  ERROR_VALID_IDMARK_NOTEXIST      : number
  ERROR_AUTH_OPERATE_GROUP_NULL    : number
  ERROR_NOT_FOUND_CHANNEL          : number
  ERROR_NOT_FOUND_API              : number
  ERROR_NOT_FOUND_ACCESSKEY        : number
  ERROR_ONLY_ADVANCED_ADMIN        : number
  ERROR_AUTH_OPERATE_USER_NULL     : number

  ERROR_UPLOAD_FILE_MIMETYPE       : number
  ERROR_UPLOAD_FILESIZE_LARGEMAX   : number
  ERROR_UPLOAD_NOT_FILE            : number
  ERROR_UPLOAD_TYPE_FLAG           : number

  ERROR_LOGINVALID_FAIL            : number
  ERROR_FINDUSER_NOTEXIST          : number

  ERROR_VALID_USERNAME_REQUIRED    : number
  ERROR_VALID_USERNAME_FORMAT      : number
  ERROR_VALID_USERNAME_UNIQUE      : number
  ERROR_VALID_PASSWORD_REQUIRED    : number
  ERROR_VALID_PASSWORD_FORMAT      : number
  ERROR_VALID_EMAIL_REQUIRED       : number
  ERROR_VALID_EMAIL_FORMAT         : number
  ERROR_VALID_EMAIL_UNIQUE         : number
  ERROR_VALID_MOBILE_REQUIRED      : number
  ERROR_VALID_MOBILE_FORMAT        : number
  ERROR_VALID_MOBILE_UNIQUE        : number
  ERROR_VALID_CHOOSEONE_MORE       : number
  ERROR_VALID_TICKET_REQUIRED      : number
  ERROR_VALID_TICKET_NULL          : number
  ERROR_VALID_TICKET_TYPE          : number
  ERROR_VALID_TICKET_USED          : number
  ERROR_VALID_TICKET_EXPIRED       : number

  ERROR_VALID_GROUP_REQUIRED       : number
  ERROR_VALID_GROUP_NOTEXIST       : number
  ERROR_VALID_DATE_REQUIRED        : number
  ERROR_VALID_DATE_FORMAT          : number
  ERROR_VALID_NAME_REQUIRED        : number
  ERROR_VALID_NAME_FORMAT          : number

  ERROR_VERIFY_EMAIL_TIMEOUT       : number
  ERROR_VERIFY_EMAIL_FAILED        : number
  ERROR_VERIFY_MOBILE_TIMEOUT      : number
  ERROR_VERIFY_MOBILE_FAILED       : number
  ERROR_VERIFY_TOKEN_VERIFIED      : number
  ERROR_SEND_MAILPHONE_STEP        : number
  ERROR_VERIFY_CODE_REQUIRED       : number
  ERROR_VERIFY_CODE_TIMEOUT        : number
  ERROR_VERIFY_CODE_FAILED         : number
  ERROR_VERIFY_ID_REQUIRED         : number
  ERROR_VERIFY_ID_TIMEOUT          : number
  ERROR_VERIFY_ID_FAILED           : number

  ERROR_CHANNEL_NOTEXIST           : number
} & Maps<number>