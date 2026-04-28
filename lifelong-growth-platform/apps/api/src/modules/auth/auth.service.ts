import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import * as bcrypt from 'bcryptjs'
import { UserEntity } from '../../database/entities/user.entity'
import { LoginDto } from './dto/login.dto'
import { RegisterDto } from './dto/register.dto'
import { UserRole } from '@lifelong/types'

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepo: Repository<UserEntity>,
    private readonly jwtService: JwtService,
  ) {}

  async register(dto: RegisterDto): Promise<{ user: UserEntity; token: string }> {
    const existing = await this.userRepo.findOne({ where: { email: dto.email } })
    if (existing) throw new ConflictException('该邮箱已被注册')

    const passwordHash = await bcrypt.hash(dto.password, 12)
    const user = this.userRepo.create({
      email: dto.email,
      passwordHash,
      displayName: dto.displayName,
      role: UserRole.STUDENT,
    })
    await this.userRepo.save(user)

    const token = this.signToken(user)
    return { user, token }
  }

  async login(dto: LoginDto): Promise<{ user: UserEntity; token: string }> {
    const user = await this.userRepo.findOne({ where: { email: dto.email } })
    if (!user) throw new UnauthorizedException('邮箱或密码错误')

    const isMatch = await bcrypt.compare(dto.password, user.passwordHash)
    if (!isMatch) throw new UnauthorizedException('邮箱或密码错误')

    const token = this.signToken(user)
    return { user, token }
  }

  private signToken(user: UserEntity): string {
    return this.jwtService.sign({ sub: user.id, email: user.email, role: user.role })
  }
}
