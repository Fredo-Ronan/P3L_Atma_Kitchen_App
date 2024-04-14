import { redirect } from "next/navigation"
import { getSessionCustomer, loginCustomer, logoutCustomer } from "@/lib"

const CustomerLoginPage = async () => {
  const session = await getSessionCustomer();

  return (
    <section>
      <form className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4" action={
        async (formData) => {
          "use server";
          await loginCustomer(formData);
        }
      }>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Username
          </label>
          <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" name="username" type="text" placeholder="Username"/>
        </div>
        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Password
          </label>
          <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline" name="password" type="password" placeholder="******************"/>
        </div>
        <br />
        <div className="flex items-center justify-center">
          <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="submit">Login</button>
        </div>
      </form>
    </section>
  )
}

export default CustomerLoginPage