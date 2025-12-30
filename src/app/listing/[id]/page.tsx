import { SearchBox } from "@/app/page"
import { ImageIcon } from "lucide-react"


export function ListingImage(){
   return (
     <div className="w-[56%] max-md:w-full">
        <div className="bg-gray-400 h-100 w-full">
          <ImageIcon className="text-gray-200" />
        </div>
        <ul className="flex mt-2 gap-2 justify-end">
            <li className="bg-gray-400 size-15"><ImageIcon className="text-gray-200"/></li>
            <li className="bg-gray-400 size-15"><ImageIcon className="text-gray-200"/></li>
            <li className="bg-gray-400 size-15"><ImageIcon className="text-gray-200"/></li>
        </ul>
     </div>
   )
}

export function ListingInfo(){
  return (
     <div className="border grow border-green-400 bg-green-200">
        <h1>Xp-pen innovator display 16 drawing tablet (15.6)</h1>
        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Architecto consectetur nostrum adipisci molestias eligendi facilis ratione tenetur doloribus iusto deleniti?</p>
     </div>
  )
}

const Listing = () => {
  return (
    <section>
        <SearchBox />
        <section className="flex max-md:flex-col border border-red-400 max-w-6xl mx-auto h-screen mt-10 justify-between max-xl:px-5 gap-5">
             <ListingImage />
             <ListingInfo />
        </section>
    </section>
  )
}

export default Listing
