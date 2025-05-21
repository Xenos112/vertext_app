"use client"

import { GoArrowLeft } from "react-icons/go"

type ReturnButtonProps = {
  label: string
  description?: string
}

export default function ReturnButton({ label, description }: ReturnButtonProps) {
  const returnHandler = () => {
    window.history.back()
  }

  return (
    <button
      onClick={returnHandler}
      className="group flex items-center gap-2.5 px-4 transition-all duration-200 rounded-lg"
    >
      <GoArrowLeft size={20} className="text-gray-300 group-hover:text-white transition-colors" />
      <div className="flex flex-col items-start">
        <span className="text-white">{label}</span>
        {description && (
          <span className="text-muted-foreground text-xs">{description}</span>
        )}
      </div>
    </button>
  )
}
