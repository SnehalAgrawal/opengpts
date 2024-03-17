import { useEffect, useMemo, useState } from "react";
import { Message } from "./useChatList";
import { StreamState } from "./useStreamState";
import { FetchWithToken, useFetch } from "./useFetch";

async function getMessages(fetchWithToken: FetchWithToken, threadId: string) {
  const { messages, resumeable } = await fetchWithToken(
    `/threads/${threadId}/messages`,
    {
      headers: {
        Accept: "application/json",
      },
    },
  ).then((r) => r.json());
  return { messages, resumeable };
}

export function useChatMessages(
  threadId: string | null,
  stream: StreamState | null,
  stopStream?: (clear?: boolean) => void,
): { messages: Message[] | null; resumeable: boolean } {
  const [messages, setMessages] = useState<Message[] | null>(null);
  const [resumeable, setResumeable] = useState(false);
  const fetchWithToken = useFetch();

  useEffect(() => {
    async function fetchMessages() {
      if (threadId) {
        const { messages, resumeable } = await getMessages(
          fetchWithToken,
          threadId,
        );
        setMessages(messages);
        setResumeable(resumeable);
      }
    }

    fetchMessages();

    return () => {
      setMessages(null);
    };
  }, [threadId]);

  useEffect(() => {
    async function fetchMessages() {
      if (threadId) {
        const { messages, resumeable } = await getMessages(
          fetchWithToken,
          threadId,
        );
        setMessages(messages);
        setResumeable(resumeable);
        stopStream?.(true);
      }
    }

    if (stream?.status !== "inflight") {
      setResumeable(false);
      fetchMessages();
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stream?.status]);

  return useMemo(
    () => ({
      messages: stream?.merge
        ? [...(messages ?? []), ...(stream.messages ?? [])]
        : stream?.messages ?? messages,
      resumeable,
    }),
    [messages, stream?.merge, stream?.messages, resumeable],
  );
}
