import React from "react";
import { notFound } from "next/navigation";
import { MASTER_NAVIGATION_CONFIG } from "@/config/navigation";
import { PageHeader, Card, CardHeader, CardTitle, CardDescription, CardContent, EmptyState, Button, Badge } from "@/components";
import { Sparkles, ArrowLeft, RefreshCw } from "lucide-react";
import Link from "next/link";

interface PageProps {
  params: Promise<{
    role: string;
    slug: string[];
  }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { role, slug } = await params;
  const path = slug.join("/");
  const navItem = MASTER_NAVIGATION_CONFIG.find((item) => item.path === path);
  const title = navItem ? navItem.title : "Module";
  return {
    title: `INFURNUS | ${title} (${role.toUpperCase()})`,
  };
}

export default async function GenericModulePlaceholderPage({ params }: PageProps) {
  const { role, slug } = await params;

  if (role !== "super-admin" && role !== "admin") {
    notFound();
  }

  const path = slug.join("/");
  const navItem = MASTER_NAVIGATION_CONFIG.find((item) => item.path === path);

  const title = navItem ? navItem.title : slug[slug.length - 1].replace(/-/g, " ").toUpperCase();
  const section = navItem?.section || "Module";
  const permission = navItem?.requiredPermission || "FULL_ACCESS";

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Page Header & Breadcrumbs */}
      <PageHeader
        title={title}
        description={`Frontend module foundation for ${title.toLowerCase()} within the INFURNUS administrative shell.`}
        breadcrumbs={[
          { label: role === "super-admin" ? "Super Admin" : "Admin", href: `/${role}` },
          { label: section },
          { label: title },
        ]}
        actions={
          <div className="flex items-center gap-3">
            <Badge variant={role === "super-admin" ? "moss" : "terracotta"}>
              {role === "super-admin" ? "Global Scope" : "Permission Scoped"}
            </Badge>
            <Link href={`/${role}`}>
              <Button variant="outline" size="sm" icon={<ArrowLeft className="w-3.5 h-3.5" />}>
                Back to Dashboard
              </Button>
            </Link>
          </div>
        }
      />

      {/* Module Placeholder Card */}
      <Card variant="elevated" rounded="3xl">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>{title} Module Shell</CardTitle>
              <CardDescription>
                Section: <span className="font-semibold text-[#5D7052]">{section}</span> | Required Permission: <span className="font-mono text-[#C18C5D]">{permission}</span>
              </CardDescription>
            </div>
            <Button variant="ghost" size="sm" icon={<RefreshCw className="w-3.5 h-3.5" />}>
              Refresh State
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <EmptyState
            title={`${title} Module Under Construction`}
            description={`The frontend application shell for ${title} is ready. Data models, tables, and workflows can now be integrated into this layout.`}
            icon={<Sparkles className="w-10 h-10 text-[#C18C5D]" />}
            action={
              <Button variant="secondary" icon={<Sparkles className="w-4 h-4" />}>
                Configure {title}
              </Button>
            }
          />
        </CardContent>
      </Card>
    </div>
  );
}
