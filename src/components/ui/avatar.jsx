import PropTypes from "prop-types"

export function Avatar({ className, ...props }) {
  return <div className={`relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full ${className}`} {...props} />
}

export function AvatarImage({ className, src, alt = "", ...props }) {
  return (
    <img src={src || "/placeholder.svg"} alt={alt} className={`aspect-square h-full w-full ${className}`} {...props} />
  )
}

export function AvatarFallback({ className, ...props }) {
  return (
    <div
      className={`flex h-full w-full items-center justify-center rounded-full bg-gray-200 dark:bg-gray-700 ${className}`}
      {...props}
    />
  )
}

Avatar.propTypes = {
  className: PropTypes.string,
  children: PropTypes.node,
}

AvatarImage.propTypes = {
  className: PropTypes.string,
  src: PropTypes.string,
  alt: PropTypes.string,
}

AvatarFallback.propTypes = {
  className: PropTypes.string,
  children: PropTypes.node,
}
