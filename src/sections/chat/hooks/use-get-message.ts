// types
import { IChatParticipant, IChatMessage } from 'src/types/chat';
///hooks
import { useSearchParams } from 'next/navigation';

// ----------------------------------------------------------------------

type Props = {
  message: IChatMessage;
  currentUserId: string;
  participants: IChatParticipant[];
};

export default function useGetMessage({ message, participants, currentUserId }: Props) {
  const searchParams = useSearchParams()
  
  const idParams = searchParams.get('id')

  const sender: any = Array.isArray(participants)
    ? participants.find((participant) => participant.id == idParams)
    : null;

  console.log('sender', sender);
  const senderDetails =
    sender?.id == currentUserId
      ? {
        type: 'receiver',
        avatarUrl: null,
        firstName: sender?.username,
        }
      : {
        type: 'me',
        firstName: sender?.username,
        
        };

  const me = senderDetails.type === 'me'  ;



  const hasImage = message.contentType === 'image';

  return {
    hasImage,
    me,
    senderDetails,
  };
}
