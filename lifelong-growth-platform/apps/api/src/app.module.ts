import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { TypeOrmModule } from '@nestjs/typeorm'
import { AuthModule } from './modules/auth/auth.module'
import { UsersModule } from './modules/users/users.module'
import { GraphModule } from './modules/graph/graph.module'
import { LearningModule } from './modules/learning/learning.module'
import { CertificateModule } from './modules/certificate/certificate.module'
import { AIModule } from './modules/ai/ai.module'
import { EnterpriseModule } from './modules/enterprise/enterprise.module'
import { StartupModule } from './modules/startup/startup.module'
import { UserEntity } from './database/entities/user.entity'
import { LearningRecordEntity } from './database/entities/learning-record.entity'
import { CertificateEntity } from './database/entities/certificate.entity'

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: '../../.env' }),

    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        url: config.get<string>('DATABASE_URL'),
        entities: [UserEntity, LearningRecordEntity, CertificateEntity],
        synchronize: config.get('NODE_ENV') === 'development',
        logging: config.get('NODE_ENV') === 'development',
      }),
    }),

    AuthModule,
    UsersModule,
    GraphModule,
    LearningModule,
    CertificateModule,
    AIModule,
    EnterpriseModule,
    StartupModule,
  ],
})
export class AppModule {}
