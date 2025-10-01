/* eslint-disable @typescript-eslint/no-unused-vars */
import { BaseDAOInterface } from "./base-dao-interface";
import { CheckReferentialIntegrity } from "../decorators/referential-integrity-decorator";
import { ForbiddenException, Inject, Injectable } from "@nestjs/common";
import { Model, ClientSession, FilterQuery } from "mongoose";
import { TransactionContext } from "../database/transaction-context";
import {
  BaseModel,
  SharedBaseModel,
  SystemBaseModel,
  TenantBaseModel,
} from "../model/base-model";
import { QueryOptions } from "../database/query-options.interface";
import { TenantContext } from "../contexts/tenant.context";
import { UserContext } from "../contexts/user.context";
import { BaseDTO } from "../dto/base-dto";
import { plainToInstance, instanceToPlain } from 'class-transformer';
import { ClassConstructor } from 'class-transformer/types/interfaces';

@Injectable()
export abstract class BaseDAO<TModel extends BaseModel, TDTO extends BaseDTO>
  implements BaseDAOInterface<TModel, TDTO>
{
  constructor(protected readonly model: Model<TModel>,
    private readonly dtoClass: ClassConstructor<TDTO>
  ) {
    this.validateModelDtoCompatibility();
  }

  private validateModelDtoCompatibility(): void {
    const dtoInstance = new this.dtoClass();
    const dtoProperties = Object.getOwnPropertyNames(dtoInstance)
      .filter(prop => prop !== 'constructor' && typeof dtoInstance[prop] !== 'function');
    
    const modelPrototype = this.model.prototype;
    const modelSchema = this.model.schema;
    const modelPaths = Object.keys(modelSchema.paths)
      .filter(path => !path.startsWith('_'));
    
    // Check if any DTO properties are missing from model schema
    const missingProps = dtoProperties
      .filter(prop => !modelPaths.includes(prop) && prop !== 'id');
    
    if (missingProps.length > 0) {
      console.warn(`WARNING: DTO ${this.dtoClass.name} has properties not in model: ${missingProps.join(', ')}`);
    }
  }

  public getSession(): ClientSession | undefined {
    return TransactionContext.getInstance().getSession();
  }

  protected getTenantId(): string | undefined {
    try {
      return TenantContext.getInstance().getTenantId();
    } catch (error) {
      // Allow operations without tenant ID in specific cases
      return error;
    }
  }
  // Check if current user is super admin
  protected isProductAdmin(): boolean {
    try {
      return UserContext.getInstance().isProductAdmin();
    } catch (error) {
      return false;
    }
  }

  protected getCurrentUserId(): string {
    try {
      return UserContext.getInstance().getUserId() || "system";
    } catch (error) {
      console.log(error);
      return "system";
    }
  }

  // Entity type detection - determine by instance checking
  protected abstract isTenantEntity(): boolean;

  protected abstract isSharedEntity(): boolean;

  protected abstract isSystemEntity(): boolean;

  protected applyTenantFilter(filter: any = {}): FilterQuery<TModel> {
    // Apply appropriate filter based on entity type
    if (this.isSystemEntity()) {
      return this.applySystemEntityFilter(filter);
    } else if (this.isSharedEntity()) {
      return this.applySharedEntityFilter(filter);
    } else {
      return this.applyTenantEntityFilter(filter);
    }
  }

  protected applyTenantEntityFilter(query: any = {}): FilterQuery<TModel> {
    const tenantId = this.getTenantId();
    const isProductAdmin = this.isProductAdmin();
    // Super admins can access all tenants if they explicitly set a tenantId in query
    if (isProductAdmin && query.tenantId) {
      return query;
    }
    // Super admins can access all tenants if they pass a special flag
    if (isProductAdmin && query._bypassTenantFilter === true) {
      // Remove the special flag before sending to MongoDB
      const { _bypassTenantFilter, ...cleanQuery } = query;
      return cleanQuery;
    }
    // Otherwise enforce tenant isolation
    if (tenantId) {
      return { ...query, tenantId };
    }
    return query;
  }

  private applySharedEntityFilter(filter: any): FilterQuery<TModel> {
    // No tenant filtering for shared entities
    return filter;
  }

  private applySystemEntityFilter(filter: any): FilterQuery<TModel> {
    // Check super admin access for system entities
    if (!this.isProductAdmin()) {
      throw new ForbiddenException(
        "Only super admins can access system-level entities"
      );
    }

    return filter;
  }

  protected modelToDTO(model: TModel | null): TDTO | null{
    if (!model) return null;
    
    // Convert model to plain object (handling Mongoose document)
    const plainObject = model.toObject ? model.toObject() : instanceToPlain(model);
    
    // Ensure _id is mapped to id
    if (plainObject._id) {
      plainObject.id = plainObject._id.toString();
    }
    
    // Convert to DTO instance
    return plainToInstance(this.dtoClass, plainObject)
  }
  protected modelToDTOArray(models: TModel[]): TDTO[]{
    return models.map(model => this.modelToDTO(model)!);
  }
  protected dtoToModel(dto: Partial<TDTO>): Partial<TModel>{
    // Create plain object from DTO
    const plainObject = instanceToPlain(dto);
    
    // Handle id to _id conversion
    if (plainObject.id && !plainObject._id) {
      plainObject._id = plainObject.id;
      delete plainObject.id;
    }
    
    return plainObject as Partial<TModel>;
  }

  @CheckReferentialIntegrity("create")
  async create(data: Partial<TDTO>): Promise<TDTO> {
    // Check access based on entity type
    if (this.isSharedEntity() && !this.isProductAdmin()) {
      throw new ForbiddenException(
        "Product Admin access required to create shared entities"
      );
    }

    if (this.isSystemEntity() && !this.isProductAdmin()) {
      throw new ForbiddenException(
        "Product admin access required to create system entities"
      );
    }

    // Convert DTO to model data
    const modelData = this.dtoToModel(data);

    // Set up tenant ID for tenant entities
    let documentData: any = {
      ...modelData,
      createdBy: this.getCurrentUserId(),
    };

    // Add tenant ID for tenant entities
    if (this.isTenantEntity()) {
      const tenantId = this.getTenantId();
      const isSuperAdmin = this.isProductAdmin();

      // Check for tenant mismatch - unless super admin
      if (
        !isSuperAdmin &&
        (modelData as any).tenantId &&
        tenantId &&
        (modelData as any).tenantId !== tenantId
      ) {
        throw new ForbiddenException(
          "Tenant mismatch: Cannot create records for other tenants"
        );
      }

      // Set tenant ID based on context or super admin override
      if (isSuperAdmin && (modelData as any).tenantId) {
        documentData.tenantId = (modelData as any).tenantId;
      } else if (tenantId) {
        documentData.tenantId = tenantId;
      } else {
        throw new ForbiddenException(
          "Tenant ID is required for tenant-specific entities"
        );
      }
    }

    // Create document
    const createdDocument = new this.model(documentData);
    const session = this.getSession();
    const savedModel = await createdDocument.save({ session });

    // Map back to DTO
    return this.modelToDTO(savedModel)!;
  }

  @CheckReferentialIntegrity("update")
  async update(id: string, data: Partial<TDTO>): Promise<TDTO | null> {
    // Check access based on entity type
    if (this.isSharedEntity() && !this.isProductAdmin()) {
      throw new ForbiddenException(
        "Product Admin access required to update shared entities"
      );
    }

    if (this.isSystemEntity() && !this.isProductAdmin()) {
      throw new ForbiddenException(
        "Product admin access required to update system entities"
      );
    }

    // Convert DTO to model data
    const modelData = this.dtoToModel(data);

    // Extract protected fields
    const updateData: any = {};

    // Copy all properties except protected ones
    Object.keys(modelData).forEach((key) => {
      if (!["tenantId", "__v", "createdBy", "_id", "id"].includes(key)) {
        updateData[key] = (modelData as any)[key];
      }
    });

    // Apply tenant filtering based on entity type
    const query: any = { _id: id };

    if (this.isTenantEntity()) {
      // Apply tenant filter for tenant entities
      Object.assign(query, this.applyTenantFilter({}));
    } else if (this.isSystemEntity()) {
      // Just check super admin access - already done above
    } else {
    }

    // Find the document
    const document = await this.model.findOne(query).exec();
    if (!document) {
      throw new Error("Document not found or you do not have access to it");
    }

    // Set audit fields
    updateData.updatedBy = this.getCurrentUserId();
    updateData.updateDtTime = new Date();

    // Handle tenant updates for super admins on tenant entities
    if (
      this.isTenantEntity() &&
      this.isProductAdmin() &&
      (modelData as any).tenantId
    ) {
      updateData.tenantId = (modelData as any).tenantId;
    }

    // Optimistic concurrency control
    const currentVersion = document.__v || 0;
    query.__v = currentVersion;
    const incomingVersion = (modelData.__v as number | undefined) || 0;

    if (incomingVersion && currentVersion !== incomingVersion) {
      throw new Error(
        "Stale write detected. Document has been updated by another process."
      );
    }

    const session = this.getSession();
    const updatedModel = await this.model
      .findOneAndUpdate(
        query,
        {
          ...updateData,
          $inc: { __v: 1 },
        },
        { new: true, session }
      )
      .exec();

    // Map back to DTO
    return this.modelToDTO(updatedModel);
  }

  /** 
   TODO - This method needs REVIEW. This has multiple problems like -
     1. Referential integrity checks are missing.
     2. Optimal concurrency is not handled.
     3. THIS METHOD SHOULD ONLY BE USED IN RARE SCENARIOS WITH PROPER REVIEW 
  */
  /**
   * Updates multiple documents that match the filter
   * @param filter Query filter to select documents
   * @param updateData Data to update in the documents
   * @param options Additional query options
   * @returns Number of documents modified
   */
  async updateMany(
    filter: any = {},
    updateData: Partial<TDTO>,
    options?: QueryOptions
  ): Promise<number> {
    // Check access based on entity type
    if (
      this.isSharedEntity() &&
      !UserContext.getInstance().hasPermission("admin:access")
    ) {
      throw new ForbiddenException(
        "Admin access required to update shared entities"
      );
    }

    if (this.isSystemEntity() && !this.isProductAdmin()) {
      throw new ForbiddenException(
        "Super admin access required to update system entities"
      );
    }

    // Convert DTO to model data
    const modelData = this.dtoToModel(updateData);

    // Extract protected fields
    const safeUpdateData: any = {};

    // Copy all properties except protected ones
    Object.keys(modelData).forEach((key) => {
      if (
        !["tenantId", "__v", "createdBy", "_id", "id", "createDtTime"].includes(
          key
        )
      ) {
        safeUpdateData[key] = (modelData as any)[key];
      }
    });

    // Apply tenant filtering based on entity type
    let finalFilter = {};

    if (this.isTenantEntity()) {
      // Apply tenant filter for tenant entities
      finalFilter = this.applyTenantFilter(filter);
    } else if (this.isSystemEntity()) {
      // Just check super admin access - already done above
      finalFilter = filter;
    } else {
      finalFilter = filter;
    }

    // Add audit fields
    safeUpdateData.updatedBy = this.getCurrentUserId();
    safeUpdateData.updateDtTime = new Date();

    // Handle tenant updates for super admins on tenant entities
    if (
      this.isTenantEntity() &&
      this.isProductAdmin() &&
      (modelData as any).tenantId
    ) {
      safeUpdateData.tenantId = (modelData as any).tenantId;
    }

    // Execute update with session if available
    const session = this.getSession();
    const result = await this.model
      .updateMany(finalFilter, { $set: safeUpdateData }, { session })
      .exec();

    return result.modifiedCount;
  }

  @CheckReferentialIntegrity("delete")
  async delete(id: string): Promise<boolean> {
    // Apply tenant filter to query
    if (this.isSharedEntity() && !this.isProductAdmin()) {
      throw new ForbiddenException(
        "Product Admin access required to Delete shared entities"
      );
    }

    if (this.isSystemEntity() && !this.isProductAdmin()) {
      throw new ForbiddenException(
        "Product admin access required to delete system entities"
      );
    }

    // Apply tenant filtering based on entity type
    const query: any = { _id: id };

    if (this.isTenantEntity()) {
      // Apply tenant filter for tenant entities
      Object.assign(query, this.applyTenantFilter({}));
    }

    const document = await this.model.findOne(query).exec();
    if (!document) {
      throw new Error("Document not found or belongs to another tenant");
    }

    // Get session from transaction context if available
    const session = this.getSession();

    const result = await this.model.deleteOne(query, { session });

    // Return true if something was deleted, false otherwise
    return result.deletedCount > 0;
  }

  async findById(id: string, options?: QueryOptions): Promise<TDTO | null> {
    // Apply tenant filtering based on entity type
    const query: any = { _id: id };

    if (this.isTenantEntity()) {
      // Apply tenant filter for tenant entities
      Object.assign(query, this.applyTenantFilter({}));
    } else if (this.isSystemEntity() && !this.isProductAdmin()) {
      // Check access for system entities
      throw new ForbiddenException(
        "Super admin access required to read system entities"
      );
    }

    // Execute query with options
    const queryObj = this.model.findOne(query);
    this.applyQueryOptions(queryObj, options);

    const model = await queryObj.exec();
    return this.modelToDTO(model);
  }

  async findOne(
    filter: any = {},
    options?: QueryOptions
  ): Promise<TDTO | null> {
    // Apply tenant filtering based on entity type
    let finalFilter: any = {};

    if (this.isTenantEntity()) {
      // Apply tenant filter for tenant entities
      finalFilter = this.applyTenantFilter(filter);
    } else if (this.isSystemEntity() && !this.isProductAdmin()) {
      // Check access for system entities
      throw new ForbiddenException(
        "Super admin access required to read system entities"
      );
    } else {
      finalFilter = filter;
    }

    // Execute query with options
    const query = this.model.findOne(finalFilter);
    this.applyQueryOptions(query, options);

    const model = await query.exec();
    return this.modelToDTO(model);
  }

  async findAll(options?: QueryOptions): Promise<TDTO[]> {
    // Apply tenant filtering based on entity type
    let finalFilter = {};

    if (this.isTenantEntity()) {
      // Apply tenant filter for tenant entities
      finalFilter = this.applyTenantFilter({});
    } else if (this.isSystemEntity() && !this.isProductAdmin()) {
      // Check access for system entities
      throw new ForbiddenException(
        "Super admin access required to read system entities"
      );
    }

    // Create query with filter
    const query = this.model.find(finalFilter);

    // Apply query options
    this.applyQueryOptions(query, options);

    // Execute query
    const models = await query.exec();
    return this.modelToDTOArray(models);
  }

  async find(filter: any = {}, options?: QueryOptions): Promise<TDTO[]> {
    // Apply tenant filtering based on entity type
    let finalFilter: any = {};

    if (this.isTenantEntity()) {
      // Check for explicit tenant override attempts
      const tenantId = this.getTenantId();
      const isSuperAdmin = this.isProductAdmin();

      if (
        !isSuperAdmin &&
        filter.tenantId &&
        tenantId &&
        filter.tenantId !== tenantId
      ) {
        throw new ForbiddenException(
          "Tenant mismatch: Cannot query other tenants"
        );
      }

      // Apply tenant filter
      finalFilter = this.applyTenantFilter(filter);
    } else if (this.isSystemEntity() && !this.isProductAdmin()) {
      // Check access for system entities
      throw new ForbiddenException(
        "Super admin access required to read system entities"
      );
    } else {
      finalFilter = filter;
    }

    // Execute query with options
    const query = this.model.find(finalFilter);
    this.applyQueryOptions(query, options);

    const models = await query.exec();
    return this.modelToDTOArray(models);
  }

  async count(filter: any = {}): Promise<number> {
    // Apply tenant filtering based on entity type
    let finalFilter: any = {};

    if (this.isTenantEntity()) {
      // Apply tenant filter for tenant entities
      finalFilter = this.applyTenantFilter(filter);
    } else if (this.isSystemEntity() && !this.isProductAdmin()) {
      // Check access for system entities
      throw new ForbiddenException(
        "Super admin access required to access system entities"
      );
    } else {
      finalFilter = filter;
    }

    // Execute query
    const session = this.getSession();
    return this.model.countDocuments(finalFilter).session(session).exec();
  }

  async exists(filter: any): Promise<boolean> {
    // Apply tenant filtering based on entity type
    let finalFilter: any = {};

    if (this.isTenantEntity()) {
      // Apply tenant filter for tenant entities
      finalFilter = this.applyTenantFilter(filter);
    } else if (this.isSystemEntity() && !this.isProductAdmin()) {
      // Check access for system entities
      throw new ForbiddenException(
        "Super admin access required to access system entities"
      );
    } else {
      finalFilter = filter;
    }

    // Execute exists query with session
    const session = this.getSession();
    const result = await this.model.exists(finalFilter).session(session);

    return result !== null;
  }

  async aggregate(pipeline: any[], options?: QueryOptions): Promise<any[]> {
    // Handle tenant filtering based on entity type
    if (this.isTenantEntity()) {
      const tenantId = this.getTenantId();
      const isProductAdmin = this.isProductAdmin();

      // Apply tenant filtering for non-super admins
      if (tenantId && !isProductAdmin) {
        // Check for explicit tenant stage already in pipeline
        const hasTenantMatch = pipeline.some(
          (stage) => stage.$match && stage.$match.tenantId !== undefined
        );

        // Add tenant filter as first stage if not already present
        if (!hasTenantMatch) {
          pipeline.unshift({ $match: { tenantId } });
        }
      }

      // For super admins with _bypassTenantFilter flag, no modifications needed
      const bypassFilter = pipeline.some(
        (stage) => stage.$match && stage.$match._bypassTenantFilter === true
      );

      if (bypassFilter && isProductAdmin) {
        // Remove the bypass flag from the pipeline
        pipeline = pipeline.map((stage) => {
          if (stage.$match && stage.$match._bypassTenantFilter) {
            const { _bypassTenantFilter, ...cleanMatch } = stage.$match;
            return { $match: cleanMatch };
          }
          return stage;
        });
      }
    } else if (this.isSystemEntity() && !this.isProductAdmin()) {
      // Check access for system entities
      throw new ForbiddenException(
        "Super admin access required to access system entities"
      );
    }

    // Create aggregation
    const aggregation = this.model.aggregate(pipeline);

    // Apply read preference if specified
    if (options?.readPreference) {
      aggregation.read(options.readPreference);
    }

    // Apply session if available from transaction context
    const session = this.getSession();
    if (session) {
      aggregation.session(session);
    }

    // Execute aggregation
    return aggregation.exec();
  }

  // Helper method to apply query options - now with read preference
  protected applyQueryOptions(query: any, options?: QueryOptions): void {
    if (!options) return;

    // Apply read preference for eventual consistency
    if (options.readPreference) {
      query.read(options.readPreference);
    }

    // Apply population
    if (options.populate) {
      query.populate(options.populate);
    }

    // Apply sorting
    if (options.sort) {
      query.sort(options.sort);
    }

    // Apply pagination
    if (options.skip !== undefined) {
      query.skip(options.skip);
    }

    if (options.limit !== undefined) {
      query.limit(options.limit);
    }

    // Apply field selection
    if (options.select) {
      query.select(options.select);
    }

    // Apply lean option
    if (options.lean) {
      query.lean(options.lean);
    }

    // Always apply session from transaction context if available
    const session = this.getSession();
    if (session) {
      query.session(session);
    }
  }

  // Special methods for auth flows and system initialization
  async findOneWithoutTenantFilter(
    filter: any,
    options?: QueryOptions
  ): Promise<TDTO | null> {
    const query = this.model.findOne(filter);
    this.applyQueryOptions(query, options);

    const model = await query.exec();
    return this.modelToDTO(model);
  }

  async createWithoutTenantFilter(data: Partial<TDTO>): Promise<TDTO> {
    // Convert DTO to model data
    const modelData = this.dtoToModel(data);

    // Add createdBy field
    const documentData = {
      ...modelData,
      createdBy: this.getCurrentUserId() || "system-init",
    };

    // Create document without tenant checks
    const createdDocument = new this.model(documentData);
    const session = this.getSession();
    const savedModel = await createdDocument.save({ session });

    // Map back to DTO
    return this.modelToDTO(savedModel)!;
  }
}
