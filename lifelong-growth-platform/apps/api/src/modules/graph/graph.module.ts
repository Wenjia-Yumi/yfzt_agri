import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { GraphController } from './graph.controller'
import { GraphService } from './graph.service'
import { NodeRepository } from '../../database/graph/node.repository'
import { EdgeRepository } from '../../database/graph/edge.repository'
import { LearningRecordEntity } from '../../database/entities/learning-record.entity'

@Module({
  imports: [TypeOrmModule.forFeature([LearningRecordEntity])],
  controllers: [GraphController],
  providers: [GraphService, NodeRepository, EdgeRepository],
  exports: [GraphService],
})
export class GraphModule {}
