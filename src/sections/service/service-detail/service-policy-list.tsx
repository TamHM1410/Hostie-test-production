'use client ';

//  @hook
import { useState, useCallback, useMemo } from 'react';
import { useQueryClient } from '@tanstack/react-query';

//  @mui
import {
  Card,
  CardContent,
  Button,
  Typography,
  Grid,
  Box,
  Tooltip,
  IconButton,
  Modal,
  LinearProgress,
} from '@mui/material';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';

//  @component
import AddNewPolicyView from './add-cancel-policy-view';
import DetailCancelPolicyForm from './detail-cancel-policy-form';

//  @lib
import toast from 'react-hot-toast';

//  @api

import { map_residence_policy, get_all_policy } from 'src/api/cancelPolicy';

const getColor = (percentage: any) => {
  if (percentage <= 10) return 'blue';
  if (percentage <= 30) return 'yellow';
  if (percentage <= 60) return 'orange';
  return 'red';
};

const PolicyModal = ({ open, setOpen, cancel_policy_id, residence_id = 0 }: any) => {

  const queryClient = useQueryClient();

  const [isLoading,setIsLoading]=useState(false)

  const handleConfirm = async (e: any) => {
    try {

      setIsLoading(!isLoading)
      let payload = {
        cancel_policy_id: cancel_policy_id,
        map_residences: [{ residence_id: Number(residence_id), is_default: true }],
      };

      const res = await get_all_policy(residence_id);

    
      await map_residence_policy(payload);
      queryClient.invalidateQueries(['residencePolicy'] as any);
      toast.success('Cập nhật thành công');
      setOpen(!open);
      setIsLoading(false)

    } catch (error) {
      toast.error('Có lỗi xảy ra vui lòng thử lại');
      setIsLoading(false)

    }
  };

  return (
    <>
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
      >
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 'auto',
            height: 'auto',
            minWidth: { xs: 300, md: 400, lg: 600 },
            bgcolor: 'background.paper',
            borderRadius: 2,
            boxShadow: 24,
            p: 4,
            textAlign: 'center',
          }}
        >
          <Typography id="modal-title" variant="h6" component="h2">
            Xác nhận sử dụng chính sách hủy này cho căn hộ của bạn{' '}
          </Typography>
          <Box sx={{ py: 2, gap: 2, display: 'flex', justifyContent: 'end' }}>
            <Button variant="contained" onClick={() => setOpen(!open)}>
              Hủy bỏ
            </Button>
            <Button color="error" variant="contained" onClick={(e) => handleConfirm(e)} disabled={isLoading}>
              Xác nhận
            </Button>
          </Box>
        </Box>
      </Modal>
    </>
  );
};

const PolicyProgress = ({ item }: any) => {
  const stages = useMemo(() => {
    if (item && item?.length > 0) {
      const res = item?.map((item: any) => {
        return {
          label: `Từ ${item?.from || 0} ${
            item?.time_unit_from === 'hours' ? 'giờ' : 'ngày'
          } Đến ${item?.to} ${item?.time_unit_to === 'hours' ? 'giờ' : 'ngày'}`,
          percentage: item?.fee,
        };
      });
      return res;
    }
  }, [item]);

  const totalPercentage = stages.reduce((acc, stage) => acc + stage.percentage, 0);

  return (
    <>
      {stages.map((stage: any, index: number) => (
        <Tooltip key={index} title={`${stage.label}: Phí hủy ${stage.percentage}%`} arrow>
          <Box
            sx={{
              flex: stage.percentage / totalPercentage,
              bgcolor: stage.color || getColor(stage.percentage), // Dùng màu có sẵn hoặc tự động
              height: 10,
              '&:not(:last-child)': { marginRight: 0.5 },
            }}
          />
          <Box sx={{ fontSize: 14 }}>Phí hủy : {stage.percentage}%</Box>
        </Tooltip>
      ))}
    </>
  );
};

