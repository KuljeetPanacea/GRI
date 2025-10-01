import { Injectable, Inject } from "@nestjs/common";
import { IUserDAO } from "../dao/user-dao.interface";
import { DATABASE_CONSTANTS } from "../../../core/database/constant";
import { UserDTO } from "../dtos/User.dto";
import { UserServiceInterface } from "./user.interface";
import { BaseService } from "src/core/service/base.service";
import { InjectConnection } from "@nestjs/mongoose";
import { Connection } from "mongoose";
import { Transactional } from "src/core/decorators/transaction-decorator";
import { PasswordHashingService } from "src/modules/authentication/services/password-hasing.service";
import { UpdateUserDto } from "../dtos/updateUser.dto";
import { RolesEnum } from "../customTypes";
import { RoleService } from "src/core/service/role.service";
import { LookupResponseDto, LookupValueDto } from "../dtos/lookup.dto";
import { UserRole, UserStatus } from "src/modules/authentication/Constant";
import { RoleDTO } from "src/core/dto/Role.dto";
import { AddUserDTO } from "../dtos/addUser.dto";
import { DEFAULT_QUERY_OPTIONS, FilterOptions, QueryOptions } from "src/core/database/query-options.interface";
import { OutboxService } from "src/core/outbox/services/outbox.service";
import { CreateUserEvent } from "src/core/domain-events/createuser-events";
import { ProjectDAO } from "src/modules/project/dao/Project.dao";
import { ResponseUserDTO } from "../dtos/reponseUser.dto";



@Injectable()
export class UserService extends BaseService implements UserServiceInterface {
  constructor(
    @InjectConnection() connection: Connection,
    @Inject(DATABASE_CONSTANTS.USER_DAO) private readonly userDAO: IUserDAO,
    private readonly passwordHashingService: PasswordHashingService,
    private readonly roleService: RoleService,
    private readonly outBoxService: OutboxService,
    @Inject(DATABASE_CONSTANTS.PROJECT_DAO)
    private readonly projectDao: ProjectDAO,
  ) {
    super(connection);
  }

  @Transactional()
  async createUser(userData: UserDTO): Promise<AddUserDTO> {
    userData.password = await this.passwordHashingService.hashPassword(
      userData.password || "Test@1234"
    );
    
    const getRoles: RoleDTO[] = await this.roleService.findRoleByName(userData.roles)
    userData.roles =  getRoles.map(role => role.id);

    const response: UserDTO = await this.userDAO.create(userData);

    const {password, ...result} = response;

     return {
      success: true,
      message: "User created successfully.",
      data: result as UserDTO
      // "createdBy": userData.createdBy
    }    
  }

  async findUserById(id: string): Promise<UserDTO | null> {
    return (this.userDAO.findById(id));
  }

  async findUsernameById(id: string): Promise<String | null> {
    return (await (this.userDAO.findById(id))).name;
  }

  async findUserByEmail(email: string): Promise<UserDTO | null> {
    return this.userDAO.findByEmail(email);
  }

async updateUser(id: string, userData: UpdateUserDto): Promise<{ message: string }> {
    // Fetch existing user
    const existingUser = await this.userDAO.findById(id);
    if (!existingUser) {
        throw new Error('User not found');
    }

    // Merge only provided fields (userData) into existingUser
    const updatedUserData = { ...existingUser, ...userData };

    const response = await this.userDAO.update(id, updatedUserData);

    const getRoles: RoleDTO[] = await this.roleService.findRoleNameById(response.roles);
    response.roles = getRoles.map(role => role.name);

    const { password, ...result } = response;

    return { message: 'User Updated Successfully' };
}



  async createSuperAdmin(userCreate: UserDTO): Promise<UserDTO> {
    return this.userDAO.createWithoutTenantFilter(userCreate);
  }

  async validateCredentials(
    email: string,
    password: string,
  ): Promise<UserDTO | null> {
   
    const user = await this.findUserByEmail(email)
    if (!user) return null;

    const isPasswordValid = await this.passwordHashingService.comparePassword(
      password,
      user.password,
    );
    return isPasswordValid ? user : null;
  }

