---
name: react-component-template
description: Standard React component blueprint using TypeScript, named exports, CSS variables, and colocated unit tests
---

# React Component Template Blueprint

Follow this blueprint when creating a new UI component:

## 1. Directory Structure

Create a folder for the component containing the component code, style, and test:

```
src/components/ui/Button/
|-- Button.tsx          # Component core
|-- Button.module.css   # Styles using CSS variables
`-- Button.test.tsx     # Colocated test suite
```

## 2. Component Implementation (`Button.tsx`)

```typescript
import React from 'react';
import styles from './Button.module.css';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger';
  isLoading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  isLoading = false,
  className = '',
  disabled,
  ...props
}) => {
  const buttonClass = `${styles.button} ${styles[variant]} ${className}`;

  return (
    <button
      className={buttonClass}
      disabled={disabled || isLoading}
      aria-busy={isLoading}
      {...props}
    >
      {isLoading ? <span className={styles.spinner} /> : children}
    </button>
  );
};
```

## 3. Styles (`Button.module.css`)

```css
.button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.5rem 1rem;
  border-radius: var(--border-radius-sm);
  font-family: var(--font-primary);
  font-weight: 500;
  transition:
    background-color var(--transition-fast),
    transform var(--transition-fast);
  cursor: pointer;
  border: none;
}

.button:focus-visible {
  outline: 2px solid var(--color-focus);
  outline-offset: 2px;
}

.primary {
  background-color: var(--color-primary);
  color: var(--color-on-primary);
}

.primary:hover:not(:disabled) {
  background-color: var(--color-primary-hover);
}

.button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
```
