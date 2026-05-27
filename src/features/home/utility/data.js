import {
  BarChart3,
  Boxes,
  PackageCheck,
  Truck,
  Users,
  Utensils,
} from "lucide-react";

export const modules = [
  ["Inventory", "Live stock levels, batches, expiry dates, and low-stock alerts.", Boxes],
  ["Sales Reports", "Track revenue, top items, waste, margins, and daily performance.", BarChart3],
  ["Customers", "Manage customer profiles, order history, and repeat demand.", Users],
  ["Deliveries", "Plan routes, dispatch orders, and monitor fulfillment progress.", Truck],
];

export const steps = [
  ["Receive stock", "Log batches, quantities, suppliers, and expiry windows.", PackageCheck],
  ["Serve demand", "Convert stock into sales while users work with clear roles.", Utensils],
  ["Dispatch orders", "Move packed orders into delivery with reliable status updates.", Truck],
];

export const insights = [
  ["Waste risk", "Low", "bg-[#e0f4c6]"],
  ["Revenue", "$18.4k", "bg-white"],
  ["Top seller", "Veg boxes", "bg-white"],
  ["Pending", "16 orders", "bg-[#f7f0c9]"],
];

export const roles = [
  ["Admin", "Full system control"],
  ["Manager", "Stock, sales, and reports"],
  ["Dispatcher", "Delivery status only"],
  ["Cashier", "Orders and customer lookup"],
];

export const products = [
  ["Avocado", "Batch A-18", "Fresh"],
  ["Broccoli", "Exp 3 days", "Watch"],
  ["Honey jar", "36 units", "Stable"],
  ["Tomatoes", "Restock soon", "Low"],
];

export const reportItems = ["Fresh stock", "Customer orders", "Sales trends", "User roles"];
