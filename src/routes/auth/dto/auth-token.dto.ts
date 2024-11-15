import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class AuthTokenDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => value, { toClassOnly: true })
  clientId: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => value, { toClassOnly: true })
  clientSecret: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => value, { toClassOnly: true })
  grantType: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  @Transform(({ value }) => value, { toClassOnly: true })
  code?: string;
}
