import { baseApi } from "./baseApi";

const legalAgreementApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // 1. Get active legal document by type
    getActiveDocument: builder.query({
      query: (type) => ({
        url: `/legal/active/${type}`,
        method: "GET",
      }),
      providesTags: ["legalDoc"],
    }),

    // 2. Get legal documents version history
    getLegalDocumentsHistory: builder.query({
      query: (type) => ({
        url: `/legal/documents/history${type ? `?type=${type}` : ""}`,
        method: "GET",
      }),
      providesTags: ["legalDoc"],
    }),

    // 3. Publish a new version of legal documents (Terms, Privacy, Contract)
    publishLegalDocument: builder.mutation({
      query: (data) => ({
        url: "/legal/publish",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["legalDoc", "consentEvidence", "traceability"],
    }),

    // 4. Partner dynamic contract preview with legal & tax data
    getPartnerContractPreview: builder.query({
      query: () => ({
        url: "/legal/partner-contract/preview",
        method: "GET",
      }),
      providesTags: ["partnerContract"],
    }),

    // 5. Query digital consent evidence records
    getLegalConsentEvidence: builder.query({
      query: ({ page = 1, limit = 10, documentType, userRole, version }) => {
        let params = new URLSearchParams({ page, limit });
        if (documentType && documentType !== "all") params.append("documentType", documentType);
        if (userRole && userRole !== "all") params.append("userRole", userRole);
        if (version) params.append("version", version);
        return {
          url: `/legal/evidence?${params.toString()}`,
          method: "GET",
        };
      },
      providesTags: ["consentEvidence"],
    }),

    // 6. Query system traceability audit logs
    getSystemTraceabilityLogs: builder.query({
      query: ({ page = 1, limit = 15, actionType, actorRole, startDate, endDate }) => {
        let params = new URLSearchParams({ page, limit });
        if (actionType && actionType !== "all") params.append("actionType", actionType);
        if (actorRole && actorRole !== "all") params.append("actorRole", actorRole);
        if (startDate) params.append("startDate", startDate);
        if (endDate) params.append("endDate", endDate);
        return {
          url: `/legal/traceability?${params.toString()}`,
          method: "GET",
        };
      },
      providesTags: ["traceability"],
    }),
  }),
});

export const {
  useGetActiveDocumentQuery,
  useGetLegalDocumentsHistoryQuery,
  usePublishLegalDocumentMutation,
  useGetPartnerContractPreviewQuery,
  useGetLegalConsentEvidenceQuery,
  useGetSystemTraceabilityLogsQuery,
} = legalAgreementApi;
