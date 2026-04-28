import { IsEmail, IsString, MinLength, MaxLength } from 'class-validator'

export class RegisterDto {
  @IsEmail({}, { message: '请输入有效的邮箱地址' })
  email!: string

  @IsString()
  @MinLength(6, { message: '密码至少6位' })
  password!: string

  @IsString()
  @MinLength(2, { message: '昵称至少2个字符' })
  @MaxLength(20, { message: '昵称最多20个字符' })
  displayName!: string
}
