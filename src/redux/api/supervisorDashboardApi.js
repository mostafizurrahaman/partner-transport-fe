import { baseApi } from "./baseApi";

const supervisorApi = baseApi.injectEndpoints({
    endpoints : (builder)=>({
        getTskCount : builder.query({
            query : ()=>{
                return {
                    url : '/logs-dashboard/get-task-counts',method: 'GET'
                }
            }
        }),
        getCompletedTask : builder.query({
            query : ({searchTerm, page})=>{
                return {
                    url : `/logs-dashboard/get-task-completed?searchTerm=${searchTerm}&page=${page}`,
                    method :'GET'
                }
            }
        })
    })
})
export const { useGetTskCountQuery , useGetCompletedTaskQuery } = supervisorApi;