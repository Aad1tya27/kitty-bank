import SuspenseComponent from "../components/SuspenseComponent";
import { Suspense } from 'react'

export default function Home() {
  return <>
  <Suspense fallback={<div>Loading...</div>}>
    <SuspenseComponent/>
  </Suspense>
  </>
}
