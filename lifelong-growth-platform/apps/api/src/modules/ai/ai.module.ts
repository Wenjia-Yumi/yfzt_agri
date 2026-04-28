import { Module } from '@nestjs/common'
import { AIController } from './ai.controller'
import { AIService } from './ai.service'
import { GraphModule } from '../graph/graph.module'
import { NodeRepository } from '../../database/graph/node.repository'

@Module({
  imports: [GraphModule],
  controllers: [AIController],
  providers: [AIService, NodeRepository],
})
export class AIModule {}
