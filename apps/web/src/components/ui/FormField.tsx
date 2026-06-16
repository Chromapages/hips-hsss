import React from 'react';
import { useFormContext, get } from 'react-hook-form';
import { cn } from '@/lib/utils';

export interface FormFieldProps {
  name: string;
  label?: string;
  children: React.ReactNode;
  className?: string;
}

export const FormField = ({ name, label, children, className }: FormFieldProps) => {
  const { formState: { errors } } = useFormContext();
  const error = get(errors, name);
  const errorId = `${name}-error`;

  return (
    <div className={cn('flex flex-col gap-1.5', className)}>
      {label && (
        <label htmlFor={name} className="text-sm font-medium text-foreground">
          {label}
        </label>
      )}
      {React.isValidElement(children) ? (
        React.cloneElement(children as React.ReactElement<any>, {
          id: name,
          'aria-invalid': !!error,
          'aria-describedby': error ? errorId : undefined,
        })
      ) : (
        children
      )}
      {error && (
        <p id={errorId} role="alert" className="text-xs text-destructive font-medium">
          {error.message as string}
        </p>
      )}
    </div>
  );
};
