import { IsEnum, IsString } from 'class-validator';
import { Category } from '../enums/category.enum';
import { Priority } from '../enums/priority.enum';

export class CreateTicketDto {
  @IsString()
  customerName: string;

  @IsEnum(Priority)
  priority: Priority;

  @IsEnum(Category)
  category: Category;

  @IsString()
  description: string;
}