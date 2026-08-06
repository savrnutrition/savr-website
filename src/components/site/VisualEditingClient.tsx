'use client'
import dynamic from 'next/dynamic'

// Lazy-load the Sanity visual editing overlay so its JS is never downloaded
// by regular visitors — only draft-mode preview sessions trigger the import.
const VisualEditing = dynamic(() =>
  import('next-sanity/visual-editing/client-component').then((m) => m.VisualEditing)
)

export function VisualEditingClient() {
  return <VisualEditing />
}
