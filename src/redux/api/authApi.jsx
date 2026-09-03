import { baseApi } from "./baseApi";

const authApi = baseApi.injectEndpoints({
    endpoints : (builder)=>({
        loginAdmin : builder.mutation({
            query : (data)=>{
                return {
                    url :'/auth/login',
                    method : 'POST',
                    body :  data
                }
            }
        }),
        forgetPassword : builder.mutation({
            query : (data)=>{
                return {
                    url : '/auth/forgot-password',
                    method : 'POST',
                    body : data
                }
            }
        }),
        verifyOtp :builder.mutation({
            query : (data)=>{
                return {
                    url : '/auth/verify-otp',
                    method : 'POST',
                    body : data
                }
            }
        }),
        resetPassword :builder.mutation({
            query : ({email , data})=>{
                return {
                    url : `/auth/reset-password?email=${email}`,
                    method : 'POST',
                    body : data
                }
            }
        }),
        getAdminProfile : builder.query({
            query : ()=>{
                return {
                    url : '/admin/profile',
                    method : 'GET'
                }
            },
            providesTags : ['admin']
        }),
        editAdminProfile : builder.mutation({
            query : (data)=>{
                return {
                    url :'/admin/edit-profile',
                    method : 'PATCH',
                    body : data
                }
            },
            invalidatesTags: ['admin']
        }),
        changePassword :  builder.mutation({
            query: (data)=>{
                return {
                    url : '/auth/change-password',
                    method : 'PATCH',
                    body :data
                }
            }
        })
    })
})

export const {  useLoginAdminMutation , useForgetPasswordMutation, useVerifyOtpMutation , useResetPasswordMutation , useGetAdminProfileQuery, useEditAdminProfileMutation , useChangePasswordMutation} =  authApi;