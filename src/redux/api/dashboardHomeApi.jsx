import { baseApi } from "./baseApi";

const dashboardHomeApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        overviewDashboard: builder.query({
            query: () => {
                return {
                    url: '/dashboard/total-counts',
                    method: 'GET'
                }
            }
        }),
        incomeOverView: builder.query({
            query: (year) => {
                return {
                    url: `/dashboard/income-overview?year=${year}`,
                    method: "GET"
                }
            }
        }),
        partnerGrowthOverview: builder.query({
            query: (year) => {
                return {
                    url: `/dashboard//user-growth?year=${year}`,
                    method: 'GET'
                }
            }
        }),
        getPendingPartner: builder.query({
            query: () => {
                return {
                    url: '/dashboard/get_padding_partner', method: 'GET'
                }
            },
            providesTags : ['partnerApproved']
        }),
        approvedDeclinePartner: builder.mutation({
            query: (data) => {
                return {
                    url: '/dashboard/approve_decline_partner',
                    method: 'PATCH',
                    body: data
                }
            },
            invalidatesTags : ['partnerApproved']
        })
    })
})
export const { useOverviewDashboardQuery, useIncomeOverViewQuery, usePartnerGrowthOverviewQuery, useGetPendingPartnerQuery, useApprovedDeclinePartnerMutation } = dashboardHomeApi;