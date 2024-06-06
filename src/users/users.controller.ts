import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Req,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from '../auth/auth.service';
import { Public } from '../auth/decorators/public.decorator';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(
    private usersService: UsersService,
    private authService: AuthService,
  ) {}

  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('signin')
  async signIn(@Body() data: UpdateUserDto) {
    const user = await this.usersService.findUniqueByEmail(data.email, {
      password: true,
    });

    if (!user) {
      throw new BadRequestException(['User does not exist']);
    }

    return this.authService.signToken(user, data);
  }

  @Public()
  @Post('signup')
  async signUp(@Body() data: CreateUserDto) {
    const emailExists = await this.usersService.findUniqueByEmail(data.email);

    if (emailExists) {
      throw new BadRequestException('E-mail already exists');
    }

    const newUser = await this.usersService.create(data);

    return this.authService.signToken(newUser);
  }

  @Public()
  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Public() // Porém, se o usuário tiver token, consegue ver a senha também.
  @Get('profile/:email')
  async findUniqueByEmail(@Param('email') email: string, @Req() req) {
    let select = {};
    if (req?.user) select = { password: true };

    const user = await this.usersService.findUniqueByEmail(email, select);
    if (!user) {
      throw new BadRequestException(['User does not exist']);
    }

    return user;
  }

  @Patch('profile/:id/configuration')
  async patchUser(
    @Req() req,
    @Param('id', ParseIntPipe) id: number,
    @Body() data: UpdateUserDto,
  ) {
    if (id !== req?.user.id) {
      throw new UnauthorizedException([
        'You do not have permission to modify the data',
      ]);
    }

    const users = await this.usersService.findMany(
      { id },
      { email: data.email },
    );

    const message: string[] = [];
    users.forEach((user) => {
      // Há possibilidade de gerar mensagem duplicada.
      if (user.id !== data.id) message.push('User does not exist');
      if (user.email === data.email) message.push('E-mail already exists');
    });

    if (message.length > 0) {
      throw new BadRequestException(message);
    }

    return this.usersService.update(req.user.id, data);
  }

  @Delete('profile/:id')
  async deleteUser(@Req() req, @Param('id', ParseIntPipe) id: number) {
    if (id !== req?.user.id) {
      throw new UnauthorizedException([
        'You do not have permission to delete this user',
      ]);
    }

    const user = await this.usersService.findUniqueById(id);
    if (!user) {
      throw new BadRequestException(['User does not exist']);
    }

    return this.usersService.delete(req.user.id);
  }
}
