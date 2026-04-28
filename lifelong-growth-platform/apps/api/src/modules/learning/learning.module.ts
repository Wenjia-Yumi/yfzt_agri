import { Module } from '@nestjs/common'
import { LearningController } from './learning.controller'
import { LearningService } from './learning.service'
import { GraphModule } from '../graph/graph.module'

@Module({
  imports: [GraphModule],
  controllers: [LearningController],
  providers: [LearningService],
})
export class LearningModule {}
