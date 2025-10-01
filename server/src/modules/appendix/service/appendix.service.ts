import {
  Injectable,
  Inject,
  NotFoundException,
  BadRequestException,
} from "@nestjs/common";
import { BaseService } from "src/core/service/base.service";
import { InjectConnection } from "@nestjs/mongoose";
import { Connection } from "mongoose";
import { Transactional } from "src/core/decorators/transaction-decorator";
import { DATABASE_CONSTANTS } from "src/core/database/constant";
import { AppendixDAO } from "../dao/appendix.dao";
import {
  AppendixAControlDto,
  AppendixADTO,
  AppendixAResponseDto,
} from "../dtos/appendix-a.dto";
import { AppendixCDTO, AppendixCResponseDto } from "../dtos/appendix-c.dto";
import { AppendixEDTO, AppendixEResponseDto } from "../dtos/appendix-e.dto";
import { Appendix } from "../model/appendix.model";

@Injectable()
export class AppendixService extends BaseService {
  constructor(
    @InjectConnection() connection: Connection,
    @Inject(DATABASE_CONSTANTS.APPENDIX_DAO)
    private readonly appendixDAO: AppendixDAO
  ) {
    super(connection);
  }

  // CREATE OPERATIONS
  @Transactional()
  async createAppendixA(
    appendixData: AppendixADTO
  ): Promise<{ message: string; appendix: AppendixAResponseDto }> {
    try {
      // Check if appendix already exists for this project
      const existingAppendix = await this.appendixDAO.findByProjectIdAndType(
        appendixData.projectId,
        "appendix-a"
      );

      if (existingAppendix) {
        throw new BadRequestException(
          "Appendix A already exists for this project"
        );
      }

      const response = await this.appendixDAO.create(appendixData);

      return {
        message: "Appendix A created successfully",
        appendix: response as AppendixAResponseDto,
      };
    } catch (error) {
      throw new BadRequestException(
        `Failed to create Appendix A: ${error.message}`
      );
    }
  }

  @Transactional()
  async upsertAppendixC(
    appendixData: AppendixCDTO
  ): Promise<{ message: string; appendix: AppendixCResponseDto }> {
    try {
      const existingAppendix = await this.appendixDAO.findByProjectIdAndType(
        appendixData.projectId,
        "appendix-c"
      );

      if (existingAppendix) {
        // Update if exists
        const updated = await this.appendixDAO.update(
          existingAppendix.id,
          appendixData
        );
        return {
          message: "Appendix C updated successfully",
          appendix: updated as AppendixCResponseDto,
        };
      } else {
        // Create if not exists
        const created = await this.appendixDAO.create(appendixData);
        return {
          message: "Appendix C created successfully",
          appendix: created as AppendixCResponseDto,
        };
      }
    } catch (error) {
      throw new BadRequestException(
        `Failed to upsert Appendix C: ${error.message}`
      );
    }
  }

  @Transactional()
  async upsertAppendixE(
    appendixData: AppendixEDTO
  ): Promise<{ message: string; appendix: AppendixEResponseDto }> {
    try {
      const existingAppendix = await this.appendixDAO.findByProjectIdAndType(
        appendixData.projectId,
        "appendix-e"
      );

      if (existingAppendix) {
        if (existingAppendix.appendixType !== "appendix-e") {
          throw new BadRequestException(
            "Invalid appendix type for update operation"
          );
        }

        const response = await this.appendixDAO.update(
          existingAppendix.id,
          appendixData
        );

        return {
          message: "Appendix E updated successfully",
          appendix: response as AppendixEResponseDto,
        };
      }

      // Create if not exists
      const created = await this.appendixDAO.create(appendixData);

      return {
        message: "Appendix E created successfully",
        appendix: created as AppendixEResponseDto,
      };
    } catch (error) {
      throw new BadRequestException(
        `Failed to upsert Appendix E: ${error.message}`
      );
    }
  }

  // UPDATE OPERATIONS (Full replacement)

