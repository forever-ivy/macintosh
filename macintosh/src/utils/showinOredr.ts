interface ShowInOrderProps {
  currentStep: number;
  refs: React.RefObject<HTMLDivElement>[];
}

export const showInOrder = ({ currentStep, refs }: ShowInOrderProps) => {
  refs.forEach((ref, index) => {
    if (ref.current) {
      ref.current.style.display = index <= currentStep ? "block" : "none";
    }
  });
};
