---
name: test-template
description: Standard test template for unit testing pure functions and mock services using Vitest/Jest and AAA patterns
---

# Test Template Blueprint

Follow this blueprint when writing a new test suite:

## 1. Pure Function Test Blueprint

```typescript
import { describe, it, expect } from 'vitest';
import { sum } from './math';

describe('math/sum', () => {
  it('should correctly add two positive integers (Happy Path)', () => {
    // Arrange
    const val1 = 5;
    const val2 = 10;

    // Act
    const result = sum(val1, val2);

    // Assert
    expect(result).toBe(15);
  });

  it('should return 0 when both inputs are 0 (Boundary Path)', () => {
    // Arrange & Act & Assert
    expect(sum(0, 0)).toBe(0);
  });
});
```

## 2. Async Service Test Blueprint with Mocks

```typescript
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { userService } from './userService';
import { db } from '../db';

// Mock DB client
vi.mock('../db', () => ({
  db: {
    user: {
      create: vi.fn(),
    },
  },
}));

describe('services/userService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should successfully create a new user profile', async () => {
    // Arrange
    const input = { email: 'test@example.com', name: 'John Doe' };
    const mockCreatedUser = { id: 'usr_abc', ...input, createdAt: new Date() };

    vi.mocked(db.user.create).mockResolvedValue(mockCreatedUser);

    // Act
    const result = await userService.createUser(input);

    // Assert
    expect(result).toEqual(mockCreatedUser);
    expect(db.user.create).toHaveBeenCalledTimes(1);
    expect(db.user.create).toHaveBeenCalledWith({
      data: input,
    });
  });
});
```
