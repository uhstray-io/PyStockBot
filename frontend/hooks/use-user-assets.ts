import { useState, useEffect } from 'react'
import { UserAsset } from '@/lib/db'

interface UseUserAssetsReturn {
  assets: UserAsset[]
  loading: boolean
  error: string | null
  addAsset: (symbol: string, assetType: 'stock' | 'crypto') => Promise<void>
  removeAsset: (symbol: string) => Promise<void>
  refetch: () => Promise<void>
}

export function useUserAssets(userId: string): UseUserAssetsReturn {
  const [assets, setAssets] = useState<UserAsset[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchAssets = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await fetch(`/api/assets?userId=${encodeURIComponent(userId)}`)
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to fetch assets')
      }
      
      const data = await response.json()
      setAssets(data.assets)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
      console.error('Error fetching assets:', err)
    } finally {
      setLoading(false)
    }
  }

  const addAsset = async (symbol: string, assetType: 'stock' | 'crypto') => {
    try {
      setError(null)
      
      const response = await fetch('/api/assets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, symbol, assetType })
      })
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to add asset')
      }
      
      const data = await response.json()
      setAssets(prev => [data.asset, ...prev])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
      throw err
    }
  }

  const removeAsset = async (symbol: string) => {
    try {
      setError(null)
      
      const response = await fetch(`/api/assets?userId=${encodeURIComponent(userId)}&symbol=${encodeURIComponent(symbol)}`, {
        method: 'DELETE'
      })
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to remove asset')
      }
      
      setAssets(prev => prev.filter(asset => asset.symbol !== symbol))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
      throw err
    }
  }

  useEffect(() => {
    if (userId) {
      fetchAssets()
    }
  }, [userId])

  return {
    assets,
    loading,
    error,
    addAsset,
    removeAsset,
    refetch: fetchAssets
  }
}