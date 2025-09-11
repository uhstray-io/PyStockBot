import { NextRequest, NextResponse } from 'next/server'
import { getUserWatchlists, createWatchlist, deleteWatchlist } from '@/lib/db'

// GET /api/watchlists - Get user's watchlists
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

    const watchlists = await getUserWatchlists(userId)
    return NextResponse.json({ watchlists })

  } catch (error) {
    console.error('Error fetching watchlists:', error)
    return NextResponse.json(
      { error: 'Failed to fetch watchlists' },
      { status: 500 }
    )
  }
}

// POST /api/watchlists - Create a new watchlist
export async function POST(request: NextRequest) {
  try {
    const { userId, name, description } = await request.json()

    if (!userId || !name) {
      return NextResponse.json(
        { error: 'User ID and name are required' },
        { status: 400 }
      )
    }

    const watchlist = await createWatchlist(userId, name, description)
    return NextResponse.json({ watchlist }, { status: 201 })

  } catch (error: any) {
    console.error('Error creating watchlist:', error)
    
    // Handle unique constraint violation
    if (error.code === '23505') {
      return NextResponse.json(
        { error: 'A watchlist with this name already exists' },
        { status: 409 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to create watchlist' },
      { status: 500 }
    )
  }
}

// DELETE /api/watchlists - Delete a watchlist
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    const watchlistId = searchParams.get('watchlistId')

    if (!userId || !watchlistId) {
      return NextResponse.json(
        { error: 'User ID and watchlist ID are required' },
        { status: 400 }
      )
    }

    const success = await deleteWatchlist(parseInt(watchlistId), userId)
    
    if (!success) {
      return NextResponse.json(
        { error: 'Watchlist not found or access denied' },
        { status: 404 }
      )
    }

    return NextResponse.json({ success: true })

  } catch (error) {
    console.error('Error deleting watchlist:', error)
    return NextResponse.json(
      { error: 'Failed to delete watchlist' },
      { status: 500 }
    )
  }
}