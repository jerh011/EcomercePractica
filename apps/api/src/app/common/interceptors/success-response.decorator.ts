import { SetMetadata } from '@nestjs/common';

export const SUCCESS_RESPONSE_MESSAGE = 'success_response_message';

export function SuccessResponse(message: string) {
  return SetMetadata(SUCCESS_RESPONSE_MESSAGE, message);
}
