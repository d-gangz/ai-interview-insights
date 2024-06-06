import { Trash } from "lucide-react";
import { handleFileUpload } from "../lib/actions";

export default function Fileviewer() {
  // handle file upload function which uploads to vercel blob
  // Need to get back the filename and filekey?
  // After uploading to vercel blob, retrieve them and then load files to pinecone
  // need a function to display the files

  return (
    <div className="bg-slate-50 p-6 min-h-full w-[480px] rounded-2xl flex flex-col">
      <div className="flex flex-col flex-grow">
        <p>Place to hold the files</p>
        <Trash className="w-4 h-4" />
      </div>
      <div className="flex flex-col items-center justify-center space-y-4 pt-24 pb-3">
        <p>Attach files for file search</p>
        <form action={handleFileUpload} className="flex flex-col">
          <label
            htmlFor="file-upload"
            className="bg-slate-800 text-white h-12 px-6 cursor-pointer flex justify-center items-center rounded-lg"
          >
            Attach files
          </label>
          <input
            type="file"
            id="file-upload"
            name="file-upload"
            className="hidden"
            multiple
            // onChange={(e) => handleFileUpload(e.target.files)}
          />
        </form>
      </div>
    </div>

    // Previous return which is the non server action version
    // return (
    //   <div className="bg-slate-50 p-6 min-h-full w-[480px] rounded-2xl flex flex-col">
    //     <div className="flex flex-col flex-grow">
    //       <p>Place to hold the files</p>
    //       <Trash className="w-4 h-4" />
    //     </div>
    //     <div className="flex flex-col items-center justify-center space-y-4 pt-24 pb-3">
    //       <p>Attach files for file search</p>
    //       <div className="flex flex-col">
    //         <label
    //           htmlFor="file-upload"
    //           className="bg-slate-800 text-white h-12 px-6 cursor-pointer flex justify-center items-center rounded-lg"
    //         >
    //           Attach files
    //         </label>
    //         <input
    //           type="file"
    //           id="file-upload"
    //           name="file-upload"
    //           className="hidden"
    //           multiple
    //           // onChange={handleFileUpload}
    //         />
    //       </div>
    //     </div>
    //   </div>
  );
}
