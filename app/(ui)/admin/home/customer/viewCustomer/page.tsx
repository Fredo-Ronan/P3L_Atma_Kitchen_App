'use client'
import React, { useEffect, useState } from 'react'
import { dateParser } from '../../../../../../utilities/dateParser'

type Customer = {
  NAMA_CUSTOMER: string,
  ID_CUSTOMER: number,
  TANGGAL_LAHIR: string,
  SALDO: number
}

const CustomerPage = () => {
    const [dataCustomer, setDataCustomer] = useState<Customer[]>();

    async function getCustomer () {
      const res = await fetch('/api/customer/main/getCustomer');
      const data = await res.json();

      // console.log(data.data);
      const resultQuery = data.data;
      let final_result: Customer[] = [];

      resultQuery.forEach((element: Customer) => {
        const customerData = {
          ID_CUSTOMER: element.ID_CUSTOMER,
          NAMA_CUSTOMER: element.NAMA_CUSTOMER,
          TANGGAL_LAHIR: dateParser(element.TANGGAL_LAHIR),
          SALDO: element.SALDO
        }
        final_result.push(customerData);
      });

      setDataCustomer(final_result);
    }
    
    useEffect(() => {
      getCustomer();
    }, []);

    return (
    <div>
      <table className="min-w-full divide-y divide-gray-200 table-fixed dark:divide-gray-700">
        <thead className="bg-gray-100 dark:bg-gray-700">
            <tr>
                <th scope="col" className="py-3 px-6 text-xs font-medium tracking-wider text-left text-gray-700 uppercase dark:text-gray-400">
                    ID CUSTOMER
                </th>
                <th scope="col" className="py-3 px-6 text-xs font-medium tracking-wider text-left text-gray-700 uppercase dark:text-gray-400">
                    NAMA CUSTOMER
                </th>
                <th scope="col" className="py-3 px-6 text-xs font-medium tracking-wider text-left text-gray-700 uppercase dark:text-gray-400">
                    TANGGAL_LAHIR
                </th>
                <th scope="col" className="py-3 px-6 text-xs font-medium tracking-wider text-left text-gray-700 uppercase dark:text-gray-400">
                    SALDO
                </th>
                <th scope="col" className="p-4">
                    <span className="sr-only">Edit</span>
                </th>
            </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-700">
            {dataCustomer?.map((element, index) => (
              <tr className="hover:bg-gray-100 dark:hover:bg-gray-700" key={index}>
                  <td className="py-4 px-6 text-sm font-medium text-gray-900 whitespace-nowrap dark:text-white">{element.ID_CUSTOMER}</td>
                  <td className="py-4 px-6 text-sm font-medium text-gray-500 whitespace-nowrap dark:text-white">{element.NAMA_CUSTOMER}</td>
                  <td className="py-4 px-6 text-sm font-medium text-gray-900 whitespace-nowrap dark:text-white">{element.TANGGAL_LAHIR}</td>
                  <td className="py-4 px-6 text-sm font-medium text-gray-900 whitespace-nowrap dark:text-white">{element.SALDO}</td>
                  <td className="py-4 px-6 text-sm font-medium text-right whitespace-nowrap">
                      <a href="#" className="text-blue-600 dark:text-blue-500 hover:underline">Edit</a>
                  </td>
              </tr>
            ))}
        </tbody>
    </table>
    </div>
  )
}

export default CustomerPage