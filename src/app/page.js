import { Save } from "lucide-react";
import { Button } from "./ui/utils/Button.util";
import { Tooltip } from "./ui/utils/Tooltip.util";


export default function Home() {
  return(
    <div>
      <Tooltip content="Save">
        <button>
          <Save className="h-5 w-5 bg-green-900 text-white"/>
        </button>
      </Tooltip>
    </div>
  )
}