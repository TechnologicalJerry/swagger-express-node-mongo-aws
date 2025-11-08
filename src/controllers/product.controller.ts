import { Request, Response, NextFunction } from 'express';
import { productService } from '../services/product.service';
import { sendSuccess, sendError } from '../utils/response.util';
import { logger } from '../config/logger';

const parsePositiveNumber = (value: unknown, defaultValue: number): number => {
  const parsed = Number(value);
  if (!Number.isFinite(parsed) || parsed < 0) {
    return defaultValue;
  }
  return parsed;
};

const parseNonNegativeInteger = (value: unknown, defaultValue: number): number => {
  const parsed = parsePositiveNumber(value, defaultValue);
  return Math.floor(parsed);
};

export class ProductController {
  async createProduct(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        sendError(res, 'User not authenticated', 401);
        return;
      }

      const { name, description, price, stock, imageUrl } = req.body;

      const product = await productService.createProduct({
        name,
        description,
        price: parsePositiveNumber(price, 0),
        stock: stock !== undefined ? parseNonNegativeInteger(stock, 0) : undefined,
        imageUrl,
        userId: req.user.userId,
      });

      sendSuccess(res, product.toJSON(), 'Product created successfully', 201);
    } catch (error) {
      logger.error('Create product error', error);
      next(error);
    }
  }

  async getProductById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;

      const product = await productService.getProductById(id);
      if (!product) {
        sendError(res, 'Product not found', 404);
        return;
      }

      sendSuccess(res, product.toJSON(), 'Product retrieved successfully');
    } catch (error) {
      logger.error('Get product error', error);
      next(error);
    }
  }

  async getAllProducts(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const limit = Math.max(1, parseNonNegativeInteger(req.query.limit, 10));
      const offset = parseNonNegativeInteger(req.query.offset, 0);

      const result = await productService.getAllProducts(limit, offset);

      sendSuccess(
        res,
        {
          products: result.products.map((product) => product.toJSON()),
          total: result.total,
          limit: result.limit,
          offset: result.offset,
        },
        'Products retrieved successfully'
      );
    } catch (error) {
      logger.error('Get all products error', error);
      next(error);
    }
  }

  async updateProduct(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        sendError(res, 'User not authenticated', 401);
        return;
      }

      const { id } = req.params;
      const { name, description, price, stock, imageUrl } = req.body;

      const product = await productService.updateProduct(
        id,
        {
          name,
          description,
          price: price !== undefined ? parsePositiveNumber(price, 0) : undefined,
          stock: stock !== undefined ? parseNonNegativeInteger(stock, 0) : undefined,
          imageUrl,
        },
        req.user.userId
      );

      sendSuccess(res, product.toJSON(), 'Product updated successfully');
    } catch (error) {
      logger.error('Update product error', error);
      next(error);
    }
  }

  async deleteProduct(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        sendError(res, 'User not authenticated', 401);
        return;
      }

      const { id } = req.params;

      await productService.deleteProduct(id, req.user.userId);
      sendSuccess(res, null, 'Product deleted successfully');
    } catch (error) {
      logger.error('Delete product error', error);
      next(error);
    }
  }

  async getMyProducts(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        sendError(res, 'User not authenticated', 401);
        return;
      }

      const products = await productService.getProductsByUserId(req.user.userId);
      sendSuccess(
        res,
        products.map((product) => product.toJSON()),
        'Products retrieved successfully'
      );
    } catch (error) {
      logger.error('Get my products error', error);
      next(error);
    }
  }
}

export const productController = new ProductController();

