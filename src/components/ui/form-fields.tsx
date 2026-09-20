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
      <label htmlFor={id} className="block text-xs font-semibold tracking-wide uppercase text-slate-300">
        {label}
        {required && <span aria-hidden="true" className="text-sky-400 font-bold"> *</span>}
      </label>
      {children}
      {hint && (
        <p id={`${id}-hint`} className="text-xs text-slate-400">
          {hint}
        </p>
      )}
      {error && (
        <p id={`${id}-error`} role="alert" className="text-xs font-semibold text-rose-400">
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
          <option key={option.value} value={option.value} className="bg-[#0b1528] text-white py-1">
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
