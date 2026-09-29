import React from "react";
import Link from "next/link";
import { ShieldCheck, UserCheck, Sparkles, ArrowRight, LayoutGrid, CheckCircle2 } from "lucide-react";

export default function RootLandingPage() {
  return (
    <div className="min-h-screen bg-[#FDFCF8] text-[#2C2C24] flex flex-col items-center justify-center p-6 sm:p-12 relative overflow-hidden">
      {/* Background organic blob accents */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-[#5D7052]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-[#C18C5D]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-4xl w-full space-y-10 z-10 text-center">
        {/* Header Badge & Title */}
        <div className="space-y-4 flex flex-col items-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#E6DCCD]/60 border border-[#DED8CF] text-xs font-semibold text-[#5D7052]">
            <Sparkles className="w-3.5 h-3.5" />
            INFURNUS Admin Platform • Foundation Ready
          </div>
          <h1 className="font-heading text-4xl sm:text-6xl font-extrabold tracking-tight text-[#2C2C24]">
            Organic & Natural <br className="hidden sm:inline" />
            <span className="text-[#5D7052]">Administrative Dashboard</span>
          </h1>
          <p className="text-base sm:text-lg text-[#78786C] max-w-2xl font-sans font-medium">
            Frontend foundation crafted with Fraunces & Nunito typography, organic color tokens (Moss, Terracotta, Sand), and scalable component architecture for Super Admin & Admin panels.
          </p>
        </div>

        {/* Console Portal Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
          {/* Super Admin Portal Card */}
          <Link href="/super-admin" className="group">
            <div className="h-full p-8 rounded-3xl bg-white border border-[#DED8CF] shadow-organic hover:shadow-organic-lg hover:border-[#5D7052] transition-all duration-300 flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-[#5D7052] text-white flex items-center justify-center shadow-moss group-hover:scale-105 transition-transform">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-[#5D7052]">
                    /super-admin
                  </span>
                  <h2 className="font-heading text-2xl font-bold text-[#2C2C24] mt-1">
                    Super Admin Portal
                  </h2>
                  <p className="text-sm text-[#78786C] mt-2 font-sans leading-relaxed">
                    Global multi-tenant system control, security audits, platform settings, and infrastructure management.
                  </p>
                </div>
              </div>
              <div className="flex items-center text-xs font-bold text-[#5D7052] group-hover:translate-x-1 transition-transform">
                Open Super Admin Shell <ArrowRight className="w-4 h-4 ml-1.5" />
              </div>
            </div>
          </Link>

          {/* Admin Panel Card */}
          <Link href="/admin" className="group">
            <div className="h-full p-8 rounded-3xl bg-white border border-[#DED8CF] shadow-organic hover:shadow-organic-lg hover:border-[#C18C5D] transition-all duration-300 flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-[#C18C5D] text-white flex items-center justify-center shadow-terracotta group-hover:scale-105 transition-transform">
                  <UserCheck className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-[#C18C5D]">
                    /admin
                  </span>
                  <h2 className="font-heading text-2xl font-bold text-[#2C2C24] mt-1">
                    Admin Console
                  </h2>
                  <p className="text-sm text-[#78786C] mt-2 font-sans leading-relaxed">
                    Team management, user privileges, activity monitoring, and localized dashboard workflows.
                  </p>
                </div>
              </div>
              <div className="flex items-center text-xs font-bold text-[#C18C5D] group-hover:translate-x-1 transition-transform">
                Open Admin Shell <ArrowRight className="w-4 h-4 ml-1.5" />
              </div>
            </div>
          </Link>
        </div>

        {/* Included Foundation Components Summary */}
        <div className="pt-6 border-t border-[#DED8CF] flex flex-wrap items-center justify-center gap-6 text-xs text-[#78786C] font-semibold">
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-[#5D7052]" /> AppShell & Layouts
          </span>
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-[#5D7052]" /> 17 Organic UI Components
          </span>
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-[#5D7052]" /> Frontend-Only Architecture
          </span>
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-[#5D7052]" /> Fraunces & Nunito Fonts
          </span>
        </div>
      </div>
    </div>
  );
}
