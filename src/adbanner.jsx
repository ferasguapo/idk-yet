import { useEffect } from "react"

export default function AdBanner() {
  useEffect(() => {
    // Create the script exactly like Monetag expects
    const script = document.createElement("script")
    script.src = "https://vemtoutcheeg.com/400/9779520"
    script.async = true

    // Append into your ad container
    const container = document.getElementById("banner-container")
    if (container) container.appendChild(script)

    // Cleanup on unmount
    return () => {
      if (container) container.innerHTML = ""
    }
  }, [])

  return (
    <div className="w-full bg-gray-900 text-center py-3 mt-4 border-t border-gray-700">
      <p className="text-gray-400 text-sm">Advertisement</p>
      <div
        id="banner-container"
        className="mx-auto rounded shadow-md min-h-[90px]"
      ></div>
    </div>
  )
}