  @Transactional()
  async deleteUser(id: string): Promise<{ success: boolean; message: string,assignments?: any[]}> {
    // 1. Find projects where user is assigned
    const assignedProjects = await this.projectDao.find({
      "assignedTo.id": id
    });

    if (!assignedProjects || assignedProjects.length === 0) {
      // No assignments, safe to delete
      const deleted: UserDTO = await this.userDAO.update(id, { status: UserStatus.InActive });
      if (deleted) {
        return {
          success: true,
          message: "User deleted successfully.",
        };
      }
    } 
    else {
      // Check project statuses
      const inProgressAssignments = assignedProjects.filter(
        project => project.status !== "completed"
      );

      if (inProgressAssignments.length === 0) {
        // All assignments are completed, safe to delete
        const deleted: UserDTO = await this.userDAO.update(id, { status: UserStatus.InActive });
        if (deleted) {
          return {
            success: true,
            message: "User deleted successfully.",
          };
        }
      } else {
        // User has in-progress assignments
        return {
          success: false,
          message: "First reallocate the assignment then only deletion can be done.",
        };
      }
    }
    
  }
  

private hasRole(user: any, roleName: string): boolean {
  if (!user || !user.roles) return false;
  return user.roles.includes(roleName);
}

async allUser(
  filter: any,
  options: FilterOptions,
  currentUser?: any // Add currentUser parameter
): Promise<{
  users: ResponseUserDTO[];
  currentPage?: number;
  totalPages?: number;
  totalCount?: number;
  roles?: string[],
  status?: string,
  createDtTime?: string,
  name?: string
}> {

//  console.log("filter",filter);
  const isPaginated = options?.limit !== undefined || options?.page !== undefined;
  const limit = options?.limit ?? DEFAULT_QUERY_OPTIONS.limit!;
  const page = options?.page ?? 1;
  const skip = options?.skip ?? ((page - 1) * limit);
  // Convert role names to role IDs
 if (filter.roles) {
  const roleNames = Array.isArray(filter.roles)
    ? filter.roles
    : String(filter.roles).split(',');

  const roleIds = await this.resolveRoleIds(roleNames);

  if (roleIds.length > 0) {
    filter.roles = { $in: roleIds };
  } else {
    return {
      users: [],
      currentPage: 1,
      totalPages: 0,
      totalCount: 0,
    };
  }
}

if (filter.name &&filter.name.trim() !== "") {
  filter.name = { $regex: filter.name.trim(), $options: "i" };
}

  const mergedOptions: QueryOptions = {
    ...DEFAULT_QUERY_OPTIONS,
    ...options,
    skip,
    limit,
    select: [
      "roles",
      "status",
      "name",
      "createDtTime",
      "mobileNumber",
      "email",
      "__v",
    ],
  };
  // console.log("mergedOptions",mergedOptions);
 
  if (currentUser && !this.hasRole(currentUser, UserRole.SuperAdmin)) {
    // Get role IDs for both superadmin and admin roles
    const restrictedRoles = await this.roleService.findRoleByName([
      UserRole.SuperAdmin, 
      UserRole.Admin
    ]);
    
    const restrictedRoleIds = restrictedRoles.map(role => role.id);
    
    // If roles filter already exists, combine it with security restrictions
    if (filter.roles && filter.roles.$in) {
      // Filter out restricted roles from the requested roles
      const allowedRequestedRoles = filter.roles.$in.filter(
        (roleId: string) => !restrictedRoleIds.includes(roleId)
      );
      
      if (allowedRequestedRoles.length === 0) {
        // If no requested roles are allowed, return empty result
        return {
          users: [],
          currentPage: page,
          totalPages: 0,
          totalCount: 0,
        };
      }
      
      filter.roles = { $in: allowedRequestedRoles };
    } else {
      // If no specific roles requested, just exclude restricted roles
      filter.roles = { $nin: restrictedRoleIds };
    }
  }
 
 const users = await this.userDAO.find(filter, mergedOptions)
 console.log("user data include",users);
  const [ totalCount] = await Promise.all([
   
    this.userDAO.count(filter),
  ]);

  for (const user of users) {
    if (user.roles && user.roles.length > 0) {
      const roleNames = await this.roleService.findRoleNameById(user.roles);
      user.roles = roleNames.map((role) => role.name);
    }
  }

  if (users.length > 0) {
    //await this.bgProcess(users[0].id);
  }

  if (!isPaginated) {
    return { users };
  }

  return {
    users,
    currentPage: page,
    totalPages: Math.ceil(totalCount / limit),
    totalCount,
  };
}

