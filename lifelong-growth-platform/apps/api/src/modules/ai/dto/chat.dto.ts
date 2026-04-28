import { IsString, IsOptional, IsArray, ValidateNested } from 'class-validator'
import { Type } from 'class-transformer'

export class MessageDto {
  @IsString()
  role!: 'user' | 'assistant'

  @IsString()
  content!: string
}

export class ChatDto {
  @IsString()
  content!: string

  @IsOptional()
  @IsString()
  sessionId?: string

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => MessageDto)
  history?: MessageDto[]
}

export class LearningPathDto {
  @IsString()
  targetNodeId!: string
}
