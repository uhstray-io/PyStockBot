"use client"

import React from 'react'
import { TrashIcon, TrendingUpIcon, TrendingDownIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { useToast } from '@/hooks/use-toast'
import { useUserAssets } from '@/hooks/use-user-assets'
import { AddAssetDialog } from './add-asset-dialog'

interface PortfolioManagerProps {
  userId: string
}

export function PortfolioManager({ userId }: PortfolioManagerProps) {
  const { assets, loading, error, addAsset, removeAsset } = useUserAssets(userId)
  const { toast } = useToast()

  const handleRemoveAsset = async (symbol: string) => {
    try {
      await removeAsset(symbol)
      toast({
        title: "Success",
        description: `${symbol} removed from your portfolio`,
      })
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to remove asset",
        variant: "destructive",
      })
    }
  }

  if (error) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center text-destructive">
            <p>Error loading portfolio: {error}</p>
            <Button variant="outline" className="mt-2" onClick={() => window.location.reload()}>
              Retry
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl font-semibold">My Portfolio</CardTitle>
          <AddAssetDialog onAddAsset={addAsset} />
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="space-y-2">
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-3 w-24" />
                </div>
                <div className="flex items-center space-x-2">
                  <Skeleton className="h-6 w-16" />
                  <Skeleton className="h-8 w-8" />
                </div>
              </div>
            ))}
          </div>
        ) : assets.length === 0 ? (
          <div className="text-center py-8">
            <TrendingUpIcon className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">No assets yet</h3>
            <p className="text-muted-foreground mb-4">
              Start building your portfolio by adding your first asset
            </p>
            <AddAssetDialog onAddAsset={addAsset} />
          </div>
        ) : (
          <div className="space-y-3">
            {assets.map((asset) => (
              <div
                key={asset.id}
                className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10">
                    {asset.asset_type === 'stock' ? (
                      <TrendingUpIcon className="h-4 w-4 text-primary" />
                    ) : (
                      <TrendingDownIcon className="h-4 w-4 text-orange-500" />
                    )}
                  </div>
                  <div>
                    <p className="font-medium">{asset.symbol}</p>
                    <p className="text-sm text-muted-foreground">
                      Added {new Date(asset.added_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant={asset.asset_type === 'stock' ? 'default' : 'secondary'}>
                    {asset.asset_type}
                  </Badge>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleRemoveAsset(asset.symbol)}
                    className="h-8 w-8 text-muted-foreground hover:text-destructive"
                  >
                    <TrashIcon className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}