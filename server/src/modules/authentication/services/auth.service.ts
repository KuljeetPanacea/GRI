import { Injectable, Inject, NotFoundException, ForbiddenException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { DATABASE_CONSTANTS } from "../../../core/database/constant";
import { BaseService } from "../../../core/service/base.service";
import { Connection } from "mongoose";
import { InjectConnection } from "@nestjs/mongoose";
import { Transactional } from "../../../core/decorators/transaction-decorator";
import { UserDTO } from "src/modules/user/dtos/User.dto";
import { UserService } from "src/modules/user/services/user.service";
import { PasswordHashingService } from "./password-hasing.service";
import { RoleService } from "src/core/service/role.service";
import { LoginResponseDto } from "../dto/login-response.dto";
import { OtpService } from "src/modules/otp/service/otp.service";
import { ITenantDAO } from "../dao/tenant.dao.interface";
import { UserRole, UserStatus } from "../Constant";
import { TenantDTO } from "../dto/Tenant.dto";
import { RoleDTO } from "src/core/dto/Role.dto";
import { OutboxService } from "src/core/outbox/services/outbox.service";
import { EmailService } from "src/modules/email/mail.service";
import { SystemTemplate } from "src/modules/systemtemplate/systemTemplate.service";
import { TenantContext } from "src/core/contexts/tenant.context";
import { UserContext } from "src/core/contexts/user.context";
import { RegisterTenant } from "src/core/domain-events/registerTenant-events";

@Injectable()
export class AuthService extends BaseService {
  constructor(
    
    @InjectConnection() connection: Connection,
   private readonly userService: UserService,
    @Inject(DATABASE_CONSTANTS.TENANT_DAO)
    private readonly tenantDAO: ITenantDAO,
    private readonly jwtService: JwtService,
    private readonly passwordHashingService: PasswordHashingService,
    private readonly roleService: RoleService,
    private readonly otpService: OtpService,
    private readonly outBoxService: OutboxService,
    private readonly emailService: EmailService,
    private readonly systemTemplate: SystemTemplate
  ) {
    super(connection);
  }

  async validateUser(email: string, password: string): Promise<Omit<UserDTO, "password">> {
    
    const user: UserDTO = await this.userService.validateCredentials(email, password);

    if (!user) {
      throw new NotFoundException('User not found');
    }
    
    if (user.status === UserStatus.InActive) {
      throw new ForbiddenException('User is inactive');
    }
    
    const getRoleName = await this.roleService.findRoleNameById(user.roles);
    user.roles = getRoleName.map((role)=>{return role.name})

    const { password: _, ...result } = user;

    return result;
  }

  async login(user: Omit<UserDTO, "password">) {
    
    const payload = {
      sub: user.id,
      email: user.email,
      roles: user.roles,
      tenantId: user.tenantId,
    };

    const menuItems = await this.roleService.getMenuItemsForRoles(user.roles);
    const uniqueMenuItems = [...new Set(menuItems)];
    const mappedMenuItems= uniqueMenuItems.map((menu, index) => ({
      id: menu.id,
      path: menu.path,
      icon: menu.icon ,
      label: menu.label,
      tooltip: menu.tooltip,
    }));


    return {
      success: true,
      message: "Login successful.",
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        name:user.name,
        email: user.email,
        roles: user.roles,
        tenantId: user.tenantId,
        __v: user.__v
      },
      menuItem: mappedMenuItems
    };
  }

  @Transactional()
  async register(userData: Partial<TenantDTO>): Promise<LoginResponseDto> {
    const existingUser = await this.tenantDAO.findByEmail(userData.tenantEmail);
    if (existingUser) {
      throw new Error("User with this email already exists");
    }

    if (userData.password) {
      userData.password = await this.passwordHashingService.hashPassword(
        userData.password,
      );
    }

    if (!userData.status) {
      userData.status = UserStatus.InActive
    }

    const response: TenantDTO = await this.tenantDAO.create(userData);

    const getRoles: RoleDTO[] = await this.roleService.findRoleByName([UserRole.SuperAdmin])
    const roleIds: string[] = getRoles.map(role => role.id);
    const otpValue = this.otpService.generateOtp(response.id)

    const userCreate: UserDTO = {
      username: response.tenantEmail,
      email: response.tenantEmail,
      password: response.password,
      name: response.tenantName,
      roles: roleIds,
      countryCode: response.tenantPhoneCountryCode,
      mobileNumber: response.tenantPhone,
      tenantId: response.id,
      status: response.status,
      createdBy: "system",
      otp: otpValue
    };

    const SuperAdminData = await this.userService.createSuperAdmin(userCreate);

    const templateData = await this.systemTemplate.getTemplate("OTP Verify");
    if (!templateData) {
      throw new NotFoundException("System template 'OTP Verify' not found");
}

    await this.emailService.sendEmail(response.tenantEmail, templateData.subject, templateData.contentTemplate + otpValue);
   
    const userResponse = {
      "success": true,
      "message": "OTP sent to registered email and phone.",
      "tenantId": response.id.toString(),
      "emailOtpSent": true,
      "phoneOtpSent": true,
      "nextStep": "VERIFY_OTP",
      "__v": response.__v,
    }
    return userResponse;
  }

  async otpVerify(tenantId: string, otp: string )
  {
    const responseOtp = this.otpService.verifyOtp(tenantId, otp);

    const tenant = await this.tenantDAO.findById(tenantId);
    if (!tenant) {
      throw new NotFoundException("Tenant not found");
    }
    const roleID: RoleDTO[] = await this.roleService.findRoleByName([UserRole.SuperAdmin]);
    const roleIds = roleID.map(role => role.id);
    const uniquePermissions: string[] = Array.from(
      new Set(roleID.flatMap(r => r.permissions))
    );
    
  
    const filter = {
      roles: { $in: roleIds },
      tenantId: tenant.id
    };

    const superadminData = await this.userService.getUserWithouthTenant(filter);
    superadminData.status = UserStatus.Active;
    superadminData.roles = [UserRole.SuperAdmin];

    await this.userService.updateUser(superadminData.id,superadminData);

    await UserContext.getInstance().run({
      userId: superadminData.id,
      roles: [UserRole.SuperAdmin],
      permissions: uniquePermissions,
      isProductAdmin: false
    }, async () => {
        await TenantContext.getInstance().run(tenantId, async () => {
          
          const event = new RegisterTenant([superadminData.id]);
          await this.outBoxService.publishDomainEvent(event)
        });
    });
    
    if(responseOtp)
    {
      await this.tenantDAO.update(tenantId,{status: UserStatus.Active})
      
      return {
        "success": true,
        "message": "OTP verified, Check email for Login credentials.",
        "tenantId": tenantId,
        "nextStep": "UPDATE_PASSWORD",
        "__v": tenant.__v
      }
    }
  }

  async resendOTP(tenantId: string, otp: string )
  {
    const tenant = await this.tenantDAO.findById(tenantId);
    if (!tenant) {
      throw new NotFoundException("Tenant not found");
    }
    const responseOtp = await this.otpService.reSendOtp(tenantId, otp);

    if(responseOtp)
    {
      return {
        "success": true,
        "message": "OTP resent succesfully",
        "tenantId": tenant.id,
        "emailOtpSent": true,
        "phoneOtpSent": true,
        "nextStep": "VERIFY_OTP",
        "__v": tenant.__v
      }
    }
  }

  async forgotPassword(email: string )
  {
    const response = await this.userService.findUserByEmail(email);
    if(!response)
    {
      throw new NotFoundException("Email Id not found");
    }
    else {
      return {
        "success": true,
        "message": "Password reset link has been sent to your email.",
        "__v": response.__v,
        "nextStep": "LOGIN"
      }
    }
  }

  async resetPassword(userId: string,password:string )
  {
    const userData = await this.userService.findUserById(userId);
    if(!userData)
    {
      throw new NotFoundException("User not found");
    }
    else {
       await this.userService.updatePassword(userData.id,password);
      return {
        "success": true,
        "message": "Password Updated Succesfully.",
        "__v": userData.__v,
        "nextStep": "LOGIN"
      }
    }
  }
}
