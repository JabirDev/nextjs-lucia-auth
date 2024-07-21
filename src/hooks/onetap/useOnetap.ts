import { useSession } from "@/providers/auth";
import { useEffect, useState } from "react";
import { onetapAction } from "./actions";

interface OneTapProps {
  googleClientId: string;
}

const useOnetap = ({ googleClientId }: OneTapProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const session = useSession();

  useEffect(() => {
    const { google } = window;
    if (!isLoading && !session.user) {
      if (google) {
        google.accounts.id.initialize({
          client_id: googleClientId,
          itp_support: true,
          use_fedcm_for_prompt: true,
          callback: async (response: any) => {
            setIsLoading(true);
            // Here we call our Provider with the token provided by google
            await onetapAction(response.credential);
            setIsLoading(false);
            window.location.reload();
          },
        });

        // Handle Google One Tap
        google.accounts.id.prompt();
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading, session.user]);
};

export default useOnetap;
