import { baseApi } from "./baseApi";

const makeAdminApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        createMakeAdmin: builder.mutation({
            query: (formattedData) => ({
                url: '/auth/register',
                method: 'POST',
                body: formattedData
            }),
            invalidatesTags: ['getAdmin']
        }),
        getAllAdmin: builder.query({
            query: ({page, searchTerm}) => ({
                url: `/dashboard/get_all_admin?searchTerm=${searchTerm}&page=${page}`, method: 'GET'
            }),
            providesTags: ["getAdmin"]
        }),
        deleteAdmin: builder.mutation({
            query: (email) => ({
                url: `/dashboard/delete_admin?email=${email}`,
                method: 'DELETE'
            }),
            invalidatesTags: ['getAdmin']

        }),
        getAdminDetails : builder.query({
            query : (id)=>{
                return {
                    url : `/dashboard/get_admin_details?id=${id}`,
                    method : 'GET'
                }
            }
        }),
        updateMakeAdmin : builder.mutation({
            query : ({userId, authId, data})=>{
                return {
                    url : `/dashboard/edit-profile?userId=${userId}&authId=${authId}`,
                    method : 'PATCH',
                    body : data
                }
            }
        })
    })
})
export const { useCreateMakeAdminMutation, useGetAllAdminQuery, useDeleteAdminMutation , useGetAdminDetailsQuery , useUpdateMakeAdminMutation} = makeAdminApi;