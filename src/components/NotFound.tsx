// pages/NotFoundPage.tsx
import { Icon } from "@iconify/react";
import { useNavigate } from "react-router";

export default function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div className=" bg-[#FAFAF8]  px-6 min-h-scree grid place-items-center">
      <div className=" max-w-md flex flex-col items-center justify-center">
        {/* Big 404 */}

        <Icon
          icon={"streamline-freehand:cloud-error-404"}
          className="text-[160px] md:text-[200px] text-black/80 select-none"
        />

        {/* Text */}
        <h1
          className="text-[28px] font-bold text-[#0D0D0D] mb-3 tracking-tight"
          style={{ fontFamily: "'Playfair Display', serif" }}
        >
          You've missed your stop
        </h1>
        <p className="text-[15px] text-center text-[#7A7A7A] leading-relaxed mb-8">
          The page you're looking for doesn't exist or may have been moved.
          Let's get you back on route.
        </p>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
          <button onClick={() => navigate("/")} className="btn-primary">
            Back to Home
          </button>
          <button
            onClick={() => navigate(-1)}
            className="btn-secondary"
          >
            Go Back
          </button>
        </div>
      </div>
    </div>
  );
}
