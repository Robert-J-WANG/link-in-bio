// 说明: 这个页面会在加载时，自动尝试调用我们后端 API 的 /api/health 接口，并把返回的状态显示出来。这是验证前后端在 Docker 网络中能否正常通信的关键一步。

"use client";

import { useState, useEffect } from "react";

export default function Home() {
  const [apiStatus, setApiStatus] = useState("Checking...");

  useEffect(() => {
    // 从环境变量中获取 API 地址
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

    fetch(`${apiUrl}/api/health`)
      .then((res) => res.json())
      .then((data) => {
        setApiStatus(`✅ ${data.message}`);
      })
      .catch(() => {
        setApiStatus("❌ Could not connect to API");
      });
  }, []);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">Link-in-Bio Project</h1>
        <p className="text-lg">Welcome to our live, deployed application!</p>
        <div className="mt-8 p-4 border rounded-lg">
          <p>
            Backend API Status: <strong>{apiStatus}</strong>
          </p>
        </div>
      </div>
    </main>
  );
}
