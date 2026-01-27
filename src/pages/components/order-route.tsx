import { Circle, CheckCircle2 } from 'lucide-react';

interface RouteStep {
  label: string;
  time: string;
  completed: boolean;
  current?: boolean;
}

interface OrderRouteProps {
  steps: RouteStep[];
}

export function OrderRoute({ steps }: OrderRouteProps) {
  return (
    <div>
      <h2 className="text-sm uppercase tracking-wider text-gray-600 mb-6">Real-Time Status</h2>
      <div className="relative">
        {steps.map((step, index) => (
          <div key={index} className="relative flex gap-4 pb-8 last:pb-0">
            {/* Vertical line */}
            {index < steps.length - 1 && (
              <div className={`absolute left-[11px] top-[24px] w-[2px] h-full ${
                step.completed ? 'bg-black' : 'bg-gray-200'
              }`} />
            )}
            
            {/* Icon */}
            <div className="relative z-10">
              {step.completed ? (
                <CheckCircle2 
                  className={`w-6 h-6 ${step.current ? 'fill-black' : ''}`}
                  strokeWidth={1.5}
                />
              ) : (
                <Circle className="w-6 h-6 text-gray-300" strokeWidth={1.5} />
              )}
            </div>

            {/* Content */}
            <div className="flex-1 pt-0.5">
              <div className="flex items-baseline justify-between">
                <p className={`${step.current ? 'font-medium' : ''} ${
                  !step.completed ? 'text-gray-400' : ''
                }`}>
                  {step.label}
                  {step.current && (
                    <span className="ml-2 text-xs uppercase tracking-wider text-gray-600">
                      Current
                    </span>
                  )}
                </p>
                <p className={`text-sm ${!step.completed ? 'text-gray-400' : 'text-gray-600'}`}>
                  {step.time}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
