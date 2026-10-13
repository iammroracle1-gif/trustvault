export const dynamic = 'force-dynamic';

export default async function TestEnvPage() {
  const envCheck = {
    POSTGRES_URL: !!process.env.POSTGRES_URL,
    POSTGRES_PRISMA_URL: !!process.env.POSTGRES_PRISMA_URL,
    POSTGRES_URL_NON_POOLING: !!process.env.POSTGRES_URL_NON_POOLING,
    DATABASE_URL: !!process.env.DATABASE_URL,
  };

  const preview = process.env.POSTGRES_URL?.substring(0, 40) || 'NOT SET';

  return (
    <div style={{ padding: '20px', fontFamily: 'monospace', backgroundColor: '#000', color: '#0f0', minHeight: '100vh' }}>
      <h1>Environment Variables Check</h1>
      <pre style={{ marginTop: '20px' }}>
        {JSON.stringify(envCheck, null, 2)}
      </pre>
      <h2 style={{ marginTop: '30px' }}>POSTGRES_URL Preview:</h2>
      <p>{preview}</p>
    </div>
  );
}
