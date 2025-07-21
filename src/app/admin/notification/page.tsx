"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/data-table";
import { columns } from "./columns";
import { useNotifications } from "./_hooks/use-notification";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useDebounce } from "@/hooks/use-debounce";

export default function NotificationPage() {
  const [pageIndex, setPageIndex] = useState(1);
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 500);

  const { data: notificationResponse } = useNotifications({
    pageIndex,
    pageSize: 10,
    search: debouncedSearch,
  });

  const notificationsData = notificationResponse?.data;
  const total = notificationsData?.total || 0;
  const totalPage = Math.ceil(total / 10);

  const canPreviousPage = pageIndex > 1;
  const canNextPage = pageIndex < totalPage;

  const data =
    notificationsData?.data?.map((notification) => ({
      id: notification.id,
      title: notification.title || "Untitled",
      content: notification.content || "No content",
      createdAt: notification.createdAt,
    })) || [];

  return (
    <>
      <div>
        <h6>Notifications</h6>
        <p className="text-sm text-muted-foreground">
          Manage system notifications
        </p>
      </div>

      <div>
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search notifications..."
            className="pl-8"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>
      <div className="container mx-auto">
        <DataTable columns={columns} data={data} />
        <div className="flex items-center justify-end space-x-2 py-4">
          <div className="flex w-[100px] items-center justify-center text-sm font-medium">
            Page {notificationsData?.pageIndex} of {totalPage}
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPageIndex(pageIndex - 1)}
            disabled={!canPreviousPage}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPageIndex(pageIndex + 1)}
            disabled={!canNextPage}
          >
            Next
          </Button>
        </div>
      </div>
    </>
  );
}
