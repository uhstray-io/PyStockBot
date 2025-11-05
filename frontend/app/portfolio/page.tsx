"use client"

import React from 'react'
import { PortfolioManager } from '@/components/portfolio/portfolio-manager'

// For demo purposes, we'll use a hardcoded user ID
// In a real application, this would come from authentication
const DEMO_USER_ID = 'demo-user-123'

export default function PortfolioPage() {
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Portfolio Management</h1>
        <p className="text-muted-foreground mt-2">
          Manage your tracked stocks and cryptocurrencies
        </p>
      </div>
      
      <div className="max-w-4xl">
        <PortfolioManager userId={DEMO_USER_ID} />
      </div>
    </div>
  )
}