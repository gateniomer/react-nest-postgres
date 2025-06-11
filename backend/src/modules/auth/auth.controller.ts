import { Controller, Post, Body, UseGuards, Get, Request, Res } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

    @Post('login')
    async login(@Body() loginDto: LoginDto, @Res() res) {
    const result = await this.authService.login(loginDto.username, loginDto.password);
    
    if (result) {
        res.cookie('auth-token', result.access_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 3600000, // 1 hour
        });
        
        return res.json({ success: true });
    }
    
    return res.status(401).json({ message: 'Invalid credentials' });
    }

    @Post('logout')
    logout(@Res() res) {
    res.clearCookie('auth-token');
    return res.json({ success: true });
    }

    @UseGuards(AuthGuard('jwt'))
    @Get('profile')
    getProfile(@Request() req) {
        return req.user;
    }
}