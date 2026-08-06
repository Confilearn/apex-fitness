const labelClass =
  'mb-[7px] block text-[10px] font-semibold tracking-[0.12em] text-[rgba(232,224,208,0.38)] uppercase';

export const FormField = ({ label, type = 'text', placeholder, value, onChange, required, textarea }) => (
  <div>
    <label className={labelClass}>{label}</label>
    {textarea ? (
      <textarea className="gs-textarea" placeholder={placeholder} value={value} onChange={onChange} />
    ) : (
      <input
        className="gs-input"
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required={required}
      />
    )}
  </div>
);

export const FormSelect = ({ label, value, onChange, required, options }) => (
  <div>
    <label className={labelClass}>{label}</label>
    <select className="gs-select" value={value} onChange={onChange} required={required}>
      {options.map((o) => (
        <option key={o.value} value={o.value}>
          {o.label}
        </option>
      ))}
    </select>
  </div>
);
