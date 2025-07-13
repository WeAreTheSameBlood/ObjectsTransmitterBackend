import { Controller, Get, HttpStatus, HttpCode } from '@nestjs/common';
import { ApiOperation, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { ItemCategory } from '../entities/domain/item-categories';

@ApiTags('')
@Controller({ path: '', version: '1' })
export class GeneralController {
  // MARK: - GET - All Categories
  @Get('categories')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Retrieve all possible item categories' })
  @ApiOkResponse({
    description: 'List of available categories',
    schema: {
      type: 'object',
      properties: {
        categories: {
          type: 'array',
          items: { type: 'string', enum: Object.values(ItemCategory) },
        },
      },
    },
  })
  async allCategories(): Promise<{ categories: string[] }> {
    return { categories: Object.values(ItemCategory) };
  }
}
