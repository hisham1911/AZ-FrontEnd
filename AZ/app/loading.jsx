import { CenteredSpinner } from "./components/spinner-loader";

export default function Loading() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <CenteredSpinner size="lg" />
    </div>
  );
}
