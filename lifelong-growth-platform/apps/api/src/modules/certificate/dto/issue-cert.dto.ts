import { IsString } from 'class-validator'

export class IssueCertDto {
  @IsString()
  nodeId!: string

  @IsString()
  graphId!: string
}
