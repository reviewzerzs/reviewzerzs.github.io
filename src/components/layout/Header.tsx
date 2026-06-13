import { useAuth } from '../../hooks/useAuth'
import { useSubscription } from '../../hooks/useSubscription'
import { Button } from '../ui/button'

export function Header() {
  const { user, signOut } = useAuth()
  const { getActivePlanName } = useSubscription()
  const activePlan = getActivePlanName()

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-4">
            <h1 className="text-xl font-semibold text-gray-900">
              Review Platform
            </h1>
            {activePlan && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                {activePlan}
              </span>
            )}
          </div>
          
          <div className="flex items-center space-x-4">
            {user && (
              <>
                <span className="text-sm text-gray-700">
                  {user.email}
                </span>
                <Button
                  onClick={() => window.location.href = '/products'}
                  variant="outline"
                  size="sm"
                >
                  Products
                </Button>
                <Button onClick={signOut} variant="outline" size="sm">
                  Sign Out
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}