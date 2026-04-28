import { Controller, Get, Patch, Body, UseGuards } from '@nestjs/common'
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard'
import { CurrentUser } from '../../common/decorators/current-user.decorator'
import { AuthTokenPayload } from '@lifelong/types'
import { UsersService } from './users.service'
import { UpdateUserDto } from './dto/update-user.dto'

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  getProfile(@CurrentUser() user: AuthTokenPayload) {
    return this.usersService.findById(user.sub)
  }

  @Patch('me')
  updateProfile(@CurrentUser() user: AuthTokenPayload, @Body() dto: UpdateUserDto) {
    return this.usersService.update(user.sub, dto)
  }
}
