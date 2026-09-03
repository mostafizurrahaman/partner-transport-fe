import { baseApi } from "./baseApi";

const userManagement  = baseApi.injectEndpoints({
    endpoints : (builder)=>({
        getAllUser : builder.query({
            query : ({searchTerms, page})=>{
                return {
                    url : `/dashboard/get_all_user?page=${page}&searchTerm=${searchTerms}`,
                    method : 'GET'
                }
            },
            providesTags : ['userManagement']
        }),
        blockUnBlockUser : builder.mutation({
            query :(data)=>{
                return {
                    url : "/dashboard/block-unblock-user-partner-admin",
                    method : "PATCH",
                    body: data
                }
            },
            invalidatesTags : ['userManagement']
        }),
        SendNotice :  builder.mutation({
            query : ({data , sendAllChecked ,sendNoticeId})=>{
                let url = "/dashboard/notice/user"
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
        getMessage : builder.query({
            query : ({senderId , receiverId})=>{
                return {
                    url : `/message/get-message?senderId=${senderId}&receiverId=${receiverId}`,
                    method : "GET",

                }
            }
        }),
        deleteUser :  builder.mutation({
            query : (id)=>{
                return {
                    url : `/dashboard/delete_user?userId=${id}`,
                    method : "DELETE"
                }
            },
            invalidatesTags : ['userManagement']
        })
    })
})

export const { useGetAllUserQuery, useBlockUnBlockUserMutation , useSendNoticeMutation , useGetMessageQuery , useDeleteUserMutation} = userManagement