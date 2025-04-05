import { LucideProps } from "lucide-react";

export const Spinner = (props: LucideProps) => (
  <svg width={16} height={16} viewBox="0 0 16 16" {...props}>
    <g strokeWidth={2} fill="none" fillRule="evenodd">
      <circle strokeOpacity={0.25} cx={8} cy={8} r={7} stroke="currentColor" />
      <path
        strokeLinecap="round"
        d="M15 8c0-4.5-4.5-7-7-7"
        stroke="currentColor"
      >
        <animateTransform
          attributeName="transform"
          type="rotate"
          from="0 8 8"
          to="360 8 8"
          dur="1s"
          repeatCount="indefinite"
        />
      </path>
    </g>
  </svg>
);

export const LoadingFallback = () => (
    <div className="w-full h-full flex items-center justify-center">
        <Spinner />
    </div>
);

export const Loading = () => (
  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
    <Spinner />
  </div>
);
