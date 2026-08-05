import { SiteHeader } from "./SiteHeader";
import { SiteFooter } from "./SiteFooter";
import { WattsonChat } from "./WattsonChat";
import { ReactNode } from "react";

export const SiteLayout = ({ children }: { children: ReactNode }) => (
  <div className="min-h-screen flex flex-col bg-background">
    <SiteHeader />
    <main className="flex-1">{children}</main>
    <SiteFooter />
    <WattsonChat />
  </div>
);
