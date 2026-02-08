import { useReleaseStore } from '../../../hooks/useReleaseStore';
import { cn } from '../../../lib/utils';
import { Check } from 'lucide-react';

const steps = [
  { id: 1, name: 'Format' },
  { id: 2, name: 'Basic Info' },
  { id: 3, name: 'Tracks' },
  { id: 4, name: 'Specifics' },
  { id: 5, name: 'Review' },
];

const ReleaseStepper = () => {
  const { step } = useReleaseStore();

  return (
    <nav aria-label="Progress">
      <ol role="list" className="space-y-4 md:flex md:space-x-8 md:space-y-0">
        {steps.map((s) => (
          <li key={s.name} className="md:flex-1">
            {step > s.id ? (
              <div className="group flex w-full flex-col border-l-4 border-primary py-2 pl-4 transition-colors md:border-l-0 md:border-t-4 md:pb-0 md:pl-0 md:pt-4">
                <span className="text-sm font-medium text-primary transition-colors ">
                  Step {s.id}
                </span>
                <span className="text-sm font-medium text-gray-900">{s.name}</span>
              </div>
            ) : step === s.id ? (
              <div
                className="flex w-full flex-col border-l-4 border-primary py-2 pl-4 md:border-l-0 md:border-t-4 md:pb-0 md:pl-0 md:pt-4"
                aria-current="step"
              >
                <span className="text-sm font-medium text-primary">Step {s.id}</span>
                <span className="text-sm font-medium text-gray-900">{s.name}</span>
              </div>
            ) : (
              <div className="group flex w-full flex-col border-l-4 border-gray-200 py-2 pl-4 transition-colors md:border-l-0 md:border-t-4 md:pb-0 md:pl-0 md:pt-4">
                <span className="text-sm font-medium text-gray-500 transition-colors">
                  Step {s.id}
                </span>
                <span className="text-sm font-medium text-gray-500">{s.name}</span>
              </div>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
};

export default ReleaseStepper;
