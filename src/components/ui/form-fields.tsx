import type {
  InputHTMLAttributes,
  SelectHTMLAttributes,
  TextareaHTMLAttributes,
  ReactNode,
} from "react";

type FieldMeta = { id: string; label: string; hint?: string; error?: string };
function descriptionId({ id, hint, error }: FieldMeta) {
  return [hint && `${id}-hint`, error && `${id}-error`].filter(Boolean).join(" ") || undefined;
}
function FieldFrame({
  id,
  label,
  hint,
  error,
  required,
  children,
}: FieldMeta & { required?: boolean; children: ReactNode }) {
  return (
    <div className="space-y-2">
      <label htmlFor={id} className="block text-label font-bold">
        {label}
        {required && <span aria-hidden="true"> *</span>}
      </label>
      {children}
      {hint && (
        <p id={`${id}-hint`} className="text-label text-muted">
          {hint}
        </p>
      )}
      {error && (
        <p id={`${id}-error`} role="alert" className="text-label text-danger">
          {error}
        </p>
      )}
    </div>
  );
}
export function InputField({
  label,
  hint,
  error,
  className = "",
  ...props
}: FieldMeta & InputHTMLAttributes<HTMLInputElement>) {
  return (
    <FieldFrame {...{ id: props.id, label, hint, error, required: props.required }}>
      <input
        {...props}
        className={`field ${className}`}
        aria-invalid={Boolean(error)}
        aria-describedby={descriptionId({ id: props.id, label, hint, error })}
      />
    </FieldFrame>
  );
}
export function SelectField({
  label,
  hint,
  error,
  options,
  className = "",
  ...props
}: FieldMeta &
  SelectHTMLAttributes<HTMLSelectElement> & {
    options: readonly { value: string; label: string }[];
  }) {
  return (
    <FieldFrame {...{ id: props.id, label, hint, error, required: props.required }}>
      <select
        {...props}
        className={`field ${className}`}
        aria-invalid={Boolean(error)}
        aria-describedby={descriptionId({ id: props.id, label, hint, error })}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </FieldFrame>
  );
}
export function TextareaField({
  label,
  hint,
  error,
  className = "",
  ...props
}: FieldMeta & TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <FieldFrame {...{ id: props.id, label, hint, error, required: props.required }}>
      <textarea
        rows={4}
        {...props}
        className={`field resize-y ${className}`}
        aria-invalid={Boolean(error)}
        aria-describedby={descriptionId({ id: props.id, label, hint, error })}
      />
    </FieldFrame>
  );
}
