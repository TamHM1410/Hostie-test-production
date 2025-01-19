import React, { useState } from 'react';
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
  Box,
} from '@mui/material';

import { get_all_policy } from 'src/api/cancelPolicy';
import { useQuery } from '@tanstack/react-query';

import ServicePolicyList from '../service/service-detail/service-policy-list';

const PolicyDialog: React.FC = ({ open, setOpen, residence_id }: any) => {
  const { data, isLoading } = useQuery({
    queryKey: ['policy', residence_id],
    queryFn: () => get_all_policy(residence_id),
  });

  console.log(data, 'data');
  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{'Chính sách hủy của căn hộ'}</DialogTitle>
        <DialogContent>
          {data !== null ? (
            <Box sx={{ width: 'auto' }}>
              <ServicePolicyList data={data} type="cancelview" />
            </Box>
          ) : (
            <Box sx={{width:400}}> Phí hủy mặc định là 100%</Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Hủy
          </Button>
          <Button onClick={handleClose} color="primary" autoFocus>
            Đồng ý
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default PolicyDialog;