  @Transactional()
  async upsertAppendixA(
    appendixData: AppendixADTO
  ): Promise<{ message: string; appendix: AppendixAResponseDto }> {
    try {
      // Check if the appendix already exists
      const existingAppendix = await this.appendixDAO.findByProjectIdAndType(
        appendixData.projectId,
        "appendix-a"
      );

      if (!existingAppendix) {
        // Create new if it doesn't exist
        const response = await this.appendixDAO.create(appendixData);
        return {
          message: "Appendix A created successfully",
          appendix: response as AppendixAResponseDto,
        };
      } else {
        // Update existing if found
        const existingControls =
          (existingAppendix.controls as AppendixAControlDto[]) || [];
        const newControls = appendixData.controls || [];

        // Merge controls (preserve existing, update if matched by title, or add new)
        const mergedControls = existingControls.map((control) => {
          const newControl = newControls.find((c) => c.title === control.title);
          return newControl ? { ...control, ...newControl } : control;
        });

        const updatedControls = [
          ...mergedControls,
          ...newControls.filter(
            (newControl) =>
              !existingControls.find(
                (control) => control.title === newControl.title
              )
          ),
        ];

        const response = await this.appendixDAO.update(existingAppendix.id, {
          ...appendixData,
          controls: updatedControls,
        });

        return {
          message: "Appendix A updated successfully",
          appendix: response as AppendixAResponseDto,
        };
      }
    } catch (error) {
      throw new BadRequestException(
        `Failed to upsert Appendix A: ${error.message}`
      );
    }
  }

