import { DatabaseInterface } from './database-interface';
import { CloudflareD1Service } from './cloudflare-d1';
import { FallbackDatabaseService } from './database-fallback';

export function getDatabase(): DatabaseInterface {
  // Check if Cloudflare D1 credentials are configured
  const hasCloudflareCredentials = 
    process.env.CLOUDFLARE_ACCOUNT_ID &&
    process.env.CLOUDFLARE_D1_DATABASE_ID &&
    process.env.CLOUDFLARE_API_TOKEN;

  if (hasCloudflareCredentials) {
    console.log('🗄️ Using Cloudflare D1 database');
    return new CloudflareD1Service();
  } else {
    console.log('⚠️ Cloudflare D1 not configured, using fallback in-memory database');
    return new FallbackDatabaseService();
  }
}
