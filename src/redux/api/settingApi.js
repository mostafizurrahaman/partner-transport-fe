import { baseApi } from "./baseApi";

const settingApis = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getTermsConditions: builder.query({
            query: () => {
                return {
                    url: '/dashboard/get-terms-conditions',
                    method: 'GET'
                }
            },
            providesTags: ['terms']
        }),
        updateTermsCondition: builder.mutation({
            query: (data) => {
                return {
                    url: '/dashboard/add-terms-conditions',
                    method: "POST",
                    body: data
                }
            }, invalidatesTags: ['terms']
        }),
        getPrivacyPolicy: builder.query({
            query: () => {
                return {
                    url: '/dashboard/get-privacy-policy',
                    method: 'GET'
                }
            },

            providesTags: ['privacy']
        }),
        updatePrivacyPolicy: builder.mutation({
            query: (data) => {
                return {
                    url: '/dashboard/add-privacy-policy',
                    method: 'POST',
                    body: data
                }
            }, invalidatesTags: ['privacy']
        }),
        getContactUs :  builder.query({
            query : ()=>{
                return {
                    url : '/variables/contact-number',method : "GET"
                }
            }
        }),
        updateContact : builder.mutation({
            query : (data)=>{
                return {
                    url : '/variables/contact-number',
                    method : 'POST',
                    body : data
                }
            }
        }),
        getAllNotification : builder.query({
            query   : ()=>{
                return {
                    url : "/notification/admin",method : 'GET'
                }
            },
            providesTags : ['notification']
        }),
        deleteNotification : builder.mutation({
            query : (id)=>{
                return {
                    url : `/notification/admin-delete/${id}`,method : 'DELETE', invalidatesTags : ['notification']
                }
            },
            invalidatesTags :["notification"]
        }),
        seenNotification :  builder.mutation({
            query : ()=>{
                return {
                    url : "/notification/seen-notification",
                    method : "PATCH"
                }
            },
            invalidatesTags : ["notification"]
        })
    })
})

export const { useGetTermsConditionsQuery, useUpdateTermsConditionMutation  , useGetPrivacyPolicyQuery, useUpdatePrivacyPolicyMutation , useGetContactUsQuery , useUpdateContactMutation , useGetAllNotificationQuery ,  useDeleteNotificationMutation , useSeenNotificationMutation} = settingApis;