  @Transactional()
  async updateAppendixC(
    id: string,
    appendixData: AppendixCDTO
  ): Promise<{ message: string; appendix: AppendixCResponseDto }> {
    try {
      const existingAppendix = await this.appendixDAO.findById(id);

      if (!existingAppendix) {
        throw new NotFoundException("Appendix C not found");
      }

      if (existingAppendix.appendixType !== "appendix-c") {
        throw new BadRequestException(
          "Invalid appendix type for update operation"
        );
      }

      const response = await this.appendixDAO.update(id, appendixData);

      return {
        message: "Appendix C updated successfully",
        appendix: response as AppendixCResponseDto,
      };
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }
      throw new BadRequestException(
        `Failed to update Appendix C: ${error.message}`
      );
    }
  }

  @Transactional()
  async updateAppendixE(
    id: string,
    appendixData: AppendixEDTO
  ): Promise<{ message: string; appendix: AppendixEResponseDto }> {
    try {
      const existingAppendix = await this.appendixDAO.findById(id);

      if (!existingAppendix) {
        throw new NotFoundException("Appendix E not found");
      }

      if (existingAppendix.appendixType !== "appendix-e") {
        throw new BadRequestException(
          "Invalid appendix type for update operation"
        );
      }

      const response = await this.appendixDAO.update(id, appendixData);

      return {
        message: "Appendix E updated successfully",
        appendix: response as AppendixEResponseDto,
      };
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }
      throw new BadRequestException(
        `Failed to update Appendix E: ${error.message}`
      );
    }
  }

  // PUT OPERATIONS (Replace entire resource)
  @Transactional()
  async putAppendixA(
    id: string,
    appendixData: AppendixADTO
  ): Promise<{ message: string; appendix: AppendixAResponseDto }> {
    try {
      const existingAppendix = await this.appendixDAO.findById(id);

      if (!existingAppendix) {
        // PUT can create if not exists
        const response = await this.appendixDAO.create(appendixData);
        return {
          message: "Appendix A created successfully",
          appendix: response as AppendixAResponseDto,
        };
      }

      if (existingAppendix.appendixType !== "appendix-a") {
        throw new BadRequestException(
          "Invalid appendix type for PUT operation"
        );
      }

      const response = await this.appendixDAO.update(id, appendixData);

      return {
        message: "Appendix A replaced successfully",
        appendix: response as AppendixAResponseDto,
      };
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException(
        `Failed to put Appendix A: ${error.message}`
      );
    }
  }

  @Transactional()
  async putAppendixC(
    id: string,
    appendixData: AppendixCDTO
  ): Promise<{ message: string; appendix: AppendixCResponseDto }> {
    try {
      const existingAppendix = await this.appendixDAO.findById(id);

      if (!existingAppendix) {
        // PUT can create if not exists
        const response = await this.appendixDAO.create(appendixData);
        return {
          message: "Appendix C created successfully",
          appendix: response as AppendixCResponseDto,
        };
      }

      if (existingAppendix.appendixType !== "appendix-c") {
        throw new BadRequestException(
          "Invalid appendix type for PUT operation"
        );
      }

      const response = await this.appendixDAO.update(id, appendixData);

      return {
        message: "Appendix C replaced successfully",
        appendix: response as AppendixCResponseDto,
      };
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException(
        `Failed to put Appendix C: ${error.message}`
      );
    }
  }

  @Transactional()
  async putAppendixE(
    id: string,
    appendixData: AppendixEDTO
  ): Promise<{ message: string; appendix: AppendixEResponseDto }> {
    try {
      const existingAppendix = await this.appendixDAO.findById(id);

      if (!existingAppendix) {
        // PUT can create if not exists
        const response = await this.appendixDAO.create(appendixData);
        return {
          message: "Appendix E created successfully",
          appendix: response as AppendixEResponseDto,
        };
      }

      if (existingAppendix.appendixType !== "appendix-e") {
        throw new BadRequestException(
          "Invalid appendix type for PUT operation"
        );
      }

      const response = await this.appendixDAO.update(id, appendixData);

      return {
        message: "Appendix E replaced successfully",
        appendix: response as AppendixEResponseDto,
      };
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException(
        `Failed to put Appendix E: ${error.message}`
      );
    }
  }

  // PATCH OPERATIONS (Partial updates)
  @Transactional()
  async patchAppendixA(
    id: string,
    partialData: Partial<AppendixADTO>
  ): Promise<{ message: string; appendix: AppendixAResponseDto }> {
    try {
      const existingAppendix = await this.appendixDAO.findById(id);

      if (!existingAppendix) {
        throw new NotFoundException("Appendix A not found");
      }

      if (existingAppendix.appendixType !== "appendix-a") {
        throw new BadRequestException(
          "Invalid appendix type for patch operation"
        );
      }

      const response = await this.appendixDAO.update(id, partialData);

      return {
        message: "Appendix A patched successfully",
        appendix: response as AppendixAResponseDto,
      };
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }
      throw new BadRequestException(
        `Failed to patch Appendix A: ${error.message}`
      );
    }
  }

  @Transactional()
  async patchAppendixC(
    id: string,
    partialData: Partial<AppendixCDTO>
  ): Promise<{ message: string; appendix: AppendixCResponseDto }> {
    try {
      const existingAppendix = await this.appendixDAO.findById(id);

      if (!existingAppendix) {
        throw new NotFoundException("Appendix C not found");
      }

      if (existingAppendix.appendixType !== "appendix-c") {
        throw new BadRequestException(
          "Invalid appendix type for patch operation"
        );
      }

      const response = await this.appendixDAO.update(id, partialData);

      return {
        message: "Appendix C patched successfully",
        appendix: response as AppendixCResponseDto,
      };
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }
      throw new BadRequestException(
        `Failed to patch Appendix C: ${error.message}`
      );
    }
  }

  @Transactional()
  async patchAppendixE(
    id: string,
    partialData: Partial<AppendixEDTO>
  ): Promise<{ message: string; appendix: AppendixEResponseDto }> {
    try {
      const existingAppendix = await this.appendixDAO.findById(id);

      if (!existingAppendix) {
        throw new NotFoundException("Appendix E not found");
      }

      if (existingAppendix.appendixType !== "appendix-e") {
        throw new BadRequestException(
          "Invalid appendix type for patch operation"
        );
      }

      const response = await this.appendixDAO.update(id, partialData);

      return {
        message: "Appendix E patched successfully",
        appendix: response as AppendixEResponseDto,
      };
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }
      throw new BadRequestException(
        `Failed to patch Appendix E: ${error.message}`
      );
    }
  }

  // READ OPERATIONS
  async getAppendixById(
    id: string
  ): Promise<
    AppendixAResponseDto | AppendixCResponseDto | AppendixEResponseDto
  > {
    try {
      const appendix = await this.appendixDAO.findById(id);
      if (!appendix) {
        throw new NotFoundException("Appendix not found");
      }
      return appendix as
        | AppendixAResponseDto
        | AppendixCResponseDto
        | AppendixEResponseDto;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException(`Failed to get appendix: ${error.message}`);
    }
  }

  async getAppendixByProjectId(
    projectId: string
  ): Promise<
    (AppendixAResponseDto | AppendixCResponseDto | AppendixEResponseDto)[]
  > {
    try {
      const appendices = await this.appendixDAO.findAllByProjectId(projectId);
      return appendices.map((a) => this.appendixDAO["modelToDTO"](a)) as (
        | AppendixAResponseDto
        | AppendixCResponseDto
        | AppendixEResponseDto
      )[];
    } catch (error) {
      throw new BadRequestException(
        `Failed to get appendices for project: ${error.message}`
      );
    }
  }

  async getAppendixByProjectIdAndType(
    projectId: string,
    appendixType: string
  ): Promise<
    AppendixAResponseDto | AppendixCResponseDto | AppendixEResponseDto | null
  > {
    try {
      const appendix = await this.appendixDAO.findByProjectIdAndType(
        projectId,
        appendixType
      );
      if (!appendix) {
      return null;
    }

    // Convert to DTO first
    const appendixDTO = this.appendixDAO["modelToDTO"](appendix) as
      | AppendixAResponseDto
      | AppendixCResponseDto
      | AppendixEResponseDto;

    // Then destructure to remove appendixType
    const { appendixType: _, ...dataWithoutType } = appendixDTO;
    return dataWithoutType;

    } catch (error) {
      throw new BadRequestException(
        `Failed to get appendix by type: ${error.message}`
      );
    }
  }

  async getControlByTitle(
    projectId: string,
    appendixType: string,
    controlTitle: string
  ): Promise<AppendixAControlDto | null> {
    try {
      const appendix = await this.appendixDAO.findByProjectIdAndType(
        projectId,
        appendixType
      );

      if (!appendix) {
        throw new NotFoundException(
          "Appendix not found for the given project and type."
        );
      }

      const control = appendix.controls.find(
        (ctrl) => ctrl.title === controlTitle
      );

      if (!control) {
        throw new NotFoundException(
          "Control with the specified title not found."
        );
      }

      return control as AppendixAControlDto;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException(
        `Failed to fetch control: ${error.message}`
      );
    }
  }

  async getAppendicesByType(
    appendixType: string
  ): Promise<
    (AppendixAResponseDto | AppendixCResponseDto | AppendixEResponseDto)[]
  > {
    try {
      const appendices =
        await this.appendixDAO.findByAppendixType(appendixType);
      return appendices.map((a) => this.appendixDAO["modelToDTO"](a)) as (
        | AppendixAResponseDto
        | AppendixCResponseDto
        | AppendixEResponseDto
      )[];
    } catch (error) {
      throw new BadRequestException(
        `Failed to get appendices by type: ${error.message}`
      );
    }
  }

  // DELETE OPERATION
  @Transactional()
  async deleteAppendix(id: string): Promise<{ message: string }> {
    try {
      const existingAppendix = await this.appendixDAO.findById(id);

      if (!existingAppendix) {
        throw new NotFoundException("Appendix not found");
      }

      await this.appendixDAO.delete(id);

      return {
        message: "Appendix deleted successfully",
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException(
        `Failed to delete appendix: ${error.message}`
      );
    }
  }

  // UTILITY METHODS
  async getAllAppendices(): Promise<
    (AppendixAResponseDto | AppendixCResponseDto | AppendixEResponseDto)[]
  > {
    try {
      const appendices = await this.appendixDAO.findAll();
      return appendices as (
        | AppendixAResponseDto
        | AppendixCResponseDto
        | AppendixEResponseDto
      )[];
    } catch (error) {
      throw new BadRequestException(
        `Failed to get all appendices: ${error.message}`
      );
    }
  }

  async getAppendicesWithPagination(
    page: number = 1,
    limit: number = 10,
    filter: any = {}
  ): Promise<{
    data: (
      | AppendixAResponseDto
      | AppendixCResponseDto
      | AppendixEResponseDto
    )[];
    total: number;
    page: number;
    limit: number;
  }> {
    try {
      const skip = (page - 1) * limit;
      const data = await this.appendixDAO.find(filter, { skip, limit });
      const total = await this.appendixDAO.count(filter);
      return {
        data: data as (
          | AppendixAResponseDto
          | AppendixCResponseDto
          | AppendixEResponseDto
        )[],
        total,
        page,
        limit,
      };
    } catch (error) {
      throw new BadRequestException(
        `Failed to get appendices with pagination: ${error.message}`
      );
    }
  }

  // BULK OPERATIONS
  @Transactional()
  async bulkCreateAppendices(
    appendices: (AppendixADTO | AppendixCDTO | AppendixEDTO)[]
  ): Promise<{ message: string; created: number }> {
    try {
      let createdCount = 0;

      for (const appendix of appendices) {
        await this.appendixDAO.create(appendix);
        createdCount++;
      }

      return {
        message: `${createdCount} appendices created successfully`,
        created: createdCount,
      };
    } catch (error) {
      throw new BadRequestException(
        `Failed to bulk create appendices: ${error.message}`
      );
    }
  }

  @Transactional()
  async bulkUpdateAppendices(
    updates: {
      id: string;
      data: Partial<AppendixADTO | AppendixCDTO | AppendixEDTO>;
    }[]
  ): Promise<{ message: string; updated: number }> {
    try {
      let updatedCount = 0;

      for (const update of updates) {
        const existingAppendix = await this.appendixDAO.findById(update.id);
        if (existingAppendix) {
          await this.appendixDAO.update(update.id, update.data);
          updatedCount++;
        }
      }

      return {
        message: `${updatedCount} appendices updated successfully`,
        updated: updatedCount,
      };
    } catch (error) {
      throw new BadRequestException(
        `Failed to bulk update appendices: ${error.message}`
      );
    }
  }
}
