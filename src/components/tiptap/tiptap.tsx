'use client';

//  @hook
import { useState, useRef, useMemo, useEffect } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import { useForm } from 'react-hook-form';
import { icons } from 'src/utils/chatIcon';
import { v4 as uuidv4 } from 'uuid';
import { sendNewMessage } from 'src/api/conversations';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useQueryClient } from '@tanstack/react-query';

//  @Component
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import PermMediaIcon from '@mui/icons-material/PermMedia';
import IconButton from '@mui/material/IconButton';
import InsertEmoticonIcon from '@mui/icons-material/InsertEmoticon';
import Popover from '@mui/material/Popover';
import Typography from '@mui/material/Typography';
import SendIcon from '@mui/icons-material/Send';
import Box from '@mui/material/Box';
import Placeholder from '@tiptap/extension-placeholder';
import CancelIcon from '@mui/icons-material/Cancel';
import ImageL from 'next/image';
import AddToPhotosIcon from '@mui/icons-material/AddToPhotos';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';

const CustomImage = Image.configure({
  HTMLAttributes: {
    style: `
      max-width: 150px;
      max-height: 150px;
      object-fit: contain;
      display: inline-block;
      margin: 2px;
      vertical-align: middle;
      outline: none;
    `,
  },
});

const customPlaceholder = Placeholder.configure({
  placeholder: 'Aa',
  showOnlyWhenEditable: true,
  showOnlyCurrent: false,
  emptyEditorClass: 'is-empty',
  emptyNodeClass: 'is-empty',
});

interface TiptapProps {
  setIsUploadImage: (value: boolean) => void;
  group_id?: string;
  id?: string;
  setDetailMessage: (messages: any[]) => void;
  messageRef: React.MutableRefObject<any[]>;
  listNewMessageRef: React.MutableRefObject<any[]>;
  checkNewGroup: {
    id?: string;
    users?: Array<{ id: number }>;
  };
}

