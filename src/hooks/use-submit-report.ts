import { useMutation } from "@tanstack/react-query";
import { userApi } from "@/lib/api-client/user-api";
import { ReportPayload } from "@/models";

export const useSubmitReport = () => {
  return useMutation({
    mutationFn: (payload: ReportPayload) => userApi.report(payload),
  });
};
