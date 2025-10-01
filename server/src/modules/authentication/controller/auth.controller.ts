import {
  Controller,
  Post,
  Body,
  UseGuards,
  Request,
  Res,
  Get,
  UnauthorizedException,
  Param,
} from "@nestjs/common";
import { Response as ExpressResponse} from 'express'
import { AuthService } from "../services/auth.service";
import { JwtAuthGuard } from "../../../core/guards/jwt-auth.guard";
import { PermissionsGuard } from "../../../core/guards/permissions.guards";
import { TenantDTO } from "../dto/Tenant.dto";
import { VerifyOtpDTO } from "../dto/verify-otp.dto";
import { ResendOtpDTO } from "../dto/resend-otp.dto";

interface Response extends ExpressResponse {
  cookie(name: string, value: string, options?: any): this;
  clearCookie(name: string, options?: any): this;
}

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("login")
  async login(@Body() loginDto: { userEmail: string; password: string },
  @Res({ passthrough: true }) response: Response) {
    const user = await this.authService.validateUser(
      loginDto.userEmail,
      loginDto.password,
    );

    if (!user) {
      throw new UnauthorizedException("Invalid credentials");
    }
    
    const { access_token, user: userDetails, success, message,menuItem } = await this.authService.login(user);
    
    // Set JWT in HTTP-only cookie
    response.cookie('Authentication', access_token, {
      httpOnly: true,
      secure: true, // Only HTTPS
      sameSite: 'strict', // Prevents CSRF
      maxAge: 24 * 60 * 60 * 1000 // 24 hours
    });
    const nextStep = "SHOW_DASHBOARD";
    
    // Return user details (but not the token)
    return { success,message,authState:{user: userDetails,menuItem,nextStep }};
  }

  @Post("register")
  async register(@Body() registerDto: TenantDTO) {
    return this.authService.register(registerDto);
  }

  @Get("profile")
  @UseGuards(JwtAuthGuard)
  getProfile(@Request() req) {
    return req.user;
  }

  @Get("admin-data")
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  getAdminData() {
    return { message: "This is protected admin data" };
  }

  @Post('logout')
  logout(@Res({ passthrough: true }) response: Response) {
    response.clearCookie('Authentication');
    return { sucess: true,message: 'Logged out successfully',nextStep:"LOGIN" };
  }

  @Post('verify-otp')
  @UseGuards(PermissionsGuard)
  async verifyOtp(@Body() verifyDto: VerifyOtpDTO)
  {
    const tenant = await this.authService.otpVerify(
      verifyDto.tenantId,
      verifyDto.phoneOtp,
    );

    return tenant;
  }

  @Post('resend-otp')
  async resendOtp(@Body() verifyDto:ResendOtpDTO)
  {
    const tenant = await this.authService.resendOTP(
      verifyDto.tenantId,
      verifyDto.resendFor,
    );

    return tenant;
  }

  @Post('forgot-password')
  @UseGuards(PermissionsGuard)
  async forgotPassword(@Body("userEmail") userEmail:string)
  {
    const response = this.authService.forgotPassword(userEmail)
    return response;
  }

  @Post('reset-password/:userId')
  async resetPassword(
    @Param('userId') userId: string,
    @Body('password') password: string,
  ) {
    const response = await this.authService.resetPassword(userId, password);
    return response;
  }
}
