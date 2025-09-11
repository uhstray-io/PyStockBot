#!/usr/bin/env tsx

import { readFileSync } from 'fs'
import { join } from 'path'
import { pool } from '../lib/db'

async function runMigration() {
  try {
    console.log('🔄 Running database migrations...')
    
    // Read the migration file
    const migrationPath = join(__dirname, '../db/migrations/001_initial_schema.sql')
    const migrationSQL = readFileSync(migrationPath, 'utf-8')
    
    // Execute the migration
    await pool.query(migrationSQL)
    
    console.log('✅ Database migrations completed successfully!')
    
    // Test the connection and schema
    const result = await pool.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_name IN ('user_assets', 'watchlists', 'watchlist_assets')
      ORDER BY table_name
    `)
    
    console.log('📋 Created tables:', result.rows.map(row => row.table_name).join(', '))
    
  } catch (error) {
    console.error('❌ Migration failed:', error)
    process.exit(1)
  } finally {
    await pool.end()
  }
}

// Run migration if called directly
if (require.main === module) {
  runMigration()
}

export { runMigration }