export default function ServicePolicyList({ data, type = '', id }: any) {
  const uniqueObjects = useMemo(() => {
    if (data && Array.isArray(data)) {
      // Sử dụng Map để đảm bảo mỗi name chỉ có 1 object với id lớn nhất
      const map = new Map();

      data.forEach((item: any) => {
        if (!map.has(item.name) || map.get(item.name).id < item.id) {
          map.set(item.name, item); // Cập nhật object nếu id lớn hơn
        }
      });

      // Trả về danh sách object từ Map
      return Array.from(map.values());
    }

    return [];
  }, [data]);

  const cancel_policies = useMemo(() => {
    if (uniqueObjects && Array.isArray(uniqueObjects) && uniqueObjects.length > 0) {
      let newArr = uniqueObjects.map((item: any) => {
        return item?.cancel_policies;
      });
      return newArr;
    }
  }, [uniqueObjects]);

  const stages = useMemo(() => {
    if (cancel_policies && cancel_policies?.length > 0) {
      const res = cancel_policies[0]?.map((item: any) => {
        return {
          label: `Từ ${item?.from || 0} ${
            item?.time_unit_from === 'hours' ? 'giờ' : 'ngày'
          } Đến ${item?.to} ${item?.time_unit_to === 'hours' ? 'giờ' : 'ngày'}`,
          percentage: item?.fee,
        };
      });
      return res;
    }
  }, [cancel_policies]);

  // const totalPercentage = stages.reduce((acc, stage) => acc + stage.percentage, 0);

  const [cancel_policy_id, setCancel_policy_id] = useState(0);

  const [isAddNew, setIsAddNew] = useState(false);

  const [isSelected, setIsSelected] = useState(false);

  const [currentSelected, setCurrentSelected] = useState<any>(null);

  const [open, setOpen] = useState(false);

  const handleViewDetail = useCallback(
    (item: any) => {
      if (currentSelected !== item) {
        // Kiểm tra nếu item không giống item hiện tại
        setCurrentSelected(item);
      }
      setIsSelected(true);
    },
    [currentSelected]
  );

  return (
    <>
      <Box sx={{ flexGrow: 1, padding: 2 }}>
        {!isAddNew && type === '' && (
          <Button
            variant="contained"
            color="primary"
            sx={{ my: 2 }}
            onClick={() => setIsAddNew(!isAddNew)}
          >
            {' '}
            Thêm mới chính sách hủy
          </Button>
        )}
        {isAddNew && <AddNewPolicyView isAddNew={isAddNew} setAddNew={setIsAddNew} />}

        {isSelected && !isAddNew && (
          <DetailCancelPolicyForm
            data={currentSelected}
            isSelected={isSelected}
            setIsSelected={setIsSelected}
            type={type}
          />
        )}
        {!isAddNew && !isSelected && (
          <Grid container spacing={2} sx={{ py: 5 }}>
            {Array.isArray(uniqueObjects) &&
              uniqueObjects.length > 0 &&
              uniqueObjects.map((item: any, index: any) => {
                return (
                  <Grid item xs={12} sm={type==='cancelview' ? 12:6} md={type==='cancelview' ?12 :3} key={index}>
                    <Card
                      sx={{
                        maxWidth: 500,
                        transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out', // Hiệu ứng khi hover
                        '&:hover': {
                          transform: 'scale(1.05)', // Phóng to card khi hover
                          boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)', // Tạo bóng khi hover
                        },
                        width:'auto'
                      }}
                    >
                      <CardContent>
                        <Typography gutterBottom variant="h5" component="div">
                          {item?.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {item?.description}
                        </Typography>

                        <Box sx={{ display: 'flex', alignItems: 'center', pt: 3 }}>
                          <PolicyProgress item={item?.cancel_policies} />
                        </Box>
                        <Box sx={{ py: 2 }}>
                          <span style={{ fontWeight: 700 }}>Ghi chú :</span>
                          Phí hủy được tính trên giá gốc ,bao gồm hoa hồng
                        </Box>
                      </CardContent>
                      <Button
                        size="small"
                        color="primary"
                        sx={{ margin: 2 }}
                        onClick={() => handleViewDetail(item)}
                      >
                        Xem chi tiết
                      </Button>
                      {type === 'update' && (
                        <Tooltip title="Chọn chính sách này" arrow>
                          <IconButton
                            color="primary"
                            onClick={() => {
                              setOpen(!open);
                              setCancel_policy_id(item?.id);
                            }}
                          >
                            <CheckBoxOutlineBlankIcon />
                          </IconButton>
                        </Tooltip>
                      )}
                    </Card>
                  </Grid>
                );
              })}
          </Grid>
        )}
      </Box>
      <PolicyModal
        open={open}
        setOpen={setOpen}
        cancel_policy_id={cancel_policy_id}
        residence_id={id}
      />
    </>
  );
}