const Tiptap = ({
  setIsUploadImage,
  group_id,
  id,
  setDetailMessage,
  messageRef,
  listNewMessageRef,
  checkNewGroup,
}: TiptapProps) => {
  const { data: session } = useSession();
  const router = useRouter();
  const queryClient = useQueryClient();

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [imagePreviews, setImagePreviews] = useState<
    Array<{
      file_name: string;
      file_type: string;
      thumb_name?: string;
    }>
  >([]);

  const isExistingGroup = useMemo(() => {
    if (Array.isArray(checkNewGroup?.users) && checkNewGroup.users.length > 0 && id) {
      const check = checkNewGroup.users.filter((item) => item?.id === Number(id));
      return Array.isArray(check) && check.length > 0;
    }
    return false;
  }, [checkNewGroup?.users, id]);

  useEffect(() => {
    if (isExistingGroup && checkNewGroup?.id) {
      router.push(`/dashboard/chat/?group_id=${checkNewGroup.id}`);
    }
  }, [isExistingGroup, checkNewGroup?.id, router]);

  const {
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm();

  const onEditorUpdate = (content: string) => {
    setValue('message', content.replace(/<\/?p>/g, ''), { shouldValidate: true });
  };

  const editor = useEditor({
    extensions: [StarterKit, CustomImage, customPlaceholder],
    content: '',
    editorProps: {
      attributes: {
        style: `
          display: flex;
          flex-direction: column;
          padding: 4px;
          padding-left: 12px;
          max-height: 80px;
          overflow-y: scroll;
          border: 0px solid #e0e0e0;
          outline: none; 
          &:focus {
            outline: none !important;
            border: none !important;
          }
        `
          .replace(/\s+/g, ' ')
          .trim(),
      },
      handlePaste: (view, event) => {
        const items = Array.from(event.clipboardData?.items || []);
        const imageItem = items.find((item) => item.type.indexOf('image') === 0);

        if (imageItem) {
          event.preventDefault();
          const blob = imageItem.getAsFile();
          if (blob) {
            const reader = new FileReader();
            reader.onload = (e) => {
              const result = e.target?.result;
              if (typeof result === 'string') {
                const rs = {
                  file_name: result,
                  file_type: 'image',
                };
                setImagePreviews((prev) => [...prev, rs]);
                setIsUploadImage(true);
              }
            };
            reader.readAsDataURL(blob);
          }
          return true;
        }
        return false;
      },
    },
    onUpdate: ({ editor }) => {
      onEditorUpdate(editor.getHTML());
    },
  });

  const handleOpenIconMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseIconMenu = () => {
    setAnchorEl(null);
  };

  const handleInsertIcon = (icon: string) => {
    editor?.chain().focus().insertContent(icon).run();
    handleCloseIconMenu();
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>, type: 'image' | 'doc') => {
    const files = event.target.files;
    if (files) {
      Array.from(files).forEach((file) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          const result = e.target?.result;
          if (result) {
            const rs = {
              file_name: result as string,
              file_type: type,
              thumb_name: file.name,
            };
            setImagePreviews((prev) => [...prev, rs]);
            setIsUploadImage(true);
          }
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const handleRemove = (index: number) => {
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
    if (imagePreviews.length === 1) {
      setIsUploadImage(false);
    }
  };

  const clearEditor = () => {
    editor?.commands.clearContent();
    reset();
    setImagePreviews([]);
    setIsUploadImage(false);
  };

  const onSubmit = async (data: { message?: string }) => {
    try {
      const uuid = uuidv4();
      const form = new FormData();

      if (data.message) {
        form.append('message', data.message);
      }
      if (id) {
        form.append('receiver_id', id);
      }
      if (group_id) {
        form.append('group_id', group_id);
      }
      form.append('uuid', uuid);

      // Handle file uploads
      await Promise.all(
        imagePreviews.map(async (image) => {
          const response = await fetch(image.file_name);
          const blob = await response.blob();
          const name_blob = `${uuid}-${Date.now()}.png`;
          const file = new File([blob], name_blob, { type: blob.type });
          form.append('files', file);
        })
      );

      if (Array.isArray(messageRef.current)) {
        const payload = {
          uuid,
          group_id,
          sender_id: Number(session?.user?.id),
          sender_avatar: '',
          receiver_id: id || null,
          message: data.message,
          created_at: 'Đang gửi',
          files: imagePreviews,
        };

        const res = await sendNewMessage(form);
        if (res) {
          queryClient.invalidateQueries(['listConversation'] as any);
          messageRef.current.push(payload);
          listNewMessageRef.current.push(payload);
          setDetailMessage([...messageRef.current]);
        }
      }

      clearEditor();
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  return (
    <Box sx={{ width: '100%', display: 'flex', flexDirection: 'row', gap: 2 }}>
      <Box sx={{ display: 'flex', width: '100%' }}>
        <Popover
          open={Boolean(anchorEl)}
          anchorEl={anchorEl}
          onClose={handleCloseIconMenu}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left',
          }}
        >
          <Box p={2}>
            <Typography variant="subtitle1">Chọn biểu tượng:</Typography>
            <Box display="flex" flexWrap="wrap" gap={1} mt={1}>
              {icons.map((icon) => (
                <Typography
                  key={icon}
                  onClick={() => handleInsertIcon(icon)}
                  style={{
                    cursor: 'pointer',
                    fontSize: '24px',
                  }}
                >
                  {icon}
                </Typography>
              ))}
            </Box>
          </Box>
        </Popover>

        <Box
          sx={{
            width: '100%',
            border: '1px solid #e0e0e0',
            color: 'black',
            fontWeight: 500,
            fontSize: '20px',
            borderRadius: '6px',
            outline: 'none',
            '& .ProseMirror': {
              outline: 'none !important',
              '&:focus': {
                outline: 'none !important',
                border: 'none !important',
              },
            },
            '& .is-empty:first-child::before': {
              content: 'attr(data-placeholder)',
              color: '#adb5bd',
              pointerEvents: 'none',
              height: '0',
              float: 'left',
            },
            '&:focus': {
              outline: 'none',
              border: '1px solid #e0e0e0',
            },
            '&:focus-within': {
              outline: 'none',
              border: '1px solid #e0e0e0',
            },
          }}
        >
          {imagePreviews.length > 0 && (
            <Box display="flex" flexWrap="wrap" gap={0.5} mt={1} sx={{ px: 1 }}>
              <Box sx={{ position: 'relative' }}>
                <Box
                  sx={{
                    padding: 0.5,
                    backgroundColor: '#e0e0e0',
                    borderRadius: 1,
                    width: 80,
                    height: 90,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <input
                    type="file"
                    accept="image/*"
                    style={{ display: 'none' }}
                    id="icon-button-file"
                    onChange={(event) => handleImageUpload(event, 'image')}
                    multiple
                  />
                  <label htmlFor="icon-button-file">
                    <IconButton component="span">
                      <AddToPhotosIcon sx={{ width: 40, height: 40 }} />
                    </IconButton>
                  </label>
                </Box>
              </Box>
              {imagePreviews.map((image, index) => (
                <Box key={index} sx={{ position: 'relative' }}>
                  {image.file_type === 'image' ? (
                    <Box
                      sx={{ padding: 0.5, backgroundColor: '#e0e0e0', borderRadius: 2, mx: 1.2 }}
                    >
                      <ImageL
                        src={image.file_name}
                        alt={`preview-${index}`}
                        width={80}
                        height={80}
                        style={{ objectFit: 'contain', margin: '1px' }}
                        loading="lazy"
                      />
                    </Box>
                  ) : (
                    <Box
                      sx={{
                        padding: 0.5,
                        backgroundColor: '#e0e0e0',
                        borderRadius: 1,
                        mx: 1.2,
                        height: 90,
                        width: 180,
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        display: 'flex',
                        alignItems: 'center',
                        fontSize: 18,
                      }}
                    >
                      <InsertDriveFileIcon /> <span>{image.thumb_name}</span>
                    </Box>
                  )}
                  <IconButton
                    color="error"
                    onClick={() => handleRemove(index)}
                    sx={{
                      position: 'absolute',
                      right: -2,
                      top: -8,
                      padding: 0,
                    }}
                  >
                    <CancelIcon />
                  </IconButton>
                </Box>
              ))}
            </Box>
          )}
          <EditorContent editor={editor} />
          <Box sx={{ display: 'flex' }}>
            <Box>
              <input
                type="file"
                accept="image/*"
                style={{ display: 'none' }}
                id="icon-button-file"
                onChange={(event) => handleImageUpload(event, 'image')}
                multiple
              />
              <label htmlFor="icon-button-file" style={{ marginLeft: '8px' }}>
                <IconButton color="primary" component="span">
                  <PermMediaIcon />
                </IconButton>
              </label>
            </Box>
            <Box>
              <IconButton
                color="secondary"
                onClick={handleOpenIconMenu}
                style={{ marginLeft: '8px' }}
              >
                <InsertEmoticonIcon />
              </IconButton>
            </Box>
            <Box>
              <input
                type="file"
                accept=".pdf, .doc, .docx"
                style={{ display: 'none' }}
                id="uploadFileDoc"
                onChange={(event) => handleImageUpload(event, 'doc')}
                multiple
              />
              <label htmlFor="uploadFileDoc" style={{ marginLeft: '8px' }}>
                <IconButton component="span">
                  <AttachFileIcon />
                </IconButton>
              </label>
            </Box>
          </Box>
        </Box>
      </Box>
      <Box>
        <IconButton color="primary" onClick={handleSubmit(onSubmit)} sx={{ width: 30, mt: 5 }}>
          <SendIcon />
        </IconButton>
      </Box>
    </Box>
  );
};
export default Tiptap
// Type guard to check if a value is a File
