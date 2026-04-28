import { Injectable } from '@nestjs/common'
import { GraphService } from '../graph/graph.service'
import { UpdateProgressDto } from './dto/update-progress.dto'

@Injectable()
export class LearningService {
  constructor(private readonly graphService: GraphService) {}

  async getProgress(userId: string, graphId: string) {
    return this.graphService.getUserGraphProgress(userId, graphId)
  }

  async updateProgress(userId: string, graphId: string, dto: UpdateProgressDto) {
    return this.graphService.updateNodeStatus(userId, dto.nodeId, dto.status, graphId)
  }
}
