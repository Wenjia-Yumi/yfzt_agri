import { Injectable, NotFoundException, ConflictException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { CertificateEntity } from '../../database/entities/certificate.entity'
import { UserEntity } from '../../database/entities/user.entity'
import { IssueCertDto } from './dto/issue-cert.dto'

@Injectable()
export class CertificateService {
  constructor(
    @InjectRepository(CertificateEntity)
    private readonly certRepo: Repository<CertificateEntity>,
    @InjectRepository(UserEntity)
    private readonly userRepo: Repository<UserEntity>,
  ) {}

  async getMyCertificates(userId: string): Promise<CertificateEntity[]> {
    return this.certRepo.find({ where: { userId }, order: { issuedAt: 'DESC' } })
  }

  async issue(userId: string, dto: IssueCertDto): Promise<CertificateEntity> {
    const existing = await this.certRepo.findOne({ where: { userId, nodeId: dto.nodeId } })
    if (existing) throw new ConflictException('该节点证书已存在')

    const user = await this.userRepo.findOne({ where: { id: userId } })
    if (!user) throw new NotFoundException('用户不存在')

    const certCode = `LGP-${dto.graphId.toUpperCase().slice(0, 3)}-${dto.nodeId.toUpperCase()}-${Date.now().toString(36).toUpperCase()}`

    const cert = this.certRepo.create({
      userId,
      nodeId: dto.nodeId,
      graphId: dto.graphId,
      certCode,
      issuerName: '终身成长平台',
      recipientName: user.displayName,
    })
    return this.certRepo.save(cert)
  }

  async verify(certCode: string): Promise<CertificateEntity> {
    const cert = await this.certRepo.findOne({ where: { certCode } })
    if (!cert) throw new NotFoundException('证书不存在或已失效')
    return cert
  }
}
