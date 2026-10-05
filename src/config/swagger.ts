export const swaggerSpec = {
  openapi: '3.0.0',
  info: {
    title: 'MatchStorm Backend API',
    version: '1.0.0',
    description: 'API documentation for MatchStorm Game Engine & Real-time PvP Backend'
  },
  servers: [
    {
      url: `http://localhost:${process.env.PORT || 5000}`,
      description: 'Local development server'
    }
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'Enter your JWT token (e.g. from /api/v1/auth/login)'
      }
    },
    schemas: {
      RegisterRequest: {
        type: 'object',
        required: ['email', 'username', 'password'],
        properties: {
          email: { type: 'string', format: 'email', example: 'player1@matchstorm.com' },
          username: { type: 'string', example: 'storm_striker' },
          password: { type: 'string', minLength: 6, example: 'password123' }
        }
      },
      LoginRequest: {
        type: 'object',
        required: ['email', 'password'],
        properties: {
          email: { type: 'string', format: 'email', example: 'player1@matchstorm.com' },
          password: { type: 'string', example: 'password123' }
        }
      },
      UserProfile: {
        type: 'object',
        properties: {
          id: { type: 'string', example: 'cm123abc' },
          email: { type: 'string', example: 'player1@matchstorm.com' },
          username: { type: 'string', example: 'storm_striker' },
          eloRating: { type: 'integer', example: 1200 },
          matchesWon: { type: 'integer', example: 5 },
          matchesLost: { type: 'integer', example: 2 }
        }
      },
      LeaderboardEntry: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          username: { type: 'string' },
          eloRating: { type: 'integer', example: 1250 },
          matchesWon: { type: 'integer', example: 10 },
          matchesLost: { type: 'integer', example: 3 }
        }
      },
      ApiResponse: {
        type: 'object',
        properties: {
          success: { type: 'boolean', example: true },
          message: { type: 'string', example: 'Success' },
          data: { type: 'object' }
        }
      }
    }
  },
  paths: {
    '/health': {
      get: {
        // summary: 'Health Check',
        description: 'Returns server operational status',
        responses: {
          200: {
            description: 'Server is healthy',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    status: { type: 'string', example: 'ok' },
                    timestamp: { type: 'string', example: '2026-10-05T05:00:00.000Z' }
                  }
                }
              }
            }
          }
        }
      }
    },
    '/api/v1/auth/register': {
      post: {
        tags: ['Auth'],
        // summary: 'Register a new player',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/RegisterRequest' }
            }
          }
        },
        responses: {
          201: {
            description: 'User registered successfully',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ApiResponse' }
              }
            }
          },
          400: { description: 'Validation error or email/username already taken' }
        }
      }
    },
    '/api/v1/auth/login': {
      post: {
        tags: ['Auth'],
        // summary: 'Player login',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/LoginRequest' }
            }
          }
        },
        responses: {
          200: {
            description: 'Login successful returning JWT token and user info',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ApiResponse' }
              }
            }
          },
          401: { description: 'Invalid email or password' }
        }
      }
    },
    '/api/v1/users/me': {
      get: {
        tags: ['Users'],
        // summary: 'Get current user profile',
        security: [{ bearerAuth: [] }],
        responses: {
          200: {
            description: 'User profile retrieved',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ApiResponse' }
              }
            }
          },
          401: { description: 'Unauthorized or invalid token' }
        }
      }
    },
    '/api/v1/leaderboard/top': {
      get: {
        tags: ['Leaderboard'],
        // summary: 'Get top leaderboard rankings',
        responses: {
          200: {
            description: 'Top rankings list',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    data: {
                      type: 'array',
                      items: { $ref: '#/components/schemas/LeaderboardEntry' }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
};
