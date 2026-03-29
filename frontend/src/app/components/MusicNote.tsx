import type React from "react"

interface MusicNoteProps {
  style?: React.CSSProperties
  className?: string
}

const MusicNote: React.FC<MusicNoteProps> = ({ style, className }) => {
  return (
    <div className={`relative ${className}`} style={style}>
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
        <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" />
      </svg>
    </div>
  )
}

export default MusicNote

