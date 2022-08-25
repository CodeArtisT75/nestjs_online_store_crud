import { IsString } from 'class-validator';

export class RegisterDto {
  @IsString()
  username: string;

  @IsString()
  password: string;

  @IsString()
  password_confirmation: string;

  @IsString()
  name: string;
}
