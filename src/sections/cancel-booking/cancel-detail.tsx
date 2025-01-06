import React from "react";
import { Card,CardContent,Typography,Divider,Grid,TableContainer,Table,TableRow,TableCell,TableBody , Paper} from "@mui/material"

const formatCurrencyVND = (amount: number): string => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(amount);
  };

export default function CancelDetail({refunded}:any){

    return (<>
    
    <Card sx={{ maxWidth: 800, margin: 'auto', mt: 4 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Chi tiết hoàn tiền
              </Typography>

              <Divider sx={{ my: 2 }} />

              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Typography variant="body1" color="text.secondary">
                    Số tiền đã thanh toán:
                  </Typography>
                  <Typography variant="body2">
                    {formatCurrencyVND(refunded?.paid_amount)}{' '}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body1" color="text.secondary">
                    Hoàn tiền cho chủ nhà:
                  </Typography>
                  <Typography variant="body2">
                    {formatCurrencyVND(refunded?.host_refund)}
                  </Typography>
                </Grid>
              </Grid>

              <Divider sx={{ my: 2 }} />

              <Typography variant="subtitle1" gutterBottom>
                Chi tiết hoàn tiền:
              </Typography>

              <TableContainer component={Paper} sx={{ mt: 2 }}>
                <Table size="small" aria-label="refund details">
                  <TableBody>
                    {Array.isArray(refunded?.refund_detail) &&
                      refunded?.refund_detail.length > 0 &&
                      refunded?.refund_detail?.map((detail: any, index: number) => (
                        <React.Fragment key={index}>
                          <TableRow>
                            <TableCell>
                              <Typography variant="body2" fontWeight={600}>
                                Ngày đặt:
                              </Typography>
                            </TableCell>
                            <TableCell>
                              {new Date(detail.booking_date).toLocaleDateString()}
                            </TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell>
                              <Typography variant="body2" fontWeight={600}>
                                Giá đặt:
                              </Typography>
                            </TableCell>
                            <TableCell>{formatCurrencyVND(detail.booking_price)}</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell>
                              <Typography variant="body2" fontWeight={600}>
                                Phí hủy:
                              </Typography>
                            </TableCell>
                            <TableCell>{detail.cancel_fee}%</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell>
                              <Typography variant="body2" fontWeight={600}>
                                Phí hủy (cho người bán):
                              </Typography>
                            </TableCell>
                            <TableCell>
                              {formatCurrencyVND(detail.cancel_fee_currency.for_seller)}
                            </TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell>
                              <Typography variant="body2" fontWeight={600}>
                                Phí hủy (cho khách hàng):
                              </Typography>
                            </TableCell>
                            <TableCell>
                              {formatCurrencyVND(detail.cancel_fee_currency.for_customer)}
                            </TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell>
                              <Typography variant="body2" fontWeight={600}>
                                Số ngày đặt:
                              </Typography>
                            </TableCell>
                            <TableCell>{detail.total_booking_day} ngày</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell>
                              <Typography variant="body2" fontWeight={600}>
                                Hoàn tiền:
                              </Typography>
                            </TableCell>
                            <TableCell>
                              Chủ nhà: {formatCurrencyVND(detail.refund.host_refund)} | Người bán:{' '}
                              {formatCurrencyVND(detail.refund.seller_refund)}
                            </TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell colSpan={2}>
                              <Divider />
                            </TableCell>
                          </TableRow>
                        </React.Fragment>
                      ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card></>)
}