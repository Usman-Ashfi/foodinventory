import { deliveryFlow } from './deliveryConfig'

export default function DeliveryTimeline({ status }) {
  const activeIndex = deliveryFlow.indexOf(status)

  return (
    <div className="mt-3 grid grid-cols-7 gap-1">
      {deliveryFlow.map((item, index) => (
        <span key={item} className={`h-1.5 rounded-full ${index <= activeIndex ? 'bg-emerald-500' : 'bg-slate-100'}`} title={item.replaceAll('_', ' ')} />
      ))}
    </div>
  )
}
