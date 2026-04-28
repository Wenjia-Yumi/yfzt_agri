import { IsEnum } from 'class-validator'
import { NodeStatus } from '@lifelong/types'

export class UpdateNodeStatusDto {
  @IsEnum(NodeStatus, { message: '无效的节点状态' })
  status!: NodeStatus
}
