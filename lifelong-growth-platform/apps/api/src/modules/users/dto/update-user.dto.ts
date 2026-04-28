import { IsOptional, IsString, MaxLength } from 'class-validator'

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  @MaxLength(20)
  displayName?: string

  @IsOptional()
  @IsString()
  avatar?: string
}
