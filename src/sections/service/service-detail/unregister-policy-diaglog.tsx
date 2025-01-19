import React, { useState } from 'react';
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
} from '@mui/material';
import { useParams } from 'next/navigation';

import { LoadingButton } from '@mui/lab';

import { unregisterPolicy } from 'src/api/cancelPolicy';

import { useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';

const UnregisterPolicy: React.FC = ({ open, setOpen, cancel_policy_id }: any) => {
  const { id } = useParams<any>();

  const queryClient = useQueryClient();
  const [isLoading, setIsLoading] = useState(false);

  const handleClose = async () => {
    setIsLoading(true);
    try {
      await unregisterPolicy(Number(id), cancel_policy_id);
      queryClient.invalidateQueries(['residencePolicy'] as any);
      setOpen(false);
      toast.success('Hủy thành công')
    } catch (error) {
      setIsLoading(false);
      toast.error(' Có lỗi xảy ra')
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{'Xác nhận hủy bỏ chính sách khỏi căn hộ'}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Khi hủy bỏ chính sách khỏi căn hộ ,căn hộ này sẽ được áp dụng phí hủy mặc định 100%.
            <br />
            Thao tác này không thể thực hiện lại
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={()=>setOpen(false)} color="primary">
            Hủy
          </Button>
          <LoadingButton
            onClick={handleClose}
            color="error"
            autoFocus
            type="button"
            loading={isLoading}
          >
            Đồng ý
          </LoadingButton>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default UnregisterPolicy;
