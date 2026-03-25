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
import { useAssignRole } from "@/app/[locale]/admin/users/_hooks/use-user-mutations";
import { UserItem } from "./columns";
import { Roles } from "@/constants";

interface ActionCellProps {
  user: UserItem;
}

export function ActionCell({ user }: ActionCellProps) {
  const assignRoleMutation = useAssignRole();
  const normalizedRoles = user.roles.toUpperCase();

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
        {!normalizedRoles.includes(Roles.ADMIN) && (
          <DropdownMenuItem
            onClick={() => handleAssignRole(Roles.ADMIN)}
            disabled={assignRoleMutation.isPending}
          >
            Assign Admin Role
          </DropdownMenuItem>
        )}
        {!normalizedRoles.includes(Roles.USER) && (
          <DropdownMenuItem
            onClick={() => handleAssignRole(Roles.USER)}
            disabled={assignRoleMutation.isPending}
          >
            Assign User Role
          </DropdownMenuItem>
        )}
        {!normalizedRoles.includes(Roles.MODERATOR) && (
          <DropdownMenuItem
            onClick={() => handleAssignRole(Roles.MODERATOR)}
            disabled={assignRoleMutation.isPending}
          >
            Assign Moderator Role
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
