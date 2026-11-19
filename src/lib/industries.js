export const INDUSTRIES = [
  { value: "healthcare", label: "Healthcare & Medical", icon: "🏥" },
  { value: "mental_health", label: "Mental Health & Therapy", icon: "🧠" },
  { value: "senior_care", label: "Aged & Disability Care", icon: "🧓" },
  { value: "fitness", label: "Fitness & Wellness", icon: "🧘" },
  { value: "fintech", label: "FinTech & Banking", icon: "💰" },
  { value: "investing", label: "Investing & Wealth", icon: "📈" },
  { value: "insurance", label: "Insurance", icon: "🛡️" },
  { value: "accounting", label: "Accounting & Tax", icon: "🧾" },
  { value: "education", label: "Education & Learning", icon: "📚" },
  { value: "ecommerce", label: "E-commerce & Retail", icon: "🛒" },
  { value: "marketplace", label: "Marketplaces & Classifieds", icon: "🏪" },
  { value: "food_delivery", label: "Food & Delivery", icon: "🍔" },
  { value: "restaurants", label: "Restaurants & Cafés", icon: "🍽️" },
  { value: "travel", label: "Travel & Hospitality", icon: "✈️" },
  { value: "events", label: "Events & Ticketing", icon: "🎟️" },
  { value: "productivity", label: "Productivity & Tools", icon: "💼" },
  { value: "b2b_saas", label: "B2B SaaS & Operations", icon: "🏢" },
  { value: "sales_crm", label: "Sales & CRM", icon: "🤝" },
  { value: "marketing", label: "Marketing & Advertising", icon: "📣" },
  { value: "customer_support", label: "Customer Support", icon: "💬" },
  { value: "hr_recruiting", label: "HR & Recruiting", icon: "👥" },
  { value: "legal", label: "Legal & Compliance", icon: "⚖️" },
  { value: "real_estate", label: "Real Estate & Property", icon: "🏠" },
  { value: "construction", label: "Construction & Trades", icon: "🏗️" },
  { value: "home_services", label: "Home Services", icon: "🔧" },
  { value: "logistics", label: "Logistics & Supply Chain", icon: "🚚" },
  { value: "automotive", label: "Automotive & Transport", icon: "🚗" },
  { value: "manufacturing", label: "Manufacturing", icon: "🏭" },
  { value: "agriculture", label: "Agriculture & Farming", icon: "🌾" },
  { value: "energy", label: "Energy & Sustainability", icon: "🔋" },
  { value: "government", label: "Government & Public Sector", icon: "🏛️" },
  { value: "nonprofit", label: "Nonprofit & Community", icon: "❤️" },
  { value: "cybersecurity", label: "Cybersecurity", icon: "🔐" },
  { value: "developer_tools", label: "Developer Tools", icon: "🛠️" },
  { value: "ai_data", label: "AI & Data Analytics", icon: "🤖" },
  { value: "telecom", label: "Telecom & Connectivity", icon: "📡" },
  { value: "gaming", label: "Gaming & Interactive", icon: "🎮" },
  { value: "entertainment", label: "Entertainment & Media", icon: "🎬" },
  { value: "music", label: "Music & Audio", icon: "🎧" },
  { value: "creator_economy", label: "Creator Economy", icon: "🎨" },
  { value: "social_media", label: "Social & Communication", icon: "📱" },
  { value: "sports", label: "Sports & Recreation", icon: "⚽" },
  { value: "pets", label: "Pet Care & Services", icon: "🐾" },
  { value: "parenting", label: "Parenting & Family", icon: "👶" },
  { value: "fashion", label: "Fashion & Apparel", icon: "👗" },
  { value: "beauty", label: "Beauty & Personal Care", icon: "💅" },
  { value: "food_beverage", label: "Food & Beverage Products", icon: "🥗" },
  { value: "other", label: "Other Industry", icon: "✨" }
];

export function findIndustry(value) {
  if (!value) return null;
  const needle = String(value).toLowerCase();
  return (
    INDUSTRIES.find((i) => i.value === needle) ||
    INDUSTRIES.find((i) => i.label.toLowerCase() === needle) ||
    INDUSTRIES.find((i) => i.label.toLowerCase().includes(needle)) ||
    null
  );
}