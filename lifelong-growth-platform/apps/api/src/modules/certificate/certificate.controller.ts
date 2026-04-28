import { Controller, Get, Post, Param, Body, UseGuards } from '@nestjs/common'
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard'
import { CurrentUser } from '../../common/decorators/current-user.decorator'
import { AuthTokenPayload } from '@lifelong/types'
import { CertificateService } from './certificate.service'
import { IssueCertDto } from './dto/issue-cert.dto'

@Controller('certificate')
export class CertificateController {
  constructor(private readonly certService: CertificateService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  getMyCertificates(@CurrentUser() user: AuthTokenPayload) {
    return this.certService.getMyCertificates(user.sub)
  }

  @Post('issue')
  @UseGuards(JwtAuthGuard)
  issue(@Body() dto: IssueCertDto, @CurrentUser() user: AuthTokenPayload) {
    return this.certService.issue(user.sub, dto)
  }

  @Get('verify/:certCode')
  verify(@Param('certCode') certCode: string) {
    return this.certService.verify(certCode)
  }
}
