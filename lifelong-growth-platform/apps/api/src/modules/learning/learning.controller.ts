import { Controller, Get, Patch, Param, Body, UseGuards } from '@nestjs/common'
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard'
import { CurrentUser } from '../../common/decorators/current-user.decorator'
import { AuthTokenPayload } from '@lifelong/types'
import { LearningService } from './learning.service'
import { UpdateProgressDto } from './dto/update-progress.dto'

@Controller('learning')
@UseGuards(JwtAuthGuard)
export class LearningController {
  constructor(private readonly learningService: LearningService) {}

  @Get('progress/:graphId')
  getProgress(@Param('graphId') graphId: string, @CurrentUser() user: AuthTokenPayload) {
    return this.learningService.getProgress(user.sub, graphId)
  }

  @Patch('progress/:graphId')
  updateProgress(
    @Param('graphId') graphId: string,
    @Body() dto: UpdateProgressDto,
    @CurrentUser() user: AuthTokenPayload,
  ) {
    return this.learningService.updateProgress(user.sub, graphId, dto)
  }
}
