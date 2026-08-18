import { useId } from 'react';

const labelClass =
  'mb-[7px] block text-[10px] font-semibold tracking-[0.12em] text-[rgba(232,224,208,0.6)] uppercase';

const errorClass = 'mt-1.5 block text-[11px] font-medium text-accent-hi';

/*
  Labels are tied to their control with htmlFor/id, and errors are wired
  through aria-describedby + aria-invalid so a screen reader announces them
  instead of leaving the field silently red.
*/
export const FormField = ({
  label,
  type = 'text',
  placeholder,
  value,
  onChange,
  required,
  textarea,
  error,
  autoComplete,
}) => {
  const id = useId();
  const errorId = `${id}-error`;
  const Control = textarea ? 'textarea' : 'input';

  return (
    <div>
      <label className={labelClass} htmlFor={id}>
        {label}
        {required && <span className="text-accent-hi"> *</span>}
      </label>
      <Control
        id={id}
        className={textarea ? 'gs-textarea' : 'gs-input'}
        // The textarea branch used to silently drop `required`.
        {...(textarea ? {} : { type })}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required={required}
        autoComplete={autoComplete}
        aria-invalid={error ? 'true' : undefined}
        aria-describedby={error ? errorId : undefined}
      />
      {error && (
        <span id={errorId} className={errorClass}>
          {error}
        </span>
      )}
    </div>
  );
};

export const FormSelect = ({ label, value, onChange, required, options, error, autoComplete }) => {
  const id = useId();
  const errorId = `${id}-error`;

  return (
    <div>
      <label className={labelClass} htmlFor={id}>
        {label}
        {required && <span className="text-accent-hi"> *</span>}
      </label>
      <select
        id={id}
        className="gs-select"
        value={value}
        onChange={onChange}
        required={required}
        autoComplete={autoComplete}
        aria-invalid={error ? 'true' : undefined}
        aria-describedby={error ? errorId : undefined}
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
      {error && (
        <span id={errorId} className={errorClass}>
          {error}
        </span>
      )}
    </div>
  );
};

/*
  Honeypot. Hidden from sight and from assistive tech, but a bot filling every
  input will trip it. The server drops any submission that carries a value.
*/
export const Honeypot = ({ value, onChange }) => (
  <div aria-hidden="true" className="absolute left-[-9999px] h-0 w-0 overflow-hidden">
    <label htmlFor="company-website">Company website</label>
    {/* eslint-disable-next-line jsx-a11y/control-has-associated-label --
        it has a label; the wrapper is aria-hidden on purpose, because being
        invisible to assistive tech is the whole mechanism. */}
    <input
      id="company-website"
      name="company"
      type="text"
      tabIndex={-1}
      autoComplete="off"
      value={value}
      onChange={onChange}
    />
  </div>
);
