"use client";

import ChatBox from "@/components/chat-box";

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="h-full">
      {children}
      <ChatBox />
    </div>
  );
};

export default RootLayout;
