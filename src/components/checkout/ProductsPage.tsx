import { stripeProducts } from '../../stripe-config'
import { ProductCard } from './ProductCard'
import { useSubscription } from '../../hooks/useSubscription'

export function ProductsPage() {
  const { getActivePlanName } = useSubscription()
  const activePlan = getActivePlanName()

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Our Products
          </h1>
          <p className="text-xl text-gray-600">
            Choose the perfect solution for your needs
          </p>
          {activePlan && (
            <div className="mt-4 inline-flex items-center px-4 py-2 rounded-full bg-green-100 text-green-800">
              <span className="text-sm font-medium">
                Active Plan: {activePlan}
              </span>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center">
          {stripeProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </div>
  )
}