import { useMemo } from 'react';
import keyBy from 'lodash/keyBy';
import useSWR, { mutate } from 'swr';
import { useQuery } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';
// utils
import axios, { endpoints, fetcher } from 'src/utils/axios';
// types
import {
  IChatMessage,
  IChatParticipant,
  IChatConversations,
  IChatConversation,
} from 'src/types/chat';
import {getListConverSationById,getDetailConverSationById} from './conversation'

// ----------------------------------------------------------------------

const options = {
  revalidateIfStale: false,
  revalidateOnFocus: false,
  revalidateOnReconnect: false,
};

export function useGetContacts() {
  const URL = [endpoints.chat, { params: { endpoint: 'contacts' } }];

  const { data, isLoading, error, isValidating } = useSWR(URL, fetcher, options);

  const memoizedValue = useMemo(
    () => ({
      contacts: (data?.contacts as IChatParticipant[]) || [],
      contactsLoading: isLoading,
      contactsError: error,
      contactsValidating: isValidating,
      contactsEmpty: !isLoading && !data?.contacts.length,
    }),
    [data?.contacts, error, isLoading, isValidating]
  );

  return memoizedValue;
}

// ----------------------------------------------------------------------

export function useGetConversations() {
  const URL = [endpoints.chat, { params: { endpoint: 'conversations' } }];

  let user_id=1
  const {data,isLoading,error,isFetching}=useQuery({
    queryKey:['listConversation'],
    queryFn:()=>getListConverSationById( user_id)

  })
  // const { data, isLoading, error, isValidating } = useSWR(URL, fetcher, options);
  
  const memoizedValue = useMemo(() => {
    const byId = keyBy(data, 'sender_id') || {};
    const allIds = Object.keys(byId) || [];

    return {
      conversations: {
        byId,
        allIds,
      } as IChatConversations,
      conversationsLoading: isLoading,
      conversationsError: error,
      conversationsValidating: isFetching,
      conversationsEmpty: !isLoading && !allIds.length,
    };
  }, [data, error, isLoading, isFetching]);

  console.log(memoizedValue)
  return memoizedValue;
}

// ----------------------------------------------------------------------

export function useGetConversation(conversationId: string) {

let receiver_id=conversationId
let sender_id=1
const {data,isLoading,error,isFetching}=useQuery({
  queryKey:['detailConversation'],
  queryFn:()=>getDetailConverSationById(sender_id,receiver_id)

})

console.log(data,'data deital')
 

  const memoizedValue = useMemo(
    () => ({
      conversation: data,
      conversationLoading: isLoading,
      conversationError: error,
      conversationValidating: isFetching,
    }),
    [data?.conversation, error, isLoading, isFetching]
  );

  return memoizedValue;
}

// ----------------------------------------------------------------------

export async function sendMessage(conversationId: string, messageData: IChatMessage) {
  const CONVERSATIONS_URL = [endpoints.chat, { params: { endpoint: 'conversations' } }];

  const CONVERSATION_URL = [
    endpoints.chat,
    {
      params: { conversationId, endpoint: 'conversation' },
    },
  ];

  /**
   * Work on server
   */
  // const data = { conversationId, messageData };
  // await axios.put(endpoints.chat, data);

  /**
   * Work in local
   */
  mutate(
    CONVERSATION_URL,
    (currentData: any) => {
      const { conversation: currentConversation } = currentData;

      const conversation = {
        ...currentConversation,
        messages: [...currentConversation.messages, messageData],
      };

      return {
        conversation,
      };
    },
    false
  );

  /**
   * Work in local
   */
  mutate(
    CONVERSATIONS_URL,
    (currentData: any) => {
      const { conversations: currentConversations } = currentData;

      const conversations: IChatConversation[] = currentConversations.map(
        (conversation: IChatConversation) =>
          conversation.id === conversationId
            ? {
                ...conversation,
                messages: [...conversation.messages, messageData],
              }
            : conversation
      );

      return {
        conversations,
      };
    },
    false
  );
}

// ----------------------------------------------------------------------

export async function createConversation(conversationData: IChatConversation) {
  const URL = [endpoints.chat, { params: { endpoint: 'conversations' } }];

  /**
   * Work on server
   */
  const data = { conversationData };
  const res = await axios.post(endpoints.chat, data);

  /**
   * Work in local
   */
  mutate(
    URL,
    (currentData: any) => {
      const conversations: IChatConversation[] = [...currentData.conversations, conversationData];
      return {
        ...currentData,
        conversations,
      };
    },
    false
  );

  return res.data;
}

// ----------------------------------------------------------------------

export async function clickConversation(conversationId: string) {
  const URL = endpoints.chat;

  /**
   * Work on server
   */
  // await axios.get(URL, { params: { conversationId, endpoint: 'mark-as-seen' } });

  /**
   * Work in local
   */
  mutate(
    [
      URL,
      {
        params: { endpoint: 'conversations' },
      },
    ],
    (currentData: any) => {
      const conversations: IChatConversations = currentData.conversations.map(
        (conversation: IChatConversation) =>
          conversation.id === conversationId ? { ...conversation, unreadCount: 0 } : conversation
      );

      return {
        ...currentData,
        conversations,
      };
    },
    false
  );
}
