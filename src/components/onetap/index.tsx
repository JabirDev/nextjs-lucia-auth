"use client";

import useOneTap from "@/hooks/onetap/useOnetap";

interface OneTapProps {
  googleClientId: string;
}

const OneTapComponent = ({ googleClientId }: OneTapProps) => {
  useOneTap({
    googleClientId,
  });

  return <div id="oneTap" className="fixed right-0 top-0" />; // This is done with tailwind. Update with system of choice
};

export default OneTapComponent;
