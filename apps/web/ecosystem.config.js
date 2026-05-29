/**
 * PM2 Ecosystem Configuration — HIPS Web (Next.js)
 *
 * Usage:
 *   pm2 start ecosystem.config.js
 *   pm2 reload ecosystem.config.js
 *
 * Firebase Admin credentials are read from the service account JSON file
 * at FIREBASE_ADMIN_SDK_KEY (firebase-admin.ts handles file path resolution).
 */
module.exports = {
  apps: [
    {
      name: 'hips-web',
      script: 'node',
      args: 'node_modules/.bin/next start -p 3000',
      cwd: './apps/web',
      env: {
        NODE_ENV: 'production',
        PORT: 3000,
        // Firebase Admin SDK — path to service account JSON
        FIREBASE_ADMIN_SDK_KEY: '/home/deploy/hips-hsss/firebase-admin.json',
        // Explicit credential env vars (fallback if FIREBASE_ADMIN_SDK_KEY not set)
        FIREBASE_PROJECT_ID: 'hips-hsss',
        FIREBASE_CLIENT_EMAIL: 'firebase-adminsdk-fbsvc@hips-hsss.iam.gserviceaccount.com',
        // Private key — newlines encoded as \n in the JSON file, normalized at runtime
        FIREBASE_PRIVATE_KEY: '-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQCtuiGcM+ARV5BB\nBAy+8U8nW5/9mYZ6Q0n7Wu+mOTwSsSCKP4ZjNoje0oXlLLz4AbUiu3rWpmT9bAew\nnqde/THUTdCc71JT9gqiQPAhcTC3Fxxzurruyko17XolrLZFn0m5p9dIR+7wZyYH\nIqACIyOubc/nYAfjf5OXjdyEsL2EsEwXXhmcbqKjuSyZfoeX4wQ00k9d/hZLfnHi\njkTekgItl6S/KYOyqae7CXOTfJL+x35RjhZYWbYYvsEOBhXijFhjMYKLZXJaERzm\nbkbZoMtfw6xKvZNvAqV38XLmc9TxCvw2O9bX0AHq1Xd3OCSHdU4fDPTIonDxgFS1\n3KBmbWbHAgMBAAECggEAHRyBoVE4DO/lZl+tWxnIr8m0x6RAWqCH9yzH18zjeiZg\nU4pNlLaAvQX+FecnS0/N8KIF9Y4wgh7mMvyDA3HeNbtMZ9/apeMm6QWEt7Xl+ehP\nhj0WMgmH4f2HaGTGrmgAzLGJa71SFsrSHoP42CLXSdVw706yQ7cPHmhROZL8Tw2N\nFKWLhGzu2+MxW6hov9W6zfUqo4ZxXIaQistHkf2PGQM0if3eG47Ptqwzw7Ko6Pe0\nBQMxZTm2Lzhd2dzheszHYod6WO1ie4Mhwt4LnL+ZY8+i3gC029uC0WjoEEE3+l2w\nSlmty6+U8nORpXsBfWHLxymXZM4hH8hMtJzgeFwqEQKBgQDcDujWleDp2MFNKYsS\ntViqHkommGoHJQ0AdVd1OGNjsGDczYXu1B5Br8lSFhIo5wHws6v0QrNomTlEmOxU\n71uyjdW5rbPjM9b/YweTrOKlwBMJwJUtsxBVEMlNADW2HhkirCJUj7e9ywqPslrM\nzhpQQoq/biQcuNeqMscrXIvmgwKBgQDKGgUWCUs1lINKFokyNcuzYD3Ujoobqzk9\nLbgtj/a9qm4VukocsR0P2jTWkjL3jUpy4sMS1Fp2gOhArtkO3MJKMPM8/caNfyTH\nivVZ7BjGwyUsaJmfHMVyveEzuA6nb3Yxj3Y8dQGL68AuGMTAGeEMem5hlpmatyg2\nN1VNwRbrbQKBgD6lW/Giz1mjJDx0RCw6Rhh/8PoVz7FjAdWMki5DtD+v+ZNCSwuX\nhVmL0pM0x0yvnuTIMX6i8nInlJ8LrdPsJD2rlRl78scOfflMVt7ai9dF2+Wd1pog\n7NhapAPwuFm1LdCqEkfidhtozwPjcWf2kJUirF8c2tj2YicIt5yHhyhDAoGBAInt\nniD+8MQ9eii7HqEU09O00B3btefSQHs/U55MzVF+Gilb/S59td7Wxg7Wsk/+rpuf\npRCZuq97pIZYjiy1fyfRJoAuli6FYl2IuY/IMNSd5CXdsVJE+YAolKSObfnZeSmz\nxjbWh9qtZ3hOUSDlyJCSkfiqJmTPsXLm6qHpMLI1AoGAAxTpd4Wy8IgjLeN0CK4M\nc03EcWhqe/dJBqhnWzgs9B8LpeI0iJB3+KzSkMJcDgm1o+PKxyO+8S1Jep2E+C1J\nx2VDBTSrKdujrPFc4Z/DpNsSXY0TGT9mKaRFObaB5af73A5jkb9c5z93o/dx1wJT\nxrFejcl6RhYeGdK9HIcCizA=\n-----END PRIVATE KEY-----',
      },
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      error_file: './logs/hips-web-err.log',
      out_file: './logs/hips-web-out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss',
      merge_logs: true,
    },
  ],
};