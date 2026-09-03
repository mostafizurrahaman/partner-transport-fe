import { baseApi } from "./baseApi";

const activityLogApi = baseApi.injectEndpoints({
    endpoints : (builder)=>({
        getAllActivity : builder.query({
            query : ({page, searchTerm , email ,date, type , status})=>{
                return {
                    url : `/logs-dashboard/get-activity-log?page=${page}&searchTerm=${searchTerm}&email=${email}&date=${date}&type=${type}&status=${status}`,
                    method :"GET"
                }
            }
        }),
        getAllAdmin :  builder.query({
            query : ()=>{
                return {
                    url  : "/admin/get-all",
                    method : 'GET'
                }
            }
        })
    })
})
export const { useGetAllActivityQuery, useGetAllAdminQuery } = activityLogApi;