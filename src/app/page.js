'use client'
import DemoPage from "./ui/assets/test";
import ExamplePage from "./ui/assets/test";
import { ActionMenuProvider } from "./scripts/Action.context";

export default function Home() {
  return(
    <ActionMenuProvider>
      <div>
       <DemoPage/>
      </div>
    </ActionMenuProvider>
  )
}