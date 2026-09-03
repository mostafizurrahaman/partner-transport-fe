import { baseApi } from "./baseApi";

const auditDashboardApi = baseApi.injectEndpoints({
    endpoints : (builder)=>({
        eventCreateRate : builder.query({
            query  :({year,month})=>{
                return {
                    url :`/logs-dashboard/events-creation-rate?year=${year}&month=${month}`,
                    method : "GET"
                }
            }
        }),
        getMostCreateUser : builder.query({
            query : ({searchQuery, page})=>{
                let url = `/logs-dashboard/most-created-users`;

                const params = new URLSearchParams();
                if (page) params.append('page', page);
                if (searchQuery) params.append('searchQuery', searchQuery);
        
                if (params.toString()) {
                    url += `?${params.toString()}`;
                }
                return {
                    url,
                    method : 'GET'
                }
            }
        }),
        getMostTaskCompletedAdmins : builder.query({
            query : ({page,searchTerm})=>{
                return {
                    url : `/logs-dashboard/most-admin-tasks?searchTerm=${searchTerm}&page=${page}`,
                    method : "GET"
                }
            }
        }) ,
        getMostEventCreateUser : builder.query({
            query : ()=>{
                return {
                    url : `/logs-dashboard/most-created-users`,
                    method : 'GET'
                }
            }
        })
    })
})
export const  {useEventCreateRateQuery , useGetMostCreateUserQuery , useGetMostTaskCompletedAdminsQuery , useGetMostEventCreateUserQuery} = auditDashboardApi