import { forwardRef } from "react"
import type { InputHTMLAttributes } from "react"

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  id: string,
  name: string,
  label: string,
  value: string,
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void,
  type?: string,
  placeholder?: string,
  error?: string,
  disabled?: boolean,
  required?: boolean,
  className?: string
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
(
  {
    id,
    name,
    label,
    value,
    onChange,
    type = 'text',
    placeholder,
    error,
    disabled = false,
    required = false,
    className = '',
    ...rest
  }, 
  ref
  ) => {
    return (
      <div className="w-full">
        <label
          htmlFor={id}
          className="block text-sm font-medium text-foreground mb-1"
        >
          {label}
          {required && <span className="text-tertiary ml-1">*</span>}
        </label>

        <input
          ref={ref}
          id={id}
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          className={`
            w-full bg-background border rounded-lg px-4 py-2 text-foreground
            placeholder-neutral focus:outline-none focus:ring-2 focus:ring-primary
            transition duration-200
            ${error ? 'border-tertiary' : 'border-border'}
            ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
            ${className}
          `}
          {...rest}
        />

        {error && (
          <p className="mt-1 text-sm text-tertiary">{error}</p>
        )}
      </div>
    )
  }
)

Input.displayName = 'Input'