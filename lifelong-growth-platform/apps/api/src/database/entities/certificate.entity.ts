import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm'
import { UserEntity } from './user.entity'

@Entity('certificates')
export class CertificateEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string

  @Column()
  userId!: string

  @Column()
  nodeId!: string

  @Column()
  graphId!: string

  @Column({ unique: true })
  certCode!: string

  @Column()
  issuerName!: string

  @Column()
  recipientName!: string

  @Column({ nullable: true })
  expiresAt?: Date

  @Column({ type: 'jsonb', nullable: true })
  metadata?: Record<string, unknown>

  @ManyToOne(() => UserEntity, (u) => u.certificates)
  user!: UserEntity

  @CreateDateColumn()
  issuedAt!: Date
}
