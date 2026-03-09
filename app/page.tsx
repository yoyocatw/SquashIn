import TypewriterCity from "@/components/TypewriterCity";
import { Input } from "@/components/ui/input";

export default function Home() {
  return (
   <div className="flex w-full flex-col items-center justify-center p-4 h-screen">
      <div className="flex w-full max-w-4xl flex-col items-center justify-center gap-6 ">
        
        <div className="flex flex-col sm:flex-row flex-wrap justify-center gap-x-2 gap-y-2 w-full items-center whitespace-nowrap">
          <h1 className=" text-5xl font-bold text-center">
            Squash in
          </h1>
          <div className="flex justify-center">
            <TypewriterCity />   
          </div>
        </div>
        <div className="w-96">
            <Input />
        </div>
      </div>
    </div>
  );
}
