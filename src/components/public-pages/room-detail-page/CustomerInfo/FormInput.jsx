const FormInput = ({
  register,
  name,
  label,
  type = "text",
  placeholder,
  // eslint-disable-next-line no-unused-vars
  Icon,
  error,
  ...props
}) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-2">
      {label} *
    </label>
    <div className="relative">
      <input
        {...register(name)}
        type={type}
        className={`w-full p-3 border rounded-xl focus:ring-2 focus:ring-yellow-500 focus:border-transparent ${
          error ? "border-red-300" : "border-gray-300"
        }`}
        placeholder={placeholder}
        {...props}
      />
      <Icon className="absolute right-3 top-3.5 w-5 h-5 text-gray-400 pointer-events-none" />
    </div>
    {error && <p className="text-red-500 text-sm mt-1">{error.message}</p>}
  </div>
);

export default FormInput;
