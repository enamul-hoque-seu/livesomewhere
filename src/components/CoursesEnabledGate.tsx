import { Navigate } from "react-router-dom";
import { useBoolSetting } from "@/hooks/useSiteSetting";

const CoursesEnabledGate = ({ children }: { children: React.ReactNode }) => {
  const { enabled, isLoading } = useBoolSetting("courses_enabled", true);
  if (isLoading) return null;
  if (!enabled) return <Navigate to="/" replace />;
  return <>{children}</>;
};

export default CoursesEnabledGate;
