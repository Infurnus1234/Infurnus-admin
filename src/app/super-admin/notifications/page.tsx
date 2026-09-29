"use client";

import React, { useState } from "react";
import {
  NotificationRecord,
  NotificationTargetType,
  NotificationDeliveryType,
  MOCK_NOTIFICATIONS,
} from "@/lib/couponNotificationData";
import {
  PageHeader,
  Button,
  Badge,
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  DataTable,
  Modal,
  Input,
  Select,
} from "@/components";
import { Column } from "@/types";
import {
  Bell,
  Send,
  Eye,
  Clock,
  Smartphone,
  CheckCircle2,
  Users,
  Radio,
  Sliders,
} from "lucide-react";

const TARGET_TYPES: NotificationTargetType[] = [
  "Individual Users",
  "Multiple Users",
  "All Users",
  "Individual Drivers",
  "Multiple Drivers",
  "All Drivers",
  "Admins",
  "Partners",
  "Fleets",
  "State",
  "District",
  "City",
  "Operational Group",
];

const NOTIFICATION_TYPES: NotificationDeliveryType[] = [
  "Immediate",
  "Scheduled",
  "Broadcast",
  "Targeted",
  "Transactional",
  "Operational",
];

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<NotificationRecord[]>(MOCK_NOTIFICATIONS);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);

  // Form Composer State
  const [title, setTitle] = useState("Peak Surge In Berlin");
  const [body, setBody] = useState("Earn 1.5x bonus dispatches in Berlin Mitte between 18:00-22:00!");
  const [channel, setChannel] = useState<"Push Notification" | "In-App" | "SMS">("Push Notification");
  const [targetType, setTargetType] = useState<NotificationTargetType>("All Drivers");
  const [targetDetails, setTargetDetails] = useState("Berlin Zone Drivers");
  const [deliveryType, setDeliveryType] = useState<NotificationDeliveryType>("Broadcast");
  const [scheduledTime, setScheduledTime] = useState("2026-09-30 18:00");

  const handleSendNotification = () => {
    const newNotif: NotificationRecord = {
      id: `NOTIF-${Date.now().toString().slice(-3)}`,
      title,
      body,
      targetType,
      targetDetails,
      type: deliveryType,
      channel,
      scheduledTime: deliveryType === "Scheduled" ? scheduledTime : undefined,
      sentAt: new Date().toISOString().slice(0, 16).replace("T", " "),
      recipientCount: targetType.includes("All") ? 8940 : 142,
      status: deliveryType === "Scheduled" ? "Scheduled" : "Sent",
    };

    setNotifications((prev) => [newNotif, ...prev]);
    setIsPreviewModalOpen(false);
  };

  const columns: Column<NotificationRecord>[] = [
    {
      key: "title",
      header: "Title & Message",
      render: (n) => (
        <div>
          <p className="font-bold text-xs text-[#2C2C24]">{n.title}</p>
          <p className="text-[11px] text-[#78786C] line-clamp-1">{n.body}</p>
        </div>
      ),
    },
    {
      key: "channel",
      header: "Channel",
      render: (n) => <Badge variant="sand" size="sm">{n.channel}</Badge>,
    },
    {
      key: "targetType",
      header: "Target Audience",
      render: (n) => (
        <div>
          <span className="font-bold text-xs text-[#5D7052]">{n.targetType}</span>
          <p className="text-[10px] text-[#78786C]">{n.targetDetails}</p>
        </div>
      ),
    },
    {
      key: "type",
      header: "Notification Type",
      render: (n) => <Badge variant="terracotta" size="sm">{n.type}</Badge>,
    },
    {
      key: "recipientCount",
      header: "Recipients",
      render: (n) => <span className="font-mono text-xs font-bold text-[#2C2C24]">{n.recipientCount.toLocaleString()}</span>,
    },
    {
      key: "sentAt",
      header: "Sent At",
      render: (n) => <span className="text-xs text-[#78786C]">{n.sentAt}</span>,
    },
    {
      key: "status",
      header: "Status",
      render: (n) => (
        <Badge variant={n.status === "Sent" ? "moss" : "terracotta"} dot size="sm">
          {n.status}
        </Badge>
      ),
    },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-300 pb-12">
      <PageHeader
        title="Notification Composer & Dispatcher"
        description="Broadcast push notifications, in-app alerts, and operational messages across granular target audiences."
        breadcrumbs={[
          { label: "Super Admin", href: "/super-admin" },
          { label: "Notifications" },
        ]}
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left 7 Columns: Notification Composer Form */}
        <div className="lg:col-span-7 space-y-6">
          <Card variant="elevated" rounded="3xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="w-5 h-5 text-[#5D7052]" /> Notification Composer
              </CardTitle>
              <CardDescription>Configure message payload and target audience</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 text-xs">
              <Input label="Notification Title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Peak Demand Update" />

              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-[#78786C]">Message Body</label>
                <textarea
                  rows={4}
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  placeholder="Type notification message body..."
                  className="w-full bg-[#FDFCF8] border border-[#DED8CF] rounded-2xl p-3 text-xs text-[#2C2C24] focus:outline-none focus:ring-2 focus:ring-[#5D7052]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <Select
                  label="Notification Channel"
                  value={channel}
                  onChange={(e) => setChannel(e.target.value as any)}
                  options={[
                    { label: "Push Notification", value: "Push Notification" },
                    { label: "In-App Alert", value: "In-App" },
                    { label: "SMS Text", value: "SMS" },
                  ]}
                />

                <Select
                  label="Notification Type"
                  value={deliveryType}
                  onChange={(e) => setDeliveryType(e.target.value as any)}
                  options={NOTIFICATION_TYPES.map((t) => ({ label: t, value: t }))}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <Select
                  label="Target Audience Type"
                  value={targetType}
                  onChange={(e) => setTargetType(e.target.value as any)}
                  options={TARGET_TYPES.map((tt) => ({ label: tt, value: tt }))}
                />

                <Input label="Target Audience Details" value={targetDetails} onChange={(e) => setTargetDetails(e.target.value)} placeholder="e.g. Berlin Zone Drivers" />
              </div>

              {deliveryType === "Scheduled" && (
                <Input label="Scheduled Execution Time" type="text" value={scheduledTime} onChange={(e) => setScheduledTime(e.target.value)} placeholder="2026-09-30 18:00" />
              )}

              <div className="pt-2 flex justify-end">
                <Button
                  variant="primary"
                  icon={<Eye className="w-4 h-4" />}
                  onClick={() => setIsPreviewModalOpen(true)}
                >
                  Preview Before Send
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right 5 Columns: Live Phone / Screen Preview */}
        <div className="lg:col-span-5 space-y-6">
          <Card variant="sand" rounded="3xl" padding="lg">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-heading text-lg font-bold text-[#2C2C24] flex items-center gap-2">
                  <Smartphone className="w-5 h-5 text-[#5D7052]" /> Live Device Preview
                </h3>
                <Badge variant="moss" size="sm">{channel}</Badge>
              </div>

              {/* Mock Mobile Screen Notification Card */}
              <div className="p-4 rounded-2xl bg-white border border-[#DED8CF] shadow-organic space-y-2">
                <div className="flex items-center justify-between text-[11px] text-[#78786C]">
                  <span className="font-bold text-[#5D7052] flex items-center gap-1">
                    <Bell className="w-3 h-3" /> INFURNUS App
                  </span>
                  <span>Now</span>
                </div>
                <h4 className="font-bold text-xs text-[#2C2C24]">{title || "Notification Title"}</h4>
                <p className="text-xs text-[#78786C] leading-relaxed">{body || "Notification body text..."}</p>
              </div>

              <div className="p-3.5 rounded-2xl bg-[#F0EBE5]/60 border border-[#DED8CF] text-xs space-y-1">
                <p><span className="text-[#78786C]">Audience:</span> <span className="font-bold text-[#2C2C24]">{targetType} ({targetDetails})</span></p>
                <p><span className="text-[#78786C]">Type:</span> <span className="font-semibold text-[#C18C5D]">{deliveryType}</span></p>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Dispatch History Table */}
      <Card variant="elevated" rounded="3xl">
        <CardHeader>
          <CardTitle>Dispatch History Log</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable columns={columns} data={notifications} keyExtractor={(n) => n.id} />
        </CardContent>
      </Card>

      {/* Preview Confirmation Modal */}
      <Modal
        isOpen={isPreviewModalOpen}
        onClose={() => setIsPreviewModalOpen(false)}
        title="Confirm Notification Dispatch"
        description="Verify preview payload before broadcasting to target audience."
        footer={
          <>
            <Button variant="outline" onClick={() => setIsPreviewModalOpen(false)}>Cancel</Button>
            <Button variant="primary" icon={<Send className="w-4 h-4" />} onClick={handleSendNotification}>
              Send Notification Now
            </Button>
          </>
        }
      >
        <div className="space-y-3 py-2 text-xs">
          <div className="p-4 rounded-2xl bg-[#F0EBE5] border border-[#DED8CF] space-y-2">
            <h4 className="font-bold text-sm text-[#2C2C24]">{title}</h4>
            <p className="text-[#78786C]">{body}</p>
          </div>
          <div className="grid grid-cols-2 gap-2 p-3 rounded-2xl bg-white border border-[#DED8CF]">
            <p><span className="text-[#78786C]">Audience:</span> <span className="font-bold">{targetType}</span></p>
            <p><span className="text-[#78786C]">Channel:</span> <span className="font-bold">{channel}</span></p>
          </div>
        </div>
      </Modal>
    </div>
  );
}
