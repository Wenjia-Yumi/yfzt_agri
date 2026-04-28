import { Controller, Post, Body, Res, UseGuards, Request } from '@nestjs/common'
import { Response } from 'express'
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard'
import { CurrentUser } from '../../common/decorators/current-user.decorator'
import { AuthTokenPayload } from '@lifelong/types'
import { AIService } from './ai.service'
import { ChatDto, LearningPathDto } from './dto/chat.dto'

@Controller('ai')
export class AIController {
  constructor(private readonly aiService: AIService) {}

  // 流式对话（SSE）
  @Post('chat/stream')
  @UseGuards(JwtAuthGuard)
  async streamChat(@Body() dto: ChatDto, @Res() res: Response) {
    const messages = [
      ...(dto.history ?? []),
      { role: 'user' as const, content: dto.content },
    ]
    return this.aiService.streamChat(messages, res)
  }

  // 非流式对话
  @Post('chat')
  @UseGuards(JwtAuthGuard)
  async chat(@Body() dto: ChatDto) {
    const messages = [
      ...(dto.history ?? []),
      { role: 'user' as const, content: dto.content },
    ]
    const reply = await this.aiService.chat(messages)
    return { reply }
  }

  // 生成学习路径建议
  @Post('learning-path')
  @UseGuards(JwtAuthGuard)
  getLearningPath(@Body() dto: LearningPathDto, @CurrentUser() user: AuthTokenPayload) {
    return this.aiService.generateLearningPath(user.sub, dto.targetNodeId)
  }
}
