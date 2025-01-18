import React from 'react';
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Box,
  Card,
  CardContent,
  Chip,
  Tooltip
} from '@mui/material';
import { styled } from '@mui/material/styles';

const StyledCard = styled(Card)({
  backgroundColor: '#ffffff',
  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
});

const StyledTableCell = styled(TableCell)({
  padding: '8px 16px',
  height: '40px',
});

const StyledHeaderCell = styled(TableCell)({
  backgroundColor: '#f5f5f5',
  fontWeight: 600,
  color: '#2c3e50',
  padding: '8px 16px',
  height: '40px',
});

const TotalBox = styled(Box)({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '12px 16px',
  backgroundColor: '#f8f9fa',
  border: '1px solid #e9ecef',
  borderRadius: '4px',
  marginTop: '12px',
});

const ReferralCommissionTable = ({ referListData, totalCommission }) => {
  return (
    <StyledCard>
      <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
        <Typography 
          variant="h6" 
          sx={{ 
            fontWeight: 600,
            color: '#1a365d',
            mb: 1.5,
            fontSize: '1rem'
          }}
        >
          Thống kê khuyến mãi của bạn <br/> <span style={{fontWeight:400,fontStyle:'italic',fontSize:12}}>(*Được áp dụng khi mua gói)</span>
        </Typography>
        
        <TableContainer 
          component={Paper} 
          sx={{ 
            boxShadow: 'none',
            border: '1px solid #e0e0e0',
            borderRadius: 1,
            height: '300px', // Chiều cao cố định cho container
            position: 'relative'
          }}
        >
          <Table size="small" stickyHeader>
            <TableHead>
              <TableRow>
                <StyledHeaderCell 
                  sx={{ 
                    backgroundColor: '#f5f5f5',
                    position: 'sticky',
                    top: 0,
                    zIndex: 1
                  }}
                >
                  Tài khoản
                </StyledHeaderCell>
                <Tooltip title="Phần trăm khuyến mãi được hưởng khi giới thiệu người dùng" placement="top">
                  <StyledHeaderCell 
                    align="right"
                    sx={{ 
                      backgroundColor: '#f5f5f5',
                      position: 'sticky',
                      top: 0,
                      zIndex: 1
                    }}
                  >
                    % Khuyến mãi
                  </StyledHeaderCell>
                </Tooltip>
              </TableRow>
            </TableHead>
            <TableBody>
              {referListData.map((row, index) => (
                <TableRow 
                  key={index}
                  sx={{ 
                    '&:nth-of-type(odd)': { backgroundColor: '#fafafa' },
                    '&:hover': { backgroundColor: '#f5f5f5' }
                  }}
                >
                  <StyledTableCell>
                    <Typography sx={{ 
                      fontWeight: 500,
                      color: '#2d3748',
                      fontSize: '0.875rem'
                    }}>
                      {row.username}
                    </Typography>
                  </StyledTableCell>
                  <StyledTableCell align="right">
                    <Tooltip title="Phần trăm hoa hồng được hưởng từ người dùng được giới thiệu">
                      <Chip
                        label={`${(row.commissionRate * 100)}%`}
                        sx={{
                          backgroundColor: '#e3f2fd',
                          color: '#1976d2',
                          fontWeight: 600,
                          height: '24px',
                          fontSize: '0.75rem'
                        }}
                        size="small"
                      />
                    </Tooltip>
                  </StyledTableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <TotalBox>
          <Typography 
            sx={{ 
              color: '#2c3e50',
              fontWeight: 500,
              fontSize: '0.875rem'
            }}
          >
            Tổng % Khuyến mãi
          </Typography>
          <Typography 
            sx={{ 
              fontWeight: 600,
              color: '#1976d2',
              fontSize: '0.875rem'
            }}
          >
            {(totalCommission * 100)}%
          </Typography>
        </TotalBox>
      </CardContent>
    </StyledCard>
  );
};

export default ReferralCommissionTable;