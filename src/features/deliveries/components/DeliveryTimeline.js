import { deliveryFlow } from "@features/deliveries/schema/deliveryConfig";

export default function DeliveryTimeline({ status }) {
  const activeIndex = deliveryFlow.indexOf(status);

  return (
    <div className="mt-4 grid grid-cols-7 gap-1">
      {deliveryFlow.map((item, index) => (
        <span
          key={item}
          className={`h-2 rounded-full ${index <= activeIndex ? "bg-[#153a20]" : "bg-white"}`}
          title={item.replaceAll("_", " ")}
        />
      ))}
    </div>
  );
}
