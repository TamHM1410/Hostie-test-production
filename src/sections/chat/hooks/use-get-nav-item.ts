// types
import { IChatConversation } from 'src/types/chat';

// ----------------------------------------------------------------------

type Props = {
  currentUserId: string;
  conversation: IChatConversation|any
};

export default function useGetNavItem({ currentUserId, conversation }: Props) {
    const { messages, participants } = conversation;
 let a:any=''
  // const participantsInConversation = participants.filter(
  //   (participant=[]) => participant.id !== currentUserId
  // );

  // const lastMessage = messages[messages.length - 1];
  const lastMessage = conversation?.message;


  // const group = participantsInConversation.length > 1;

  // const displayName = participantsInConversation.map((participant) => participant.name).join(', ');

  // const hasOnlineInGroup = group
  //   ? participantsInConversation.map((item) => item.status).includes('online')
  //   : false;

  // let displayText = '';

  // if (lastMessage) {
  //   const sender = lastMessage.senderId === currentUserId ? 'You: ' : '';

  //   const message = lastMessage.contentType === 'image' ? 'Sent a photo' : lastMessage.body;

  //   displayText = `${sender}${message}`;
  // }

  // return {
    // group,
    // displayName,
    // displayText,
    // participants: participantsInConversation,
    // lastActivity: lastMessage.createdAt,
    // hasOnlineInGroup,
  // };
  return {
    group:'',
    displayName:conversation?.username,
    displayText:conversation?.message,
    participants: [{
      name:'hihi',
      avatar:'',
      status:'active'
    }],
    lastActivity: '',
    hasOnlineInGroup:'',
  }
}
