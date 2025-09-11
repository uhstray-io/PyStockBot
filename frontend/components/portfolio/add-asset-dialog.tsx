"use client"

import React, { useState } from 'react'
import { PlusIcon } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useToast } from '@/hooks/use-toast'

interface AddAssetDialogProps {
  onAddAsset: (symbol: string, assetType: 'stock' | 'crypto') => Promise<void>
  trigger?: React.ReactNode
}

export function AddAssetDialog({ onAddAsset, trigger }: AddAssetDialogProps) {
  const [open, setOpen] = useState(false)
  const [symbol, setSymbol] = useState('')
  const [assetType, setAssetType] = useState<'stock' | 'crypto'>('stock')
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!symbol.trim()) {
      toast({
        title: "Error",
        description: "Please enter a symbol",
        variant: "destructive",
      })
      return
    }

    try {
      setLoading(true)
      await onAddAsset(symbol.toUpperCase().trim(), assetType)
      
      toast({
        title: "Success",
        description: `${symbol.toUpperCase()} added to your portfolio`,
      })
      
      setSymbol('')
      setAssetType('stock')
      setOpen(false)
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to add asset",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline" size="sm">
            <PlusIcon className="mr-2 h-4 w-4" />
            Add Asset
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add New Asset</DialogTitle>
          <DialogDescription>
            Add a stock or cryptocurrency to your portfolio
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="symbol">Symbol</Label>
            <Input
              id="symbol"
              placeholder="e.g., AAPL, BTC"
              value={symbol}
              onChange={(e) => setSymbol(e.target.value)}
              className="uppercase"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="asset-type">Asset Type</Label>
            <Select value={assetType} onValueChange={(value: 'stock' | 'crypto') => setAssetType(value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select asset type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="stock">Stock</SelectItem>
                <SelectItem value="crypto">Cryptocurrency</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Adding..." : "Add Asset"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}