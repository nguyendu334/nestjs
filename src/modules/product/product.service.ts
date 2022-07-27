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

  async createProduct(productDto: ProductDto) {
    const product = new Product();
    product.name = productDto.name;
    product.price = productDto.price;
    product.description = productDto.description;
    product.category = productDto.category;
    return this.productRepository.save(product);
  }

  // GET ALL PRODUCTS
  getAllProducts() {
    return this.productRepository.find({});
  }

  // PRODUCT DETAIL
  productDetail(id: string) {
    return this.productRepository.findOneBy({
      _id: new ObjectId(id),
    });
  }

  // EDIT PRODUCT
  async editProduct(id: string, updateProductDto: UpdateProductDto) {
    const product = await this.productDetail(id);
    if (!product)
      throw new HttpException('Product not found', HttpStatus.NOT_FOUND);
    return this.productRepository.update(product, updateProductDto);
  }

  // DELETE PRODUCT
  async deleteProduct(id: string) {
    const product = await this.productDetail(id);
    if (!product)
      throw new HttpException('Product not found', HttpStatus.NOT_FOUND);
    return this.productRepository.delete(product);
  }

  // REVIEW PRODUCT
  async reviewProduct(id: string, review: any) {
    const product = await this.productDetail(id);
    if (!product)
      throw new HttpException('Product not found', HttpStatus.NOT_FOUND);
    review = {
      rating: review.rating,
      comment: review.comment,
      createdAt: moment().format('YYYY-MM-DD HH:mm:ss'),
    };
    product.reviews.push(review);
    product.totalReviews = product.reviews.length;
    product.rating =
      product.reviews.reduce((acc, cur) => cur.rating + acc, 0) /
      product.totalReviews;
    return this.productRepository.save(product);
  }

  // GET ALL REVIEWS
  // async getAllRe(id: string) {
  //   const product = await this.productDetail(id);
  //   if (!product)
  //     throw new HttpException('Product not found', HttpStatus.NOT_FOUND);
  //   return product.reviews;
  // }
}
