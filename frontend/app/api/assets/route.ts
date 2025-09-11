import { NextRequest, NextResponse } from 'next/server'
import { getUserAssets, addUserAsset, removeUserAsset } from '@/lib/db'

// GET /api/assets - Get user's assets
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      )
    }

    const assets = await getUserAssets(userId)
    return NextResponse.json({ assets })

  } catch (error) {
    console.error('Error fetching user assets:', error)
    return NextResponse.json(
      { error: 'Failed to fetch assets' },
      { status: 500 }
    )
  }
}

// POST /api/assets - Add a new asset
export async function POST(request: NextRequest) {
  try {
    const { userId, symbol, assetType } = await request.json()

    if (!userId || !symbol || !assetType) {
      return NextResponse.json(
        { error: 'User ID, symbol, and asset type are required' },
        { status: 400 }
      )
    }

    if (!['stock', 'crypto'].includes(assetType)) {
      return NextResponse.json(
        { error: 'Asset type must be either "stock" or "crypto"' },
        { status: 400 }
      )
    }

    const asset = await addUserAsset(userId, symbol.toUpperCase(), assetType)
    return NextResponse.json({ asset }, { status: 201 })

  } catch (error: any) {
    console.error('Error adding asset:', error)
    
    // Handle unique constraint violation
    if (error.code === '23505') {
      return NextResponse.json(
        { error: 'Asset already exists in your portfolio' },
        { status: 409 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to add asset' },
      { status: 500 }
    )
  }
}

// DELETE /api/assets - Remove an asset
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    const symbol = searchParams.get('symbol')

    if (!userId || !symbol) {
      return NextResponse.json(
        { error: 'User ID and symbol are required' },
        { status: 400 }
      )
    }

    const success = await removeUserAsset(userId, symbol.toUpperCase())
    
    if (!success) {
      return NextResponse.json(
        { error: 'Asset not found or already removed' },
        { status: 404 }
      )
    }

    return NextResponse.json({ success: true })

  } catch (error) {
    console.error('Error removing asset:', error)
    return NextResponse.json(
      { error: 'Failed to remove asset' },
      { status: 500 }
    )
  }
}