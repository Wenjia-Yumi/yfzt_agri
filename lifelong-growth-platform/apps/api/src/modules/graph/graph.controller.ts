import { Controller, Get, Patch, Param, Body, Query, UseGuards, Request } from '@nestjs/common'
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard'
import { CurrentUser } from '../../common/decorators/current-user.decorator'
import { AuthTokenPayload } from '@lifelong/types'
import { GraphService } from './graph.service'
import { UpdateNodeStatusDto } from './dto/update-node-status.dto'

@Controller('graph')
export class GraphController {
  constructor(private readonly graphService: GraphService) {}

  // 获取图谱（已登录时叠加个人进度）
  @Get(':graphId')
  getGraph(@Param('graphId') graphId: string, @Request() req: any) {
    const userId = req.user?.sub as string | undefined
    return this.graphService.getGraphByDomain(graphId, userId)
  }

  // 获取节点详情
  @Get('node/:nodeId')
  getNodeDetail(@Param('nodeId') nodeId: string) {
    return this.graphService.getNodeDetail(nodeId)
  }

  // 更新用户节点状态（需登录）
  @Patch('node/:nodeId/status')
  @UseGuards(JwtAuthGuard)
  updateNodeStatus(
    @Param('nodeId') nodeId: string,
    @Body() dto: UpdateNodeStatusDto,
    @CurrentUser() user: AuthTokenPayload,
  ) {
    return this.graphService.updateNodeStatus(user.sub, nodeId, dto.status)
  }

  // 获取用户图谱进度（需登录）
  @Get(':graphId/progress')
  @UseGuards(JwtAuthGuard)
  getProgress(@Param('graphId') graphId: string, @CurrentUser() user: AuthTokenPayload) {
    return this.graphService.getUserGraphProgress(user.sub, graphId)
  }

  // AI 推荐学习路径（需登录）
  @Get('path/recommend/:targetNodeId')
  @UseGuards(JwtAuthGuard)
  getRecommendedPath(
    @Param('targetNodeId') targetNodeId: string,
    @CurrentUser() user: AuthTokenPayload,
  ) {
    return this.graphService.getRecommendedPath(user.sub, targetNodeId)
  }
}
