import { Product } from './product.entity';
import { ProductService } from './product.service';
import { MockType, repositoryMockFactory } from '../../../test/mocker';
import { Repository } from 'typeorm';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('ProductService', () => {
  let productService: ProductService;
  let repositoryMock: MockType<Repository<Product>>;

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      providers: [
        ProductService,
        {
          provide: getRepositoryToken(Product),
          useFactory: repositoryMockFactory,
        },
      ],
    }).compile();

    productService = moduleRef.get<ProductService>(ProductService);
    repositoryMock = moduleRef.get(getRepositoryToken(Product));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should throw an error if the product does not exist', async () => {
    repositoryMock.findOneBy.mockReturnValue(null);
    expect(() => productService.productDetail('id')).toThrow();
  });

  it('should find a product by id', async () => {
    const product = {
      name: 'test',
      _id: '62e114723f97b1a3c8df5f0c',
      price: 10,
      description: 'test',
    };
    repositoryMock.findOneBy.mockReturnValue(product);
    expect(productService.productDetail(product._id)).toEqual(product);
  });

  it('should get all products', async () => {
    const products = [
      {
        reviews: [
          {
            rating: 9,
            comment: 'test',
            createdAt: '2022-07-27 17:37:47',
          },
        ],
        _id: '62e114723f97b1a3c8df5f0c',
        name: 'test',
        price: 12,
        description: 'test',
        category: 'test',
        rating: 9,
        totalReviews: 1,
        createdAt: '2022-07-27T10:33:22.659Z',
        updatedAt: '2022-07-27T10:37:47.166Z',
      },
      {
        reviews: [
          {
            rating: 7,
            comment: 'test',
            createdAt: '2022-07-27 17:37:47',
          },
        ],
        _id: '62e114723f97b1a3c8df5f0c',
        name: 'test1',
        price: 12,
        description: 'test1',
        category: 'test1',
        rating: 7,
        totalReviews: 1,
        createdAt: '2022-07-27T10:33:22.659Z',
        updatedAt: '2022-07-27T10:37:47.166Z',
      },
    ];
    repositoryMock.find.mockReturnValue(products);
    expect(productService.getAllProducts()).toEqual(products);
  });

  it('should create a product', async () => {
    const prod = new Product();
    const product = {
      ...prod,
      name: 'test1',
      price: 12,
      description: 'test1',
      category: 'test1',
    };
    repositoryMock.save.mockReturnValue(product);
    expect(productService.createProduct(product)).toEqual(product);
  });

  it('should edit a product', async () => {
    const product = {
      reviews: [],
      _id: '62e1f8d77ff080fbe5e3a0bb',
      name: 'test1',
      price: 12,
      description: 'test1',
      category: 'test1',
      createdAt: '2022-07-27T10:33:22.659Z',
      updatedAt: '2022-07-27T10:37:47.166Z',
    };
    repositoryMock.update.mockReturnValue(product);
    expect(await productService.editProduct(product._id, product)).toEqual(
      product,
    );
  });

  it('should delete a product', async () => {
    const product = {
      reviews: [],
      _id: '62e1f8d77ff080fbe5e3a0bb',
      name: 'test1',
      price: 12,
      description: 'test1',
      category: 'test1',
      createdAt: '2022-07-27T10:33:22.659Z',
      updatedAt: '2022-07-27T10:37:47.166Z',
    };
    repositoryMock.delete.mockReturnValue(product);
    expect(await productService.deleteProduct(product._id)).toEqual(product);
  });

  it('should add a review to a product', async () => {
    const review = {
      rating: 5,
      comment: 'test',
      createdAt: new Date(),
    };
    const product = {
      reviews: [],
      _id: '62e1f8d77ff080fbe5e3a0bb',
      name: 'test1',
      price: 12,
      description: 'test1',
      category: 'test1',
      createdAt: '2022-07-27T10:33:22.659Z',
      updatedAt: '2022-07-27T10:37:47.166Z',
    };
    repositoryMock.findOneBy.mockReturnValue(product);
    repositoryMock.save.mockReturnValue(product);
    expect(await productService.reviewProduct(product._id, review)).toEqual(
      product,
    );
  });
});
