import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm'
import { UserRole } from '@lifelong/types'
import { LearningRecordEntity } from './learning-record.entity'
import { CertificateEntity } from './certificate.entity'

@Entity('users')
export class UserEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string

  @Column({ unique: true })
  email!: string

  @Column()
  passwordHash!: string

  @Column()
  displayName!: string

  @Column({ nullable: true })
  avatar?: string

  @Column({ type: 'enum', enum: UserRole, default: UserRole.STUDENT })
  role!: UserRole

  @OneToMany(() => LearningRecordEntity, (r) => r.user)
  learningRecords!: LearningRecordEntity[]

  @OneToMany(() => CertificateEntity, (c) => c.user)
  certificates!: CertificateEntity[]

  @CreateDateColumn()
  createdAt!: Date

  @UpdateDateColumn()
  updatedAt!: Date
}
