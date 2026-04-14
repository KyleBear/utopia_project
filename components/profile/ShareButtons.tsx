"use client";

import { useState } from "react";
import { Link2, Check, MessageCircle, Linkedin } from "lucide-react";

type Props = { url: string; name: string };

export function ShareButtons({ url, name }: Props) {
  const [copied, setCopied] = useState(false);

  function copyUrl() {
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  function shareKakao() {
    const kakaoUrl = `https://story.kakao.com/share?url=${encodeURIComponent(url)}`;
    window.open(kakaoUrl, "_blank", "noopener,noreferrer,width=600,height=400");
  }

  function shareLinkedIn() {
    const linkedInUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
    window.open(linkedInUrl, "_blank", "noopener,noreferrer,width=600,height=600");
  }

  return (
    <div className="flex items-center gap-2">
      <span className="text-xs text-slate-400 dark:text-slate-500 mr-1">프로필 공유</span>

      <button
        onClick={copyUrl}
        className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
        title="URL 복사"
      >
        {copied ? (
          <><Check size={13} className="text-green-500" />복사됨</>
        ) : (
          <><Link2 size={13} />URL 복사</>
        )}
      </button>

      <button
        onClick={shareKakao}
        className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg bg-yellow-400/10 text-yellow-600 dark:text-yellow-400 hover:bg-yellow-400/20 transition-colors"
        title="카카오스토리로 공유"
      >
        <MessageCircle size={13} />
        카톡
      </button>

      <button
        onClick={shareLinkedIn}
        className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 hover:bg-blue-500/20 transition-colors"
        title="LinkedIn으로 공유"
      >
        <Linkedin size={13} />
        LinkedIn
      </button>
    </div>
  );
}
