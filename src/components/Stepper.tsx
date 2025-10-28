import { CheckCircle2 } from "lucide-react";

interface StepperProps {
  steps: string[];
  currentStep: number;
}

export default function Stepper({ steps, currentStep }: StepperProps) {
  return (
    <div className="w-full py-8 overflow-x-auto">
      <div className="flex items-center max-w-3xl mx-auto px-4" style={{ minWidth: 'max-content' }}>
        {steps.map((step, index) => (
          <div key={index} className="flex items-center" style={{ minWidth: '140px' }}>
            <div className="flex flex-col items-center" style={{ width: '140px' }}>
              <div className="relative">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all ${
                    index < currentStep
                      ? "bg-primary border-primary text-primary-foreground"
                      : index === currentStep
                      ? "border-primary text-primary bg-primary/10"
                      : "border-border text-muted-foreground bg-background"
                  }`}
                >
                  {index < currentStep ? (
                    <CheckCircle2 className="w-5 h-5" />
                  ) : (
                    <span className="text-sm font-semibold">{index + 1}</span>
                  )}
                </div>
              </div>
              <p
                className={`text-xs sm:text-sm mt-2 text-center font-medium whitespace-nowrap ${
                  index <= currentStep ? "text-foreground" : "text-muted-foreground"
                }`}
              >
                {step}
              </p>
            </div>
            {index < steps.length - 1 && (
              <div
                className={`h-0.5 w-4 mx-1 transition-colors flex-shrink-0 ${
                  index < currentStep ? "bg-primary" : "bg-border"
                }`}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
