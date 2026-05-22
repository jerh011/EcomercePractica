import { ApiProperty } from '@nestjs/swagger';

export class AppMessageSwaggerDto {
  @ApiProperty({
    type: String,
    description: 'Starter API response message.',
    example: 'Hello API',
  })
  message!: string;
}
