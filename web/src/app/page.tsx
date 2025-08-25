"use client";

import { useState, useEffect, FormEvent } from "react";

// 定义 Link 对象的数据类型，确保类型安全
interface Link {
  id: number;
  title: string;
  url: string;
  clicks: number;
}

export default function Home() {
  const [links, setLinks] = useState<Link[]>([]);
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

  // 从后端获取链接列表的函数
  const fetchLinks = async () => {
    try {
      const res = await fetch(`${apiUrl}/api/links`);
      if (!res.ok) throw new Error("Failed to fetch links");
      const data: Link[] = await res.json();
      setLinks(data);
    } catch (error) {
      console.error(error);
    }
  };

  // 在页面首次加载时获取链接列表
  useEffect(() => {
    fetchLinks();
  }, []);

  // 处理表单提交，创建新链接
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    await fetch(`${apiUrl}/api/links`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, url }),
    });
    setTitle("");
    setUrl("");
    fetchLinks(); // 操作完成后，重新获取链接列表以刷新界面
  };

  // 处理链接点击事件，记录点击次数
  const handleLinkClick = async (linkId: number) => {
    try {
      // 等待后端更新完成
      await fetch(`${apiUrl}/api/links/${linkId}/click`, { method: "POST" });
      // 【核心修正】在后端更新成功后，立即调用 fetchLinks() 来同步前端的 state
      await fetchLinks();
    } catch (error) {
      console.error("Failed to record click:", error);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center p-12 bg-gray-900 text-white">
      <h1 className="text-4xl font-bold mb-8">Link-in-Bio Project</h1>

      {/* 创建链接的表单 */}
      <form
        onSubmit={handleSubmit}
        className="mb-8 p-6 bg-gray-800 rounded-lg w-full max-w-md"
      >
        <h2 className="text-2xl mb-4">Add a New Link</h2>
        <div className="flex flex-col gap-4">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Title"
            required
            className="p-2 rounded bg-gray-700 text-white"
          />
          <input
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="URL"
            required
            className="p-2 rounded bg-gray-700 text-white"
          />
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 p-2 rounded"
          >
            Add Link
          </button>
        </div>
      </form>

      {/* 显示链接的列表 */}
      <div className="w-full max-w-md bg-gray-800 rounded-lg p-6">
        <h2 className="text-2xl mb-4">Your Links</h2>
        <ul className="space-y-2">
          {links.map((link) => (
            <li
              key={link.id}
              className="flex justify-between items-center bg-gray-700 p-3 rounded hover:bg-gray-600 transition-colors"
            >
              <a
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                onClick={async (e) => {
                  // 1. 阻止链接的默认立即跳转行为
                  e.preventDefault();
                  // 2. 等待我们的点击记录和前端状态刷新全部完成
                  await handleLinkClick(link.id);
                  // 3. 手动在新标签页中打开链接
                  window.open(link.url, "_blank");
                }}
                className="flex-grow font-medium"
              >
                {link.title}
              </a>
              <span className="ml-4 px-2 py-1 text-xs bg-gray-600 rounded-full">
                Clicks: {link.clicks}
              </span>
            </li>
          ))}
          {links.length === 0 && (
            <p className="text-gray-400">No links added yet.</p>
          )}
        </ul>
      </div>
    </main>
  );
}
