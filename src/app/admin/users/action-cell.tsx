"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal } from "lucide-react";
import { useAssignRole } from "@/app/admin/users/_hooks/use-user-mutations";
import { UserItem } from "./columns";

interface ActionCellProps {
  user: UserItem;
}

export function ActionCell({ user }: ActionCellProps) {
  const assignRoleMutation = useAssignRole();

  const handleAssignRole = (roleName: string) => {
    assignRoleMutation.mutate({
      userId: user.id,
      roleName,
    });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Open menu</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem
          onClick={() => navigator.clipboard.writeText(user.email)}
        >
          Copy email
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        {!user.roles.includes("Admin") && (
          <DropdownMenuItem
            onClick={() => handleAssignRole("Admin")}
            disabled={assignRoleMutation.isPending}
          >
            Assign Admin Role
          </DropdownMenuItem>
        )}
        {!user.roles.includes("User") && (
          <DropdownMenuItem
            onClick={() => handleAssignRole("User")}
            disabled={assignRoleMutation.isPending}
          >
            Assign User Role
          </DropdownMenuItem>
        )}
        {!user.roles.includes("Moderator") && (
          <DropdownMenuItem
            onClick={() => handleAssignRole("Moderator")}
            disabled={assignRoleMutation.isPending}
          >
            Assign Moderator Role
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
