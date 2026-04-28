import { IsString, IsOptional } from 'class-validator'

export class QueryGraphDto {
  @IsOptional()
  @IsString()
  domain?: string
}
