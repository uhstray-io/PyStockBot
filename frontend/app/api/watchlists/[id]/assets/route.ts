import { NextRequest, NextResponse } from 'next/server'
import { getWatchlistAssets, addAssetToWatchlist, removeAssetFromWatchlist } from '@/lib/db'

interface RouteParams {
  params: { id: string }
}

// GET /api/watchlists/[id]/assets - Get assets in a watchlist
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const watchlistId = parseInt(params.id)

    if (isNaN(watchlistId)) {
      return NextResponse.json(
        { error: 'Invalid watchlist ID' },
        { status: 400 }
      )
    }

    const assets = await getWatchlistAssets(watchlistId)
    return NextResponse.json({ assets })

  } catch (error) {
    console.error('Error fetching watchlist assets:', error)
    return NextResponse.json(
      { error: 'Failed to fetch watchlist assets' },
      { status: 500 }
    )
  }
}

// POST /api/watchlists/[id]/assets - Add asset to watchlist
export async function POST(request: NextRequest, { params }: RouteParams) {
  try {
    const watchlistId = parseInt(params.id)
    const { symbol, assetType } = await request.json()

    if (isNaN(watchlistId)) {
      return NextResponse.json(
        { error: 'Invalid watchlist ID' },
        { status: 400 }
      )
    }

    if (!symbol || !assetType) {
      return NextResponse.json(
        { error: 'Symbol and asset type are required' },
        { status: 400 }
      )
    }

    if (!['stock', 'crypto'].includes(assetType)) {
      return NextResponse.json(
        { error: 'Asset type must be either "stock" or "crypto"' },
        { status: 400 }
      )
    }

    const asset = await addAssetToWatchlist(watchlistId, symbol.toUpperCase(), assetType)
    return NextResponse.json({ asset }, { status: 201 })

  } catch (error: any) {
    console.error('Error adding asset to watchlist:', error)
    
    // Handle unique constraint violation
    if (error.code === '23505') {
      return NextResponse.json(
        { error: 'Asset already exists in this watchlist' },
        { status: 409 }
      )
    }

    // Handle foreign key constraint violation
    if (error.code === '23503') {
      return NextResponse.json(
        { error: 'Watchlist not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to add asset to watchlist' },
      { status: 500 }
    )
  }
}

// DELETE /api/watchlists/[id]/assets - Remove asset from watchlist
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const watchlistId = parseInt(params.id)
    const { searchParams } = new URL(request.url)
    const symbol = searchParams.get('symbol')

    if (isNaN(watchlistId)) {
      return NextResponse.json(
        { error: 'Invalid watchlist ID' },
        { status: 400 }
      )
    }

    if (!symbol) {
      return NextResponse.json(
        { error: 'Symbol is required' },
        { status: 400 }
      )
    }

    const success = await removeAssetFromWatchlist(watchlistId, symbol.toUpperCase())
    
    if (!success) {
      return NextResponse.json(
        { error: 'Asset not found in watchlist' },
        { status: 404 }
      )
    }

    return NextResponse.json({ success: true })

  } catch (error) {
    console.error('Error removing asset from watchlist:', error)
    return NextResponse.json(
      { error: 'Failed to remove asset from watchlist' },
      { status: 500 }
    )
  }
}