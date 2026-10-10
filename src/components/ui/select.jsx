"use client"

import React, { useEffect } from "react"

import { useState } from "react"
import PropTypes from "prop-types"

export function Select({ defaultValue, children, className, ...props }) {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedValue, setSelectedValue] = useState(defaultValue || "")
  const [selectedLabel, setSelectedLabel] = useState("")

  // Find the label for the selected value
  useEffect(() => {
    React.Children.forEach(children, (child) => {
      if (child.type === SelectContent) {
        React.Children.forEach(child.props.children, (item) => {
          if (item.type === SelectItem && item.props.value === selectedValue) {
            setSelectedLabel(item.props.children)
          }
        })
      }
    })
  }, [children, selectedValue])

  useEffect(() => {
  if (props.value !== undefined && props.value !== selectedValue) {
    setSelectedValue(props.value);
  }
}, [props.value, selectedValue]);


  const handleSelect = (value, label) => {
    setSelectedValue(value)
    setSelectedLabel(label)
    setIsOpen(false)
    if (props.onValueChange) {
      props.onValueChange(value)
    }
  }

  return (
    <div className={`relative ${className}`}>
      {React.Children.map(children, (child) => {
        if (child.type === SelectTrigger) {
          return React.cloneElement(child, {
            onClick: () => setIsOpen(!isOpen),
            isOpen,
            selectedLabel,
          })
        }
        if (child.type === SelectContent) {
          return React.cloneElement(child, {
            isOpen,
            onSelect: handleSelect,
          })
        }
        return child
      })}
    </div>
  )
}

export function SelectTrigger({ children, onClick, isOpen, selectedLabel, className }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex h-10 w-full items-center justify-between rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-sm text-slate-700 shadow-sm placeholder:text-slate-400 focus:outline-none focus:border-sky-400 focus:ring-4 focus:ring-sky-500/10 disabled:cursor-not-allowed disabled:opacity-50 transition-all ${className}`}
    >
      {React.Children.map(children, (child) => {
        if (child.type === SelectValue) {
          return React.cloneElement(child, {
            selectedLabel,
          })
        }
        return child
      })}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={`h-4 w-4 text-slate-400 transition-transform ${isOpen ? "rotate-180" : ""}`}
      >
        <polyline points="6 9 12 15 18 9"></polyline>
      </svg>
    </button>
  )
}

export function SelectValue({ children, selectedLabel }) {
  return <div className="flex items-center">{selectedLabel || children}</div>
}

export function SelectContent({ children, isOpen, onSelect, className }) {
  if (!isOpen) return null

  return (
    <div
      className={`absolute z-50 min-w-[8rem] overflow-hidden rounded-xl border border-slate-200 bg-white text-slate-700 shadow-[0_18px_50px_-18px_rgba(15,23,42,0.35)] animate-in fade-in-80 mt-1 w-full ${className}`}
    >
      <div className="p-1">
        {React.Children.map(children, (child) => {
          if (child.type === SelectItem) {
            return React.cloneElement(child, {
              onSelect,
            })
          }
          return child
        })}
      </div>
    </div>
  )
}

export function SelectItem({ children, value, onSelect, className }) {
  return (
    <div
      onClick={() => onSelect(value, children)}
      className={`relative flex w-full cursor-pointer select-none items-center rounded-lg py-2 px-2.5 text-sm outline-none hover:bg-sky-50 hover:text-sky-700 transition-colors ${className}`}
    >
      {children}
    </div>
  )
}

Select.propTypes = {
  defaultValue: PropTypes.string,
  children: PropTypes.node,
  className: PropTypes.string,
  onValueChange: PropTypes.func,
}

SelectTrigger.propTypes = {
  children: PropTypes.node,
  onClick: PropTypes.func,
  isOpen: PropTypes.bool,
  selectedLabel: PropTypes.node,
  className: PropTypes.string,
}

SelectValue.propTypes = {
  children: PropTypes.node,
  selectedLabel: PropTypes.node,
}

SelectContent.propTypes = {
  children: PropTypes.node,
  isOpen: PropTypes.bool,
  onSelect: PropTypes.func,
  className: PropTypes.string,
}

SelectItem.propTypes = {
  children: PropTypes.node,
  value: PropTypes.string.isRequired,
  onSelect: PropTypes.func,
  className: PropTypes.string,
}
