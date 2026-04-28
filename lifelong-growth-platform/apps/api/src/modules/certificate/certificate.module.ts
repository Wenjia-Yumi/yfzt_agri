import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { CertificateController } from './certificate.controller'
import { CertificateService } from './certificate.service'
import { CertificateEntity } from '../../database/entities/certificate.entity'
import { UserEntity } from '../../database/entities/user.entity'

@Module({
  imports: [TypeOrmModule.forFeature([CertificateEntity, UserEntity])],
  controllers: [CertificateController],
  providers: [CertificateService],
})
export class CertificateModule {}
