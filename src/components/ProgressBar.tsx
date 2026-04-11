import { Icon } from "@iconify/react";

const STEPS = ["Search", "Choose Bus", "Select Seat", "Personal Information"];

export default function ProgressBar({ currentStep }: { currentStep: number }) {
  return (
    <div className="p-8">
      <div className="max-width-container flex items-center gap-0 max-w-170 mx-auto">
        {STEPS.map((label, i) => {
          const safeStep = Math.min(Math.max(currentStep, 1), STEPS.length);
          const stepNum = i + 1;
          const isDone = stepNum < safeStep
          const isActive = stepNum === safeStep;

          return (
            <div
              key={label}
              className="flex items-center flex-1 last:flex-none"
            >
              <div className="flex items-center gap-2 shrink-0">
                {/* Dot */}
                <div
                  className={`size-10 rounded-full flex items-center justify-center text-lg font-semibold border-[1.5px] transition-all
                    ${isDone ? "bg-[#2A7A4B] border-[#2A7A4B] text-white" : ""}
                    ${isActive ? "bg-[#0D0D0D] border-[#0D0D0D] text-white" : ""}
                    ${!isDone && !isActive ? "bg-[#E8E6DF] border-[#E0DED7] text-[#B8B8B8]" : ""}
                  `}
                >
                  {isDone ? <Icon icon={"fe:check"} fontSize={20} /> : stepNum}
                </div>
                <span
                  className={`text-[12px] font-medium hidden sm:block
                    ${isDone ? "text-[#2A7A4B]" : ""}
                    ${isActive ? "text-[#0D0D0D]" : ""}
                    ${!isDone && !isActive ? "text-[#B8B8B4]" : ""}
                  `}
                >
                  {label}
                </span>
              </div>
              {/* Line */}
              {i < STEPS.length - 1 && (
                <div
                  className={`flex-1 h-[1.5px] mx-2 ${isDone ? "bg-[#2A7A4B]" : "bg-[#E0DED7]"}`}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
