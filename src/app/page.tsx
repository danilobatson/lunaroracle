export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm">
        <h1 className="text-4xl font-bold text-center mb-8">
          🔮 LunarOracle API
        </h1>
        <p className="text-center text-gray-600 mb-8">
          AI-powered crypto predictions using social sentiment data
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
          <div className="p-4 border rounded">
            <h3 className="font-bold">📊 Endpoints</h3>
            <ul className="mt-2 space-y-1 text-sm">
              <li>GET /api/health</li>
              <li>GET /api/topic/[symbol]</li>
              <li>POST /api/predict</li>
              <li>POST /api/agent/chat</li>
            </ul>
          </div>
          
          <div className="p-4 border rounded">
            <h3 className="font-bold">🎯 Features</h3>
            <ul className="mt-2 space-y-1 text-sm">
              <li>LLM-powered analysis</li>
              <li>Real LunarCrush data</li>
              <li>Social sentiment tracking</li>
              <li>Galaxy Score analysis</li>
            </ul>
          </div>
        </div>
      </div>
    </main>
  )
}
