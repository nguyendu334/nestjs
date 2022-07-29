import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  HttpStatus,
  HttpCode,
  HttpException,
  UseGuards,
  Put,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductDto } from './dto/product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Validate } from '../../validators/validation';
import { reviewDto } from './dto/review.dto';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { Role } from '../../constants/role.constants';
import { Roles } from '../../decorators/role.decorator';
import { AuthGuard } from '@nestjs/passport';

@ApiTags('product')
@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  // GET ALL PRODUCTS
  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiResponse({ status: 200, description: 'OK', type: ProductDto })
  async getAllProducts() {
    return await this.productService.getAllProducts();
  }

  //CREATE NEW PRODUCT
  @UseGuards(AuthGuard('jwt'))
  @Post('create')
  @HttpCode(HttpStatus.CREATED)
  @ApiResponse({ status: 400, description: 'Missing required fields' })
  @ApiResponse({
    status: 201,
    description: 'Product successfully created',
    type: ProductDto,
  })
  async createProduct(@Body() productDto: ProductDto) {
    return await this.productService.createProduct(productDto);
  }

  // PRODUCT DETAIL
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiResponse({ status: 200, description: 'OK', type: ProductDto })
  @ApiResponse({ status: 400, description: 'Invalid' })
  @ApiResponse({ status: 404, description: 'Product not found' })
  async productDetail(@Param('id', Validate) id: string) {
    const product = await this.productService.productDetail(id);
    if (!product)
      throw new HttpException('Product not found', HttpStatus.NOT_FOUND);
    return product;
  }

  // EDIT PRODUCT
  @UseGuards(AuthGuard('jwt'))
  @Roles(Role.Admin)
  @Put(':id')
  @HttpCode(HttpStatus.ACCEPTED)
  @ApiResponse({ status: 404, description: 'Product not found' })
  @ApiResponse({ status: 400, description: 'Invalid' })
  @ApiResponse({ status: 200, description: 'UPDATED!' })
  async update(
    @Param('id', Validate) id: string,
    @Body() updateProductDto: UpdateProductDto,
  ) {
    return await this.productService.editProduct(id, updateProductDto);
  }

  //DELETE A PRODUCT
  @Roles(Role.Admin)
  @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  @HttpCode(HttpStatus.ACCEPTED)
  @ApiResponse({ status: 404, description: 'Product not found' })
  @ApiResponse({ status: 400, description: 'Invalid' })
  @ApiResponse({ status: 204, description: 'DELETED!' })
  async deleteProduct(@Param('id', Validate) id: string) {
    return await this.productService.deleteProduct(id);
  }

  // REVIEW PRODUCT
  @UseGuards(AuthGuard('jwt'))
  @Post('/:id/review')
  @HttpCode(HttpStatus.ACCEPTED)
  @ApiResponse({ status: 404, description: 'Product not found' })
  @ApiResponse({ status: 400, description: 'Invalid' })
  @ApiResponse({ status: 200, description: 'REVIEW ADDED!' })
  async reviewProduct(
    @Param('id', Validate) id: string,
    @Body() review: reviewDto,
  ) {
    return await this.productService.reviewProduct(id, review);
  }

  // GET ALL REVIEWS
  // @Get(':id/review')
  // @ApiResponse({ status: 400, description: 'Invalid' })
  // @ApiResponse({ status: 200, description: 'OK' })
  // async getAllRe(@Param('id', ValidateMongoId) id: string) {
  //   return this.productService.getAllRe(id);
  // }
}
