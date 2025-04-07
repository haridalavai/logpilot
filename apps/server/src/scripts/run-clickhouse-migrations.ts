import { createClient } from '@clickhouse/client';
import * as fs from 'fs';
import * as path from 'path';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config({
  path: path.join(__dirname, '../.env')
});

async function runMigrations() {
  // Get migration directory path
  const migrationDir = path.join(__dirname, '../database/migrations/clickhouse');

  
  // Create ClickHouse client
  const client = createClient({
    host: process.env.CLICKHOUSE_URL || 'http://localhost:8123',
    username: process.env.CLICKHOUSE_USER || 'logpilot',
    password: process.env.CLICKHOUSE_PASSWORD || 'logpilot',
    database: process.env.CLICKHOUSE_DB || 'logpilot',
  });

  try {
    console.log('🔄 Running ClickHouse migrations...');

    // Create migrations table if it doesn't exist
    await client.query({
      query: `
        CREATE TABLE IF NOT EXISTS migrations (
          name String,
          applied_at DateTime DEFAULT now(),
          content_hash String
        ) ENGINE = MergeTree()
        ORDER BY name
      `
    })

    // Get list of applied migrations
    const result = await client.query({
      query: `SELECT name FROM migrations`,
      format: 'JSONEachRow'
    });
    const appliedMigrations = await result.json();
    const appliedMigrationNames = new Set(appliedMigrations.map((m: any) => m.name));

    // Get migration files
    const files = fs.readdirSync(migrationDir)
      .filter(file => file.endsWith('.sql'))
      .sort(); // Ensure files are processed in alphabetical order

    if (files.length === 0) {
      console.log('❔ No migration files found in', migrationDir);
      return;
    }

    // Run pending migrations
    let migrationsApplied = 0;
    for (const file of files) {
      if (!appliedMigrationNames.has(file)) {
        const filePath = path.join(migrationDir, file);
        const content = fs.readFileSync(filePath, 'utf8');
        const contentHash = Buffer.from(content).toString('base64');

        console.log(`🔼 Applying migration: ${file}`);
        
        try {
          // Execute migration
          await client.query({
            query: content,
          });
          
          // Record migration
          await client.insert({
            table: 'migrations',
            values: [{ 
              name: file,
              content_hash: contentHash 
            }],
            format: 'JSONEachRow'
          });
          
          console.log(`✅ Successfully applied: ${file}`);
          migrationsApplied++;
        } catch (error) {
          console.error(`❌ Error applying migration ${file}:`, error);
          throw error; // Re-throw to stop the migration process
        }
      } else {
        console.log(`⏭️ Migration already applied: ${file}`);
      }
    }

    if (migrationsApplied === 0) {
      console.log('✓ All migrations already applied');
    } else {
      console.log(`✅ Applied ${migrationsApplied} migrations successfully`);
    }

  } catch (error) {
    console.error('Failed to run migrations:', error);
    process.exit(1);
  } finally {
    await client.close();
  }
}

// Run migrations when called directly
if (require.main === module) {
  runMigrations()
    .then(() => {
      console.log('Migration script completed');
      process.exit(0);
    })
    .catch(err => {
      console.error('Migration script failed:', err);
      process.exit(1);
    });
}

// Export for programmatic usage
export { runMigrations };
