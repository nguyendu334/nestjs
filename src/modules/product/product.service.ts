import { HttpStatus, Injectable, HttpException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as moment from 'moment';
import { ObjectId } from 'mongodb';
import { MongoRepository } from 'typeorm';
import { ProductDto } from './dto/product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './product.entity';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private productRepository: MongoRepository<Product>,
  ) {}

  createProduct(productDto: ProductDto) {
    const product = new Product();
    product.name = productDto.name;
    product.price = productDto.price;
    product.description = productDto.description;
    product.category = productDto.category;
    // product.userId = createProductDto.userID;
    return this.productRepository.save(product);
  }

  getAllProducts() {
    return this.productRepository.find({});
  }

  productDetail(id: string) {
    return this.productRepository.findOneBy({
      _id: new ObjectId(id),
    });
  }

  async editProduct(id: string, updateProductDto: UpdateProductDto) {
    const product = await this.productDetail(id);
    if (!product)
      throw new HttpException('Product not found', HttpStatus.NOT_FOUND);
    return this.productRepository.update(product, updateProductDto);
  }

  async deleteProduct(id: string) {
    const product = await this.productDetail(id);
    if (!product)
      throw new HttpException('Product not found', HttpStatus.NOT_FOUND);
    return this.productRepository.delete(product);
  }

  async reviewProduct(id: string, review: any) {
    const product = await this.productDetail(id);
    if (!product)
      throw new HttpException('Product not found', HttpStatus.NOT_FOUND);
    review = {
      email: review.email,
      rating: review.rating,
      comment: review.comment,
      userId: review.userId,
      createdAt: moment().format('HH:mm:ss DD-MM-YYYY'),
    };
    product.reviews.push(review);
    product.totalReviews = product.reviews.length;
    product.rating =
      product.reviews.reduce((acc, cur) => cur.rating + acc, 0) /
      product.totalReviews;
    return this.productRepository.save(product);
  }

  // async getAllRe(id: string) {
  //   const product = await this.productDetail(id);
  //   if (!product)
  //     throw new HttpException('Product not found', HttpStatus.NOT_FOUND);
  //   return product.reviews;
  // }
}
