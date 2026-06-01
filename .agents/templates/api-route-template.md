---
name: api-route-template
description: Standard API route template with request validation, structured error mapping, and Express/Next.js compatibility
---

# API Route Template Blueprint

Follow this blueprint when creating a backend API handler or controller:

## 1. Directory Structure

```
src/server/controllers/userController.ts  # Controller file
src/server/services/userService.ts        # Service business logic
```

## 2. API Controller Implementation

```typescript
import { Request, Response } from 'express';
import { z } from 'zod';
import { userService } from '../services/userService';

// Input Validation Schema
const CreateUserSchema = z.object({
  email: z.string().email('Invalid email address format'),
  password: z.string().min(8, 'Password must be at least 8 characters long'),
  name: z.string().min(1, 'Name is required'),
});

export const createUserController = async (req: Request, res: Response): Promise<void> => {
  try {
    // 1. Validate request body against schema
    const parsedBody = CreateUserSchema.parse(req.body);

    // 2. Call service layer for business logic execution
    const user = await userService.createUser(parsedBody);

    // 3. Return uniform success payload
    res.status(201).json({
      success: true,
      data: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
    });
  } catch (error) {
    // 4. Uniform Error Handling (let middleware or local handler format it)
    if (error instanceof z.ZodError) {
      res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_FAILED',
          message: 'The request body failed validation checks.',
          details: error.errors.map((err) => ({
            field: err.path.join('.'),
            issue: err.message,
          })),
        },
      });
      return;
    }

    res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_SERVER_ERROR',
        message: 'An unexpected system error occurred.',
      },
    });
  }
};
```
