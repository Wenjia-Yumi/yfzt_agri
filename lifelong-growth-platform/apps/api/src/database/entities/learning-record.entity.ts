import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn, Unique } from 'typeorm'
import { NodeStatus } from '@lifelong/types'
import { UserEntity } from './user.entity'

@Entity('learning_records')
@Unique(['userId', 'graphId', 'nodeId'])
export class LearningRecordEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string

  @Column()
  userId!: string

  @Column()
  graphId!: string

  @Column()
  nodeId!: string

  @Column({ type: 'enum', enum: NodeStatus, default: NodeStatus.LOCKED })
  status!: NodeStatus

  @Column({ nullable: true })
  startedAt?: Date

  @Column({ nullable: true })
  masteredAt?: Date

  @Column({ nullable: true })
  lastReviewedAt?: Date

  @Column({ type: 'smallint', nullable: true })
  score?: number

  @ManyToOne(() => UserEntity, (u) => u.learningRecords)
  user!: UserEntity

  @CreateDateColumn()
  createdAt!: Date

  @UpdateDateColumn()
  updatedAt!: Date
}
