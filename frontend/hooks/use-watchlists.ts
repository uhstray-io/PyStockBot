import { useState, useEffect } from 'react'
import { WatchlistItem, WatchlistAsset } from '@/lib/db'

interface UseWatchlistsReturn {
  watchlists: WatchlistItem[]
  loading: boolean
  error: string | null
  createWatchlist: (name: string, description?: string) => Promise<WatchlistItem>
  deleteWatchlist: (watchlistId: number) => Promise<void>
  refetch: () => Promise<void>
}

export function useWatchlists(userId: string): UseWatchlistsReturn {
  const [watchlists, setWatchlists] = useState<WatchlistItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchWatchlists = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await fetch(`/api/watchlists?userId=${encodeURIComponent(userId)}`)
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to fetch watchlists')
      }
      
      const data = await response.json()
      setWatchlists(data.watchlists)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
      console.error('Error fetching watchlists:', err)
    } finally {
      setLoading(false)
    }
  }

  const createWatchlist = async (name: string, description?: string): Promise<WatchlistItem> => {
    try {
      setError(null)
      
      const response = await fetch('/api/watchlists', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, name, description })
      })
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to create watchlist')
      }
      
      const data = await response.json()
      setWatchlists(prev => [data.watchlist, ...prev])
      return data.watchlist
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
      throw err
    }
  }

  const deleteWatchlist = async (watchlistId: number) => {
    try {
      setError(null)
      
      const response = await fetch(`/api/watchlists?userId=${encodeURIComponent(userId)}&watchlistId=${watchlistId}`, {
        method: 'DELETE'
      })
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to delete watchlist')
      }
      
      setWatchlists(prev => prev.filter(watchlist => watchlist.id !== watchlistId))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
      throw err
    }
  }

  useEffect(() => {
    if (userId) {
      fetchWatchlists()
    }
  }, [userId])

  return {
    watchlists,
    loading,
    error,
    createWatchlist,
    deleteWatchlist,
    refetch: fetchWatchlists
  }
}

interface UseWatchlistAssetsReturn {
  assets: WatchlistAsset[]
  loading: boolean
  error: string | null
  addAsset: (symbol: string, assetType: 'stock' | 'crypto') => Promise<void>
  removeAsset: (symbol: string) => Promise<void>
  refetch: () => Promise<void>
}

export function useWatchlistAssets(watchlistId: number): UseWatchlistAssetsReturn {
  const [assets, setAssets] = useState<WatchlistAsset[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchAssets = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await fetch(`/api/watchlists/${watchlistId}/assets`)
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to fetch watchlist assets')
      }
      
      const data = await response.json()
      setAssets(data.assets)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
      console.error('Error fetching watchlist assets:', err)
    } finally {
      setLoading(false)
    }
  }

  const addAsset = async (symbol: string, assetType: 'stock' | 'crypto') => {
    try {
      setError(null)
      
      const response = await fetch(`/api/watchlists/${watchlistId}/assets`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ symbol, assetType })
      })
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to add asset')
      }
      
      const data = await response.json()
      setAssets(prev => [...prev, data.asset].sort((a, b) => a.sort_order - b.sort_order))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
      throw err
    }
  }

  const removeAsset = async (symbol: string) => {
    try {
      setError(null)
      
      const response = await fetch(`/api/watchlists/${watchlistId}/assets?symbol=${encodeURIComponent(symbol)}`, {
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
    if (watchlistId) {
      fetchAssets()
    }
  }, [watchlistId])

  return {
    assets,
    loading,
    error,
    addAsset,
    removeAsset,
    refetch: fetchAssets
  }
}