import { Injectable, Logger } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import Anthropic from '@anthropic-ai/sdk'
import { Response } from 'express'
import { GraphService } from '../graph/graph.service'
import { NodeRepository } from '../../database/graph/node.repository'

// 终身成长顾问的系统 Prompt —— 定义 AI 的角色、知识边界和回答风格
const SYSTEM_PROMPT = `你是「终身成长学习顾问」，服务于一个跨境电商学习平台。

## 你的角色定位
你是一位有丰富跨境电商从业经验的学习顾问，同时也是平台知识图谱的专家。你的目标是帮助用户：
1. 理解跨境电商七大星域（贸易基础、平台运营、流量营销、供应链管理、金融合规、数据智能、跨学科桥接）的知识体系
2. 根据用户当前的学习进度，提供个性化的学习路径建议
3. 解答跨境电商实操问题，理论结合实践
4. 解释知识节点之间的依赖关系和学习顺序

## 知识图谱结构
平台的知识体系以「跨境电商」为核心枢纽，向外扩展28个知识节点：
- 贸易基础星域：国际贸易基础、海关与清关、国际贸易术语(Incoterms)、外贸合同管理
- 平台运营星域：Amazon平台运营、Shopify独立站、Temu/Shein新兴平台、Listing优化
- 流量营销星域：PPC付费广告、社交媒体营销、SEO搜索优化、邮件营销、AIGC内容生成
- 供应链管理星域：供应商开发与采购、仓储与物流、品质管控、库存管理
- 金融合规星域：跨境支付与结汇、税务合规、风险控制
- 数据智能星域：数据分析、Python数据处理、BI工具应用
- 跨学科桥接星域：跨文化沟通、消费者心理学、商务英语、设计思维

## 回答风格
- 简洁实用，避免过多理论说教
- 优先给出可立即行动的建议
- 用数字、案例、对比表格增强说服力
- 如果是学习路径问题，给出清晰的步骤顺序
- 中文回答，专业名词可保留英文缩写（如：ACOS、CTR、VAT）
- 回答长度适中，重要信息用 **粗体** 标注`

@Injectable()
export class AIService {
  private readonly logger = new Logger(AIService.name)
  private readonly client: Anthropic

  constructor(
    private readonly config: ConfigService,
    private readonly graphService: GraphService,
    private readonly nodeRepo: NodeRepository,
  ) {
    this.client = new Anthropic({
      apiKey: this.config.get<string>('ANTHROPIC_API_KEY'),
    })
  }

  /**
   * 普通对话接口（非流式，适用于简短问答）
   * @param messages    对话历史（role + content 数组）
   * @param systemPrompt  可选的自定义 system prompt，默认使用平台内置 prompt
   */
  async chat(
    messages: Array<{ role: 'user' | 'assistant'; content: string }>,
    systemPrompt = SYSTEM_PROMPT,
  ): Promise<string> {
    const response = await this.client.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 2048,
      system: systemPrompt,
      messages,
    })

    const block = response.content[0]
    return block.type === 'text' ? block.text : ''
  }

  /**
   * 流式对话接口（SSE），适用于前端打字机效果
   * @param messages  对话历史
   * @param res       Express Response 对象，用于写入 SSE 流
   */
  async streamChat(
    messages: Array<{ role: 'user' | 'assistant'; content: string }>,
    res: Response,
  ): Promise<void> {
    res.setHeader('Content-Type', 'text/event-stream')
    res.setHeader('Cache-Control', 'no-cache')
    res.setHeader('Connection', 'keep-alive')

    try {
      const stream = await this.client.messages.create({
        model: 'claude-sonnet-4-6',
        max_tokens: 2048,
        system: SYSTEM_PROMPT,
        messages,
        stream: true,
      })

      for await (const event of stream) {
        if (event.type === 'content_block_delta' && event.delta.type === 'text_delta') {
          res.write(`data: ${JSON.stringify({ delta: event.delta.text })}\n\n`)
        }
      }

      res.write('data: [DONE]\n\n')
    } catch (err) {
      this.logger.error('流式对话失败', err)
      res.write(`data: ${JSON.stringify({ error: '生成失败，请重试' })}\n\n`)
    } finally {
      res.end()
    }
  }

  /**
   * 基于用户当前图谱状态，生成个性化学习路径建议
   * @param userId       用户 ID
   * @param targetSkill  目标技能节点 ID（如 'python_data'）
   *
   * 流程：
   * 1. 查询用户当前学习进度
   * 2. 查询目标节点的前置依赖路径
   * 3. 构建上下文信息，调用 Claude API 生成自然语言建议
   */
  async generateLearningPath(userId: string, targetSkill: string): Promise<{
    targetNodeId: string
    recommendedPath: string[]
    estimatedHours: number
    reasoning: string
  }> {
    // 1. 获取目标节点信息
    const targetNode = await this.nodeRepo.findById(targetSkill)
    if (!targetNode) {
      return {
        targetNodeId: targetSkill,
        recommendedPath: [],
        estimatedHours: 0,
        reasoning: `节点 '${targetSkill}' 不存在于知识图谱中。`,
      }
    }

    // 2. 获取推荐路径（图算法计算）
    const recommendedPath = await this.graphService.getRecommendedPath(userId, targetSkill)

    // 3. 获取用户进度概况
    const progress = await this.graphService.getUserGraphProgress(userId)

    // 4. 构建上下文，让 AI 生成自然语言解释
    const contextPrompt = `
用户当前学习状态：
- 已掌握节点数：${progress.masteredNodes}/${progress.totalNodes}
- 完成率：${progress.completionRate}%

用户的学习目标：掌握「${targetNode.label}」（${targetNode.description.slice(0, 100)}...）

系统计算的推荐学习路径（按顺序）：
${recommendedPath.length > 0 ? recommendedPath.join(' → ') : '（用户已满足前置条件，可直接开始学习）'}

请用2-3句话，用激励性的语气解释这个学习路径的逻辑和价值，以及预计需要多少时间。`

    const reasoning = await this.chat([{ role: 'user', content: contextPrompt }])

    // 预估时间（每个节点平均约20小时）
    const estimatedHours = recommendedPath.length * 20

    return {
      targetNodeId: targetSkill,
      recommendedPath,
      estimatedHours,
      reasoning,
    }
  }
}
