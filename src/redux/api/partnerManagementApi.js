import { baseApi } from "./baseApi";

const partnerManagementApi = baseApi.injectEndpoints({
    endpoints : (builder)=>({
        getAllPartner :  builder.query({
            query : ({page, searchTerms})=>{
                // console.log(searchTerms);
                return {
                    url : `/dashboard/get_all_partner?page=${page}&searchTerm=${searchTerms}`,
                    method : 'GET'
                }
            },
            providesTags : ['partner']
        }),
        getPartnerDetails : builder.query({
            query : (id)=>{
                return {
                    url : `/dashboard/get_partner_details?id=${id}`,method : 'GET'
                }
            }
        }),
        blockUnBlockPartner : builder.mutation({
            query :(data)=>{
                return {
                    url : "/dashboard/block-unblock-user-partner-admin",
                    method : "PATCH",
                    body: data
                }
            },
            invalidatesTags : ['partner']
        }),
        deletePartner :  builder.mutation({
            query : (id)=>{
                return {
                    url : `/dashboard/delete_partner?userId=${id}`,
                    method : 'DELETE'
                }
            },
            invalidatesTags : ['partner']
        }),

        getPartnerReviews : builder.query({
            query : (partnerId)=>{
                return {
                    url : `/services/review-partner?partnerId=${partnerId}`,
                    method : 'GET'
                }
            }
        }),

        getPartnerRatingsSummary: builder.query({
            query: (partnerId) => ({
                url: `/bid/partner-ratings/${partnerId}`,
                method: 'GET'
            }),
            providesTags: ['partnerRatings']
        }),

        SendNoticePartner :  builder.mutation({
            query : ({data , sendAllChecked ,sendNoticeId})=>{
                let url = "/dashboard/notice/partner"
                if(sendAllChecked){
                    url += "?all_user=true"
                }else{
                    url += `?userId=${sendNoticeId}`
                }
                return {
                    url ,
                    method : 'POST',
                    body : data
                }
            }
        }),
    })
})

export const {
    useGetAllPartnerQuery,
    useGetPartnerDetailsQuery,
    useGetPartnerReviewsQuery,
    useGetPartnerRatingsSummaryQuery,
    useBlockUnBlockPartnerMutation,
    useSendNoticePartnerMutation,
    useDeletePartnerMutation
} = partnerManagementApi;