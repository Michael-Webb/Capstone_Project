'use client'
 
import { useReportWebVitals } from 'next/web-vitals'
 
export function WebVitals() {
  let globalmetric 
  useReportWebVitals((metric) => {
    globalmetric = metric
    console.log(metric)
  })
return (
    <>
    {globalmetric}
        </>
)
}