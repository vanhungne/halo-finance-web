import { Card, CardContent } from "../../components/ui/card"
import { useEffect, useState } from "react"
import { Check } from "lucide-react"
import FullPageLoader from "../../components/common/FullPageLoader";
import { getSubscriptionApi } from "../../services/subscription"

function PackagePage() {
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
      try {
        const data = await getSubscriptionApi();
        setLoading(false);
        setSubscriptions(data.items);
      } catch (error) {
        console.error("API failed:", error);
      }
    };

  useEffect(() => {
    setLoading(true);
    fetchData();
  }, []);

  const formatPrice = (price) => {
    return price === 0
      ? "Miễn phí"
      : price.toLocaleString("vi-VN") + "đ / tháng"
  }

  return (
    <div className="lg:space-y-8 lg:p-6 space-y-4 p-3 sm:space-y-6 sm:p-4 bg-slate-50 min-h-screen">
      {loading ? <FullPageLoader /> : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-3 gap-6">
            {subscriptions?.map((item) => {
              const isPremium = item.name === "Premium"
              const isBasic = item.name === "Basic"

              return (
                <Card
                  key={item.id}
                  className={`border rounded-xl transition-all hover:shadow-lg
                ${isPremium ? "border-violet-400 shadow-md" : ""}
                ${!isPremium && isBasic ? "border-amber-400 shadow-md" : ""}
                ${!isPremium && !isBasic ? "border-slate-400 shadow-md" : ""}
              `}
                >
                  <CardContent className="p-6 flex flex-col h-full">

                    {/* Title */}
                    <h2 className={`text-xl font-semibold mb-2
                  ${isPremium ? "text-violet-600" : ""}
                  ${!isPremium && isBasic ? "text-amber-700" : ""}
                  ${!isPremium && !isBasic ? "text-slate-700" : ""}
                `}>
                      {item.name}
                    </h2>

                    {/* Price */}
                    <p className="text-2xl font-bold mb-4 text-slate-900">
                      {formatPrice(item.price)}
                    </p>

                    {/* Features */}
                    <ul className="space-y-2 text-sm text-slate-600 flex-1">
                      {item.features.map((line, index) => (
                        <li key={index} className="flex gap-2">
                          <Check size={16} className="text-green-600 min-w-[16px]" />
                          <span>{line.replace(/^- /, "").trim()}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </>
      )}
    </div>
  );
}

export default PackagePage;