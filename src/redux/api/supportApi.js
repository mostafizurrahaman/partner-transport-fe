import { baseApi } from "./baseApi";

const supportApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllFileClaim: builder.query({
      query: ({ searchTerm = "", page = 1, limit = 10, claimType, status }) => {
        let params = new URLSearchParams({ page, limit });
        if (searchTerm) params.append("searchTerm", searchTerm);
        if (claimType && claimType !== "all") params.append("claimType", claimType);
        if (status && status !== "all") params.append("status", status);
        return {
          url: `/dashboard/get-file-claim?${params.toString()}`,
          method: "GET",
        };
      },
      providesTags: ["fileClaim"],
    }),
    createFileClaim: builder.mutation({
      query: ({ serviceId, data }) => ({
        url: `/services/create-file-claim?serviceId=${serviceId}`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["fileClaim"],
    }),
    addClaimAdminNote: builder.mutation({
      query: ({ claimId, note }) => ({
        url: `/dashboard/claim-note/${claimId}`,
        method: "POST",
        body: { note },
      }),
      invalidatesTags: ["fileClaim"],
    }),
    resolveAdminClaim: builder.mutation({
      query: (data) => ({
        url: "/dashboard/resolve-claim",
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["fileClaim"],
    }),
    updateClaimedStatus: builder.mutation({
      query: (data) => ({
        url: "/dashboard/status-file-claim",
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["fileClaim"],
    }),
    penaltyCost: builder.mutation({
      query: (data) => ({
        url: "/dashboard/penalty",
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["fileClaim"],
    }),
    getAllTicket: builder.query({
      query: ({ page, search }) => ({
        url: `/support/get-ticket?searchTerm=${search}&page=${page}`,
        method: "GET",
      }),
      providesTags: ["reply"],
    }),
    replyTicket: builder.mutation({
      query: ({ id, data }) => ({
        url: `/support/reply-ticket/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["reply"],
    }),
  }),
});

export const {
  useGetAllFileClaimQuery,
  useCreateFileClaimMutation,
  useAddClaimAdminNoteMutation,
  useResolveAdminClaimMutation,
  useUpdateClaimedStatusMutation,
  usePenaltyCostMutation,
  useGetAllTicketQuery,
  useReplyTicketMutation,
} = supportApi;