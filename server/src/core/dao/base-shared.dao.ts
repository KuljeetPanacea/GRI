import { Injectable } from '@nestjs/common';
import { SharedBaseModel } from '../model/base-model';
import { BaseDAO } from './base-dao';
import { BaseDTO } from '../dto/base-dto';


@Injectable()
export abstract class SharedDAO<TModel extends SharedBaseModel, TDTO extends BaseDTO> extends BaseDAO<TModel, TDTO> {
  // Methods remain the same
}