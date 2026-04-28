import { IsString, IsEnum } from 'class-validator'
import { NodeStatus } from '@lifelong/types'

export class UpdateProgressDto {
  @IsString()
  nodeId!: string

  @IsEnum(NodeStatus)
  status!: NodeStatus
}