  async lookUp(): Promise<LookupResponseDto>
  {
    const responseLookUp = await this.roleService.getAllRoles();

    const formattedValues: LookupValueDto[] = responseLookUp.map(role => ({
      key: role.name,  
      value: RolesEnum[role.name]
    }));
  
    return {
      success: true,
      message: "Lookup values fetched",
      data: {
        category: "roles",
        values: formattedValues
      },
      nextStep: "None"
    };
  }

  async updatePassword(id:string,password: string){
    password = await this.passwordHashingService.hashPassword(password);
    
    const response  = await this.userDAO.update(id,{password:password,defaultPasswordchange:false})
    if(response){
      return {success:true, message:"Passsword Updated Succesfully."}
    }
  }


  async bgProcess(userId: string) {
    const event = new CreateUserEvent([userId]);
    await this.outBoxService.publishDomainEvent(event);
  //   const dummyEmailData = {
  //     to: ["test@example.com", "user@example.com"],
  //     subject: "Welcome to Our Service",
  //     body: "Hello, this is a test email body.",
  //     options: { cc: ["cc@example.com"], bcc: ["bcc@example.com"], attachments: [] },
  //     priority: 1,
  //     correlationId: "12345-abcde",
  //   };
  //   const dataResultOutBox = await this.outBoxService.addEmailMessage(dummyEmailData.to,
  //     dummyEmailData.subject,
  //     dummyEmailData.body,
  //     dummyEmailData.options,
  //     dummyEmailData.priority,
  //     dummyEmailData.correlationId);
  //     console.log("dataResultOutBox",dataResultOutBox)
   }

  async getuserByroleName(roleName: string, status?: 'active' | 'inActive'): Promise<UserDTO[]> {
    const roleID: RoleDTO[] = await this.roleService.findRoleByName([roleName]);
    const roleIds = roleID.map(role => role.id);
  
    const filter = {
      roles: { $in: roleIds },
      status: status ?? 'active'
    };

    const users = await this.userDAO.find(filter);

    for (const user of users) {
      if (user.roles && user.roles.length > 0) {
        const roleNames = await this.roleService.findRoleNameById(user.roles);
        user.roles = roleNames.map((role) => role.name);
      }
    }
  
    return users;
  }

  async resolveRoleIds(roleNames: string | string[]): Promise<string[]> {
  const roleArray = Array.isArray(roleNames) ? roleNames : [roleNames];
  const roles = await this.roleService.findRoleByName(roleArray);
  return roles.map(role => role.id);
}
  async getUserWithouthTenant(filter: any)
  {
    return this.userDAO.findOneWithoutTenantFilter(filter)
  }

  async createProductAdmin(userData: UserDTO): Promise<UserDTO> {
    if (userData.password) {
      userData.password = await this.passwordHashingService.hashPassword(
        userData.password,
      );
    }

    if (!userData.status) {
      userData.status = UserStatus.Active
    }
    userData.tenantId = "system";
    const getRoles: RoleDTO[] = await this.roleService.findRoleByName(userData.roles)
    const roleIds: string[] = getRoles.map(role => role.id);
    userData.roles = roleIds

    return this.userDAO.createWithoutTenantFilter(userData);
  }
}
