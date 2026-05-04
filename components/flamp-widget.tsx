"use client"

import { useEffect, useRef } from "react"

interface FlampWidgetProps {
  companyId?: string
  count?: number
  width?: string
}

export function FlampWidget({ companyId = "70000001020667161", count = 3, width = "100%" }: FlampWidgetProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const scriptLoadedRef = useRef(false)

  useEffect(() => {
    if (!companyId || scriptLoadedRef.current) return

    const loadScript = () => {
      const existingScript = document.querySelector('script[src*="widget.flamp.ru"]')
      if (existingScript) {
        scriptLoadedRef.current = true
        return
      }

      const script = document.createElement("script")
      script.src = "//widget.flamp.ru/loader.js"
      script.async = true
      script.onload = () => {
        scriptLoadedRef.current = true
      }

      const firstScript = document.getElementsByTagName("script")[0]
      firstScript.parentNode?.insertBefore(script, firstScript)
    }

    loadScript()
  }, [companyId])

  if (!companyId) {
    return null
  }

  return (
    <div ref={containerRef} className="flamp-widget-container">
      <a
        className="flamp-widget"
        href={`//novosibirsk.flamp.ru/firm/absolyutprofremont_remontno_otdelochnaya_kompaniya-${companyId}`}
        data-flamp-widget-type="responsive-new"
        data-flamp-widget-id={companyId}
        data-flamp-widget-width={width}
        data-flamp-widget-count={count.toString()}
      >
        Отзывы о нас на Флампе
      </a>
    </div>
  )
}
