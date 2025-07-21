"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/data-table";
import { columns, ReportItem } from "./columns";
import { useReports } from "./_hooks/use-report";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useDebounce } from "@/hooks/use-debounce";

export default function ReportPage() {
  const [pageIndex, setPageIndex] = useState(1);
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 500);

  const { data: reportResponse } = useReports({
    pageIndex,
    pageSize: 10,
    search: debouncedSearch,
  });

  const reportsData = reportResponse?.data;
  const total = reportsData?.total || 0;
  const totalPage = Math.ceil(total / 10);

  const canPreviousPage = pageIndex > 1;
  const canNextPage = pageIndex < totalPage;

  const data: ReportItem[] =
    reportsData?.data?.map((report) => ({
      id: report.id,
      reason: report.reason || "Unknown",
      description: report.description || "No description",
      process: report.process || "pending",
      createdAt: report.createdAt || undefined,
      createdBy: report.createdBy || "System",
    })) || [];

  return (
    <>
      <div>
        <h6>Reports</h6>
        <p className="text-sm text-muted-foreground">
          Manage user reports and feedback
        </p>
      </div>

      <div>
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search movies..."
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
            Page {reportsData?.pageIndex} of {totalPage}
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
