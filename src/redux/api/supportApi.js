import { baseApi } from "./baseApi";

const supportApi = baseApi.injectEndpoints({
    endpoints : (builder)=>({
        getAllFileClaim : builder.query({
            query : ({searchTerm , page})=>{
                return {
                    url : `/dashboard/get-file-claim?searchTerm=${searchTerm}&page=${page}`,
                    method : 'GET'
                }
            }
        }),
        getAllTicket : builder.query({
            query : ({page,search})=>{
                return {
                    url : `/support/get-ticket?searchTerm=${search}&page=${page}`,
                    method : 'GET'
                }
            },
            providesTags : ['reply']
        }),
        replyTicket :  builder.mutation({
            query : ({id, data})=>{
                return {
                    url : `/support/reply-ticket/${id}`,
                    method : "PATCH",
                    body : data
                }
            },
            invalidatesTags : ['reply']
        }),
        penaltyCost :  builder.mutation({
            query : (data)=>{
                return {
                    url : '/dashboard/penalty',
                    method : 'PATCH',
                    body : data
                }
            }
        }),
        updateClaimedStatus :  builder.mutation({
            query : (data)=>{
                return {
                    url : '/dashboard/status-file-claim',
                    method : 'PATCH',
                    body : data
                }
            }
        })
    })
})

export const { useGetAllFileClaimQuery, useGetAllTicketQuery , useReplyTicketMutation , usePenaltyCostMutation , useUpdateClaimedStatusMutation} = supportApi