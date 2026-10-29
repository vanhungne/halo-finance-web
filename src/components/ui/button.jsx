import PropTypes from "prop-types"

export function Button({
  children,
  variant = "default",
  size = "default",
  className = "",
  onClick,
  disabled,
  type = "button",
  ...props
}) {
  const baseStyles =
    "inline-flex items-center justify-center rounded-xl font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-sky-500/15 focus-visible:border-sky-500 disabled:opacity-50 disabled:pointer-events-none active:scale-[0.98]"

  const variants = {
    default: "bg-gradient-to-r from-sky-500 to-blue-600 text-white shadow-sm shadow-sky-500/20 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-sky-500/20",
    destructive: "bg-rose-500 text-white shadow-sm hover:bg-rose-600 hover:-translate-y-0.5",
    outline: "border border-slate-200 bg-white text-slate-700 shadow-sm hover:border-sky-200 hover:bg-sky-50 hover:text-sky-700",
    secondary: "bg-sky-50 text-sky-700 border border-sky-100 hover:bg-sky-100",
    ghost: "text-slate-600 hover:bg-slate-100 hover:text-slate-950",
    link: "underline-offset-4 hover:underline text-sky-600",
  }

  const sizes = {
    default: "h-10 py-2 px-4",
    sm: "h-9 px-3 rounded-md text-sm",
    lg: "h-11 px-8 rounded-md",
    icon: "h-10 w-10",
  }

  const variantStyle = variants[variant] || variants.default
  const sizeStyle = sizes[size] || sizes.default

  return (
    <button
      type={type}
      className={`${baseStyles} ${variantStyle} ${sizeStyle} ${className}`}
      onClick={onClick}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  )
}

Button.propTypes = {
  children: PropTypes.node,
  variant: PropTypes.oneOf(["default", "destructive", "outline", "secondary", "ghost", "link"]),
  size: PropTypes.oneOf(["default", "sm", "lg", "icon"]),
  className: PropTypes.string,
  onClick: PropTypes.func,
  disabled: PropTypes.bool,
  type: PropTypes.string,
}
