import { baseApi } from "./baseApi";

const transactionApi = baseApi.injectEndpoints({
    endpoints : (builder)=>({
        getAllTransaction : builder.query({
            query : ({page ,searchTerm})=>{
                return {
                    url : `/dashboard/transactions?page=${page}&searchTerm=${searchTerm}`,
                    method : 'GET'
                }
            }
        }),
        getSingleTransaction : builder.query({
            query : (id)=>{
                return {
                    url : `/dashboard/transaction/${id}`,method : "GET"
                }
            }
        })
    })
})

export const { useGetAllTransactionQuery , useGetSingleTransactionQuery} =  transactionApi