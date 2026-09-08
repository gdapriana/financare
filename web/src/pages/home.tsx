import RecentTransaction from "@/components/pages/home/recent-transaction"
import TotalBalance from "@/components/pages/home/total-balance"

export default function Homepage() {
  return (
    <>
      <TotalBalance />
      <RecentTransaction />
    </>
  )
}
