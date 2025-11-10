const swaggerDocument = {
  openapi: '3.0.1',
  info: {
    title: 'Swagger Express Node Mongo AWS API',
    description:
      'REST API for authentication, user management, and product catalog. This documentation is generated manually and served through Swagger UI.',
    version: '1.0.0',
    contact: {
      name: 'API Support',
      url: 'https://github.com/TechnologicalJerry/swagger-express-node-mongo-aws',
    },
  },
  servers: [
    {
      url: '/api',
      description: 'Relative base path mounted by the Express application',
    },
  ],
  tags: [
    { name: 'System', description: 'System level endpoints' },
    { name: 'Auth', description: 'Authentication and authorization endpoints' },
    { name: 'Users', description: 'User profile management endpoints' },
    { name: 'Products', description: 'Product catalog management endpoints' },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'Provide the JWT token issued by the login or register endpoints.',
      },
    },
    schemas: {
      SuccessResponse: {
        type: 'object',
        properties: {
          success: { type: 'boolean', example: true },
          message: { type: 'string', example: 'Operation completed successfully' },
          data: { nullable: true },
        },
        required: ['success', 'message'],
      },
      ErrorResponse: {
        type: 'object',
        properties: {
          success: { type: 'boolean', example: false },
          message: { type: 'string', example: 'Validation failed' },
          error: { type: 'string', nullable: true },
        },
        required: ['success', 'message'],
      },
      AuthResponseData: {
        type: 'object',
        properties: {
          token: {
            type: 'string',
            description: 'JWT access token',
            example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
          },
          user: { $ref: '#/components/schemas/User' },
        },
        required: ['token', 'user'],
      },
      PasswordResetResponseData: {
        type: 'object',
        properties: {
          resetToken: {
            type: 'string',
            nullable: true,
            description: 'Reset token generated for password reset flows',
          },
          message: {
            type: 'string',
            example: 'Use the provided token to reset the password.',
          },
        },
        required: ['message'],
      },
      User: {
        type: 'object',
        properties: {
          id: { type: 'string', example: '6650f2542f51f9125bf4c7dd' },
          email: { type: 'string', format: 'email', example: 'user@example.com' },
          firstName: { type: 'string', nullable: true, example: 'John' },
          lastName: { type: 'string', nullable: true, example: 'Doe' },
          userName: { type: 'string', nullable: true, example: 'johndoe' },
          gender: {
            type: 'string',
            nullable: true,
            enum: ['male', 'female', 'other', ''],
            example: 'male',
          },
          dob: { type: 'string', format: 'date', nullable: true, example: '1990-01-01' },
          phone: { type: 'string', nullable: true, example: '+1 555 123 4567' },
          isActive: { type: 'boolean', example: true },
          lastLoginAt: { type: 'string', format: 'date-time', nullable: true },
          createdAt: { type: 'string', format: 'date-time', example: '2024-01-01T10:00:00.000Z' },
          updatedAt: { type: 'string', format: 'date-time', example: '2024-01-02T12:00:00.000Z' },
        },
        required: ['id', 'email', 'isActive', 'createdAt', 'updatedAt'],
      },
      CreateUserRequest: {
        type: 'object',
        properties: {
          email: { type: 'string', format: 'email' },
          password: { type: 'string', minLength: 8 },
          confirmPassword: { type: 'string', minLength: 8 },
          firstName: { type: 'string', nullable: true },
          lastName: { type: 'string', nullable: true },
          userName: { type: 'string', nullable: true },
          gender: { type: 'string', nullable: true, enum: ['male', 'female', 'other', ''] },
          dob: { type: 'string', format: 'date', nullable: true },
          phone: { type: 'string', nullable: true },
        },
        required: ['email', 'password', 'confirmPassword'],
      },
      LoginRequest: {
        type: 'object',
        properties: {
          email: { type: 'string', format: 'email' },
          password: { type: 'string', minLength: 1 },
        },
        required: ['email', 'password'],
      },
      ForgotPasswordRequest: {
        type: 'object',
        properties: {
          email: { type: 'string', format: 'email' },
        },
        required: ['email'],
      },
      ResetPasswordRequest: {
        type: 'object',
        properties: {
          token: { type: 'string' },
          password: { type: 'string', minLength: 8 },
          confirmPassword: { type: 'string', minLength: 8 },
        },
        required: ['token', 'password', 'confirmPassword'],
      },
      UpdateUserRequest: {
        type: 'object',
        properties: {
          firstName: { type: 'string', nullable: true },
          lastName: { type: 'string', nullable: true },
          email: { type: 'string', format: 'email', nullable: true },
          userName: { type: 'string', nullable: true },
          gender: { type: 'string', nullable: true, enum: ['male', 'female', 'other', ''] },
          dob: { type: 'string', format: 'date', nullable: true },
          phone: { type: 'string', nullable: true },
        },
      },
      Product: {
        type: 'object',
        properties: {
          id: { type: 'string', example: '6650f2542f51f9125bf4c7de' },
          name: { type: 'string', example: 'Wireless Headphones' },
          description: {
            type: 'string',
            nullable: true,
            example: 'Noise cancelling wireless headphones with 20h battery life.',
          },
          price: { type: 'number', format: 'float', example: 199.99 },
          stock: { type: 'integer', example: 25 },
          imageUrl: {
            type: 'string',
            nullable: true,
            example: 'https://cdn.example.com/products/headphones.jpg',
          },
          user: {
            type: 'string',
            description: 'Identifier of the user who owns the product',
            example: '6650f2542f51f9125bf4c7dd',
          },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' },
        },
        required: ['id', 'name', 'price', 'stock', 'user', 'createdAt', 'updatedAt'],
      },
      CreateProductRequest: {
        type: 'object',
        properties: {
          name: { type: 'string', minLength: 1, maxLength: 255 },
          description: { type: 'string', nullable: true, maxLength: 1000 },
          price: { type: 'number', format: 'float', minimum: 0 },
          stock: { type: 'integer', minimum: 0, nullable: true },
          imageUrl: { type: 'string', format: 'uri', nullable: true },
        },
        required: ['name', 'price'],
      },
      UpdateProductRequest: {
        type: 'object',
        properties: {
          name: { type: 'string', minLength: 1, maxLength: 255 },
          description: { type: 'string', nullable: true, maxLength: 1000 },
          price: { type: 'number', format: 'float', minimum: 0 },
          stock: { type: 'integer', minimum: 0 },
          imageUrl: { type: 'string', format: 'uri', nullable: true },
        },
      },
      PaginatedProductsData: {
        type: 'object',
        properties: {
          products: {
            type: 'array',
            items: { $ref: '#/components/schemas/Product' },
          },
          total: { type: 'integer', example: 42 },
          limit: { type: 'integer', example: 10 },
          offset: { type: 'integer', example: 0 },
        },
        required: ['products', 'total', 'limit', 'offset'],
      },
    },
  },
  paths: {
    '/health': {
      get: {
        tags: ['System'],
        summary: 'Health check',
        description: 'Returns the health status of the API.',
        responses: {
          200: {
            description: 'API is healthy',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    status: { type: 'string', example: 'ok' },
                    timestamp: { type: 'string', format: 'date-time' },
                  },
                  required: ['status', 'timestamp'],
                },
              },
            },
          },
        },
      },
    },
    '/auth/register': {
      post: {
        tags: ['Auth'],
        summary: 'Register a new user',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/CreateUserRequest' },
            },
          },
        },
        responses: {
          201: {
            description: 'User registered successfully',
            content: {
              'application/json': {
                schema: {
                  allOf: [
                    { $ref: '#/components/schemas/SuccessResponse' },
                    {
                      type: 'object',
                      properties: {
                        data: { $ref: '#/components/schemas/AuthResponseData' },
                      },
                    },
                  ],
                },
              },
            },
          },
          400: {
            description: 'Validation error',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
              },
            },
          },
          409: {
            description: 'User already exists',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
              },
            },
          },
        },
      },
    },
    '/auth/login': {
      post: {
        tags: ['Auth'],
        summary: 'Login a user',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/LoginRequest' },
            },
          },
        },
        responses: {
          200: {
            description: 'Login successful',
            content: {
              'application/json': {
                schema: {
                  allOf: [
                    { $ref: '#/components/schemas/SuccessResponse' },
                    {
                      type: 'object',
                      properties: {
                        data: { $ref: '#/components/schemas/AuthResponseData' },
                      },
                    },
                  ],
                },
              },
            },
          },
          400: {
            description: 'Invalid credentials or validation error',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
              },
            },
          },
          401: {
            description: 'Authentication failed',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
              },
            },
          },
        },
      },
    },
    '/auth/forgot-password': {
      post: {
        tags: ['Auth'],
        summary: 'Request a password reset token',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/ForgotPasswordRequest' },
            },
          },
        },
        responses: {
          200: {
            description: 'Password reset requested',
            content: {
              'application/json': {
                schema: {
                  allOf: [
                    { $ref: '#/components/schemas/SuccessResponse' },
                    {
                      type: 'object',
                      properties: {
                        data: {
                          allOf: [
                            { $ref: '#/components/schemas/PasswordResetResponseData' },
                          ],
                        },
                      },
                    },
                  ],
                },
              },
            },
          },
          400: {
            description: 'Validation error',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
              },
            },
          },
        },
      },
    },
    '/auth/reset-password': {
      post: {
        tags: ['Auth'],
        summary: 'Reset user password using a reset token',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/ResetPasswordRequest' },
            },
          },
        },
        responses: {
          200: {
            description: 'Password reset successfully',
            content: {
              'application/json': {
                schema: {
                  allOf: [
                    { $ref: '#/components/schemas/SuccessResponse' },
                    {
                      type: 'object',
                      properties: {
                        data: { nullable: true, example: null },
                      },
                    },
                  ],
                },
              },
            },
          },
          400: {
            description: 'Validation error',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
              },
            },
          },
          404: {
            description: 'Token not found or expired',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
              },
            },
          },
        },
      },
    },
    '/auth/profile': {
      get: {
        tags: ['Auth'],
        summary: 'Retrieve authenticated user profile',
        security: [{ bearerAuth: [] }],
        responses: {
          200: {
            description: 'Profile retrieved successfully',
            content: {
              'application/json': {
                schema: {
                  allOf: [
                    { $ref: '#/components/schemas/SuccessResponse' },
                    {
                      type: 'object',
                      properties: {
                        data: { $ref: '#/components/schemas/User' },
                      },
                    },
                  ],
                },
              },
            },
          },
          401: {
            description: 'Unauthorized',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
              },
            },
          },
        },
      },
    },
    '/auth/logout': {
      post: {
        tags: ['Auth'],
        summary: 'Logout authenticated user',
        description: 'Clears the active session and marks the audit log as logged out.',
        security: [{ bearerAuth: [] }],
        responses: {
          200: {
            description: 'Logout successful',
            content: {
              'application/json': {
                schema: {
                  allOf: [
                    { $ref: '#/components/schemas/SuccessResponse' },
                    {
                      type: 'object',
                      properties: {
                        data: { nullable: true, example: null },
                      },
                    },
                  ],
                },
              },
            },
          },
          401: {
            description: 'Unauthorized',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
              },
            },
          },
        },
      },
    },
    '/users/{id}': {
      get: {
        tags: ['Users'],
        summary: 'Get user by identifier',
        parameters: [
          {
            in: 'path',
            name: 'id',
            required: true,
            schema: { type: 'string' },
            description: 'MongoDB ObjectId of the user',
          },
        ],
        responses: {
          200: {
            description: 'User retrieved successfully',
            content: {
              'application/json': {
                schema: {
                  allOf: [
                    { $ref: '#/components/schemas/SuccessResponse' },
                    {
                      type: 'object',
                      properties: {
                        data: { $ref: '#/components/schemas/User' },
                      },
                    },
                  ],
                },
              },
            },
          },
          400: {
            description: 'Invalid identifier',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
              },
            },
          },
          404: {
            description: 'User not found',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
              },
            },
          },
        },
      },
    },
    '/users': {
      put: {
        tags: ['Users'],
        summary: 'Update authenticated user profile',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/UpdateUserRequest' },
            },
          },
        },
        responses: {
          200: {
            description: 'User updated successfully',
            content: {
              'application/json': {
                schema: {
                  allOf: [
                    { $ref: '#/components/schemas/SuccessResponse' },
                    {
                      type: 'object',
                      properties: {
                        data: { $ref: '#/components/schemas/User' },
                      },
                    },
                  ],
                },
              },
            },
          },
          400: {
            description: 'Validation error',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
              },
            },
          },
          401: {
            description: 'Unauthorized',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
              },
            },
          },
        },
      },
      delete: {
        tags: ['Users'],
        summary: 'Delete authenticated user account',
        security: [{ bearerAuth: [] }],
        responses: {
          200: {
            description: 'User deleted successfully',
            content: {
              'application/json': {
                schema: {
                  allOf: [
                    { $ref: '#/components/schemas/SuccessResponse' },
                    {
                      type: 'object',
                      properties: {
                        data: { nullable: true, example: null },
                      },
                    },
                  ],
                },
              },
            },
          },
          401: {
            description: 'Unauthorized',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
              },
            },
          },
        },
      },
    },
    '/products': {
      get: {
        tags: ['Products'],
        summary: 'Retrieve all products with pagination',
        parameters: [
          {
            in: 'query',
            name: 'limit',
            schema: { type: 'integer', minimum: 1, default: 10 },
            description: 'Maximum number of products to return',
          },
          {
            in: 'query',
            name: 'offset',
            schema: { type: 'integer', minimum: 0, default: 0 },
            description: 'Number of products to skip',
          },
        ],
        responses: {
          200: {
            description: 'Products retrieved successfully',
            content: {
              'application/json': {
                schema: {
                  allOf: [
                    { $ref: '#/components/schemas/SuccessResponse' },
                    {
                      type: 'object',
                      properties: {
                        data: { $ref: '#/components/schemas/PaginatedProductsData' },
                      },
                    },
                  ],
                },
              },
            },
          },
        },
      },
      post: {
        tags: ['Products'],
        summary: 'Create a new product',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/CreateProductRequest' },
            },
          },
        },
        responses: {
          201: {
            description: 'Product created successfully',
            content: {
              'application/json': {
                schema: {
                  allOf: [
                    { $ref: '#/components/schemas/SuccessResponse' },
                    {
                      type: 'object',
                      properties: {
                        data: { $ref: '#/components/schemas/Product' },
                      },
                    },
                  ],
                },
              },
            },
          },
          400: {
            description: 'Validation error',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
              },
            },
          },
          401: {
            description: 'Unauthorized',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
              },
            },
          },
        },
      },
    },
    '/products/my-products': {
      get: {
        tags: ['Products'],
        summary: 'Retrieve products created by the authenticated user',
        security: [{ bearerAuth: [] }],
        responses: {
          200: {
            description: 'Products retrieved successfully',
            content: {
              'application/json': {
                schema: {
                  allOf: [
                    { $ref: '#/components/schemas/SuccessResponse' },
                    {
                      type: 'object',
                      properties: {
                        data: {
                          type: 'array',
                          items: { $ref: '#/components/schemas/Product' },
                        },
                      },
                    },
                  ],
                },
              },
            },
          },
          401: {
            description: 'Unauthorized',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
              },
            },
          },
        },
      },
    },
    '/products/{id}': {
      get: {
        tags: ['Products'],
        summary: 'Retrieve a product by identifier',
        parameters: [
          {
            in: 'path',
            name: 'id',
            required: true,
            schema: { type: 'string' },
            description: 'MongoDB ObjectId of the product',
          },
        ],
        responses: {
          200: {
            description: 'Product retrieved successfully',
            content: {
              'application/json': {
                schema: {
                  allOf: [
                    { $ref: '#/components/schemas/SuccessResponse' },
                    {
                      type: 'object',
                      properties: {
                        data: { $ref: '#/components/schemas/Product' },
                      },
                    },
                  ],
                },
              },
            },
          },
          400: {
            description: 'Invalid identifier',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
              },
            },
          },
          404: {
            description: 'Product not found',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
              },
            },
          },
        },
      },
      put: {
        tags: ['Products'],
        summary: 'Update an existing product',
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            in: 'path',
            name: 'id',
            required: true,
            schema: { type: 'string' },
            description: 'MongoDB ObjectId of the product',
          },
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/UpdateProductRequest' },
            },
          },
        },
        responses: {
          200: {
            description: 'Product updated successfully',
            content: {
              'application/json': {
                schema: {
                  allOf: [
                    { $ref: '#/components/schemas/SuccessResponse' },
                    {
                      type: 'object',
                      properties: {
                        data: { $ref: '#/components/schemas/Product' },
                      },
                    },
                  ],
                },
              },
            },
          },
          400: {
            description: 'Validation error or invalid identifier',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
              },
            },
          },
          401: {
            description: 'Unauthorized',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
              },
            },
          },
          404: {
            description: 'Product not found',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
              },
            },
          },
        },
      },
      delete: {
        tags: ['Products'],
        summary: 'Delete a product',
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            in: 'path',
            name: 'id',
            required: true,
            schema: { type: 'string' },
            description: 'MongoDB ObjectId of the product',
          },
        ],
        responses: {
          200: {
            description: 'Product deleted successfully',
            content: {
              'application/json': {
                schema: {
                  allOf: [
                    { $ref: '#/components/schemas/SuccessResponse' },
                    {
                      type: 'object',
                      properties: {
                        data: { nullable: true, example: null },
                      },
                    },
                  ],
                },
              },
            },
          },
          401: {
            description: 'Unauthorized',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
              },
            },
          },
          404: {
            description: 'Product not found',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
              },
            },
          },
        },
      },
    },
  },
} as const;

export { swaggerDocument };


