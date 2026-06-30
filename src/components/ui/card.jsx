import PropTypes from "prop-types"
import { cn } from "../../utils/cn"

export function Card({ className, ...props }) {
  return <div className={cn("bg-card text-card-foreground rounded-2xl", className)} {...props} />
}

export function CardHeader({ className, ...props }) {
  return <div className={cn("flex flex-col space-y-1.5 px-4 py-4", className)} {...props} />
}

export function CardTitle({ className, ...props }) {
  return <h3 className={cn("text-2xl font-semibold leading-none tracking-tight", className)} {...props} />
}

export function CardDescription({ className, ...props }) {
  return <p className={cn("text-sm text-muted-foreground", className)} {...props} />
}

export function CardContent({ className, ...props }) {
  return <div className={cn("p-4 pt-0", className)} {...props} />
}

export function CardFooter({ className, ...props }) {
  return <div className={cn("flex items-center p-6 pt-0", className)} {...props} />
}

Card.propTypes = {
  className: PropTypes.string,
  children: PropTypes.node,
}

CardHeader.propTypes = {
  className: PropTypes.string,
  children: PropTypes.node,
}

CardTitle.propTypes = {
  className: PropTypes.string,
  children: PropTypes.node,
}

CardDescription.propTypes = {
  className: PropTypes.string,
  children: PropTypes.node,
}

CardContent.propTypes = {
  className: PropTypes.string,
  children: PropTypes.node,
}

CardFooter.propTypes = {
  className: PropTypes.string,
  children: PropTypes.node,
}
