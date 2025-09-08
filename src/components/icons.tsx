import { type LucideProps, LoaderCircle } from "lucide-react"

export const Icons = {
  spinner: (props: LucideProps) => <LoaderCircle {...props} className="animate-spin" />,
}
