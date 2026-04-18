import { PageEnterMotion } from "@/components/layout/page-enter-motion";

export default function RootTemplate({ children }: { children: React.ReactNode }) {
  return <PageEnterMotion>{children}</PageEnterMotion>;
}
