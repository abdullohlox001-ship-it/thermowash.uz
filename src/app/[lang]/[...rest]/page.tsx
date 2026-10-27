import { notFound } from "next/navigation";

/** /uz/har-qanday-noto'g'ri-manzil -> til bo'yicha 404 sahifa */
export default function CatchAll() {
  notFound();
}
