import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
    Container, Typography, Box, Paper, Divider, Grid, Table, 
    TableBody, TableCell, TableContainer, TableHead, TableRow, 
    Button, CircularProgress, Alert, Chip, Fade, Stack, Avatar 
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import api from '../store/api';
import Header from '../components/Layout/Header';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

// Branding Palette from Reference
const BRAND = {
    primary: '#eb4d4b',    // Coral Red
    secondary: '#f0932b',  // Golden Orange
    bg: '#fffaf0',         // Soft Cream
    surface: '#ffffff',
    text: '#2d3436'
};

const OrderDetailsPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchOrderDetails = async () => {
            try {
                const response = await api.get(`/orders/${id}`);
                setOrder(response.data);
            } catch (err) {
                setError('Failed to load order details. It may not exist or you may not have permission to view it.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchOrderDetails();
    }, [id]);

    const downloadPDF = () => {
        const doc = new jsPDF();
        
        // Header
        doc.setFontSize(20);
        doc.text('Yummy-Tummy Invoice', 105, 15, { align: 'center' });
        
        doc.setFontSize(12);
        doc.text(`Order ID: #${order.id}`, 14, 30);
        doc.text(`Date: ${new Date(order.createdAt).toLocaleString()}`, 14, 37);
        doc.text(`Customer: ${order.customerName || 'Customer'}`, 14, 44);
        doc.text(`Order Type: ${order.orderType}`, 14, 51);
        
        if (order.orderType === 'DELIVERY') {
            doc.text(`Address: ${order.deliveryAddress}`, 14, 58);
        }

        // Table
        const tableColumn = ["Item Name", "Quantity", "Price", "Total"];
        const tableRows = [];

        order.items.forEach(item => {
            const rowData = [
                item.name,
                item.quantity,
                `INR ${item.price.toFixed(2)}`,
                `INR ${(item.price * item.quantity).toFixed(2)}`
            ];
            tableRows.push(rowData);
        });

        autoTable(doc, {
            startY: 70,
            head: [tableColumn],
            body: tableRows,
        });

        // Totals and Bill Section
        const finalY = doc.lastAutoTable.finalY || 70;
        let currentY = finalY + 15;

        // Bill Summary (Left Side)
        doc.setFont('helvetica', 'bold');
        doc.text('Bill Details', 14, currentY);
        doc.setFont('helvetica', 'normal');
        doc.text(`Payment Status: ${order.paymentStatus}`, 14, currentY + 7);
        doc.text(`Payment Method: ${order.paymentMethod}`, 14, currentY + 14);

        // Price breakdown (Right Side)
        doc.text(`Subtotal: INR ${order.subtotal.toFixed(2)}`, 140, currentY);
        currentY += 7;

        if (order.discountAmount > 0) {
            doc.setTextColor(0, 128, 0); // Green
            doc.text(`Discount (${order.couponCode}): - INR ${order.discountAmount.toFixed(2)}`, 140, currentY);
            doc.setTextColor(0, 0, 0); // Reset to Black
            currentY += 7;
        }

        doc.text(`GST (18%): INR ${order.gstAmount.toFixed(2)}`, 140, currentY);
        currentY += 10;

        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.text(`Grand Total: INR ${order.totalPrice.toFixed(2)}`, 140, currentY);

        // Footer
        doc.setFontSize(10);
        doc.setFont('helvetica', 'italic');
        doc.text('Thank you for your order!', 105, 280, { align: 'center' });

        doc.save(`YummyTummy_Order_${order.id}.pdf`);
    };

    const getStatusColor = (status) => {
        switch(status) {
            case 'DELIVERED': case 'SERVED': case 'COMPLETED': return { bg: '#ebfbee', text: '#15803d', border: '#bbf7d0' };
            case 'PENDING': return { bg: '#fffaf0', text: '#9a3412', border: '#ffedd5' };
            case 'REJECTED': case 'CANCELLED': return { bg: '#fff5f5', text: '#c53030', border: '#fed7d7' };
            default: return { bg: '#f0f9ff', text: '#0369a1', border: '#e0f2fe' };
        }
    };

    if (loading) return (
        <Box sx={{ backgroundColor: BRAND.bg, minHeight: '100vh' }}>
            <Header />
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 15 }}>
                <CircularProgress sx={{ color: BRAND.primary }} />
                <Typography sx={{ mt: 2, fontWeight: 700, color: BRAND.primary }}>Loading receipt...</Typography>
            </Box>
        </Box>
    );

    if (error) return (
        <Box sx={{ backgroundColor: BRAND.bg, minHeight: '100vh' }}>
            <Header />
            <Container maxWidth="md" sx={{ mt: 8 }}>
                <Alert severity="error" sx={{ borderRadius: 4 }}>{error}</Alert>
                <Button startIcon={<ArrowBackIcon />} onClick={() => navigate('/orders')} sx={{ mt: 3, fontWeight: 700 }}>
                    Back to Orders
                </Button>
            </Container>
        </Box>
    );

    const statusStyle = getStatusColor(order.orderStatus);

    return (
        <Box sx={{ backgroundColor: BRAND.bg, minHeight: '100vh', pb: 10 }}>
            <Header />
            <Container maxWidth="md" sx={{ mt: { xs: 4, md: 6 } }}>
                <Fade in={true} timeout={600}>
                    <Box>
                        <Button 
                            startIcon={<ArrowBackIcon />} 
                            onClick={() => navigate('/orders')} 
                            sx={{ mb: 3, fontWeight: 800, color: BRAND.text, '&:hover': { bgcolor: 'rgba(0,0,0,0.05)' } }}
                        >
                            Back to Orders
                        </Button>

                        <Paper 
                            elevation={0} 
                            sx={{ 
                                p: { xs: 3, md: 5 }, 
                                borderRadius: 6,
                                boxShadow: '0 20px 40px rgba(0,0,0,0.06)',
                                border: '1px solid rgba(0,0,0,0.03)',
                                backgroundColor: BRAND.surface,
                                position: 'relative',
                                overflow: 'hidden'
                            }}
                        >
                            {/* Decorative accent top border */}
                            <Box sx={{ position: 'absolute', top: 0, left: 0, right: 0, height: 6, bgcolor: BRAND.primary }} />

                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 2, mb: 4 }}>
                                <Stack direction="row" spacing={2} alignItems="center">
                                    <Avatar sx={{ bgcolor: 'rgba(235, 77, 75, 0.1)', color: BRAND.primary, width: 50, height: 50 }}>
                                        <ReceiptLongIcon />
                                    </Avatar>
                                    <Box>
                                        <Typography variant="h4" sx={{ fontWeight: 900, color: BRAND.text }}>
                                            Invoice <span style={{ color: BRAND.primary }}>#{order.id}</span>
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            {new Date(order.createdAt).toLocaleString()}
                                        </Typography>
                                    </Box>
                                </Stack>
                                
                                {order.orderStatus !== 'REJECTED' && (
                                    <Button 
                                        variant="contained" 
                                        startIcon={<FileDownloadIcon />} 
                                        onClick={downloadPDF}
                                        sx={{ 
                                            bgcolor: BRAND.secondary, 
                                            borderRadius: 3,
                                            fontWeight: 800,
                                            textTransform: 'none',
                                            boxShadow: '0 8px 15px rgba(240, 147, 43, 0.3)',
                                            '&:hover': { bgcolor: '#e67e22' }
                                        }}
                                    >
                                        Download PDF
                                    </Button>
                                )}
                            </Box>

                            <Grid container spacing={4} sx={{ mb: 5 }}>
                                <Grid item xs={12} sm={6}>
                                    <Box sx={{ p: 2.5, bgcolor: '#f8f9fa', borderRadius: 4, height: '100%' }}>
                                        <Typography variant="subtitle2" color="text.secondary" sx={{ fontWeight: 700, mb: 1.5, letterSpacing: 1 }}>ORDER INFO</Typography>
                                        <Typography variant="body1" sx={{ mb: 1, fontWeight: 600 }}>{order.customerName || 'Walk-in Guest'}</Typography>
                                        <Stack direction="row" alignItems="center" spacing={1} sx={{ mt: 2 }}>
                                            <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600 }}>Status:</Typography>
                                            <Chip 
                                                label={order.orderStatus.replace(/_/g, ' ')} 
                                                size="small" 
                                                sx={{ 
                                                    bgcolor: statusStyle.bg, 
                                                    color: statusStyle.text, 
                                                    fontWeight: 800,
                                                    border: `1px solid ${statusStyle.border}`
                                                }} 
                                            />
                                        </Stack>
                                    </Box>
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <Box sx={{ p: 2.5, bgcolor: '#f8f9fa', borderRadius: 4, height: '100%' }}>
                                        <Typography variant="subtitle2" color="text.secondary" sx={{ fontWeight: 700, mb: 1.5, letterSpacing: 1 }}>DELIVERY DETAILS</Typography>
                                        <Typography variant="body1" sx={{ mb: 1, fontWeight: 600 }}>
                                            Type: <span style={{ color: BRAND.primary }}>{order.orderType}</span>
                                        </Typography>
                                        {order.orderType === 'DELIVERY' && (
                                            <>
                                                <Typography variant="body2" sx={{ mb: 0.5 }}>{order.deliveryAddress}</Typography>
                                                <Typography variant="body2" color="text.secondary">Phone: {order.contactNumber}</Typography>
                                            </>
                                        )}
                                    </Box>
                                </Grid>
                            </Grid>

                            <Typography variant="h6" sx={{ fontWeight: 900, mb: 2, color: BRAND.text }}>Order Summary</Typography>
                            
                            <TableContainer sx={{ mb: 5, borderRadius: 3, border: '1px solid rgba(0,0,0,0.05)' }}>
                                <Table>
                                    <TableHead>
                                        <TableRow sx={{ bgcolor: '#f8f9fa' }}>
                                            <TableCell sx={{ fontWeight: 800, color: 'text.secondary' }}>ITEM NAME</TableCell>
                                            <TableCell align="center" sx={{ fontWeight: 800, color: 'text.secondary' }}>QTY</TableCell>
                                            <TableCell align="right" sx={{ fontWeight: 800, color: 'text.secondary' }}>PRICE</TableCell>
                                            <TableCell align="right" sx={{ fontWeight: 800, color: 'text.secondary' }}>TOTAL</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {order.items.map((item) => (
                                            <TableRow key={item.id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                                <TableCell sx={{ fontWeight: 700 }}>{item.name}</TableCell>
                                                <TableCell align="center" sx={{ fontWeight: 700, color: BRAND.secondary }}>{item.quantity}x</TableCell>
                                                <TableCell align="right" sx={{ color: 'text.secondary' }}>₹{item.price.toFixed(2)}</TableCell>
                                                <TableCell align="right" sx={{ fontWeight: 800 }}>₹{(item.price * item.quantity).toFixed(2)}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>

                            <Grid container spacing={4} alignItems="flex-end">
                                <Grid item xs={12} sm={6}>
                                    <Box sx={{ display: 'flex', gap: 2 }}>
                                        <Box sx={{ p: 2, border: '1px dashed #ccc', borderRadius: 3, flex: 1 }}>
                                            <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700 }}>PAYMENT STATUS</Typography>
                                            <Typography variant="body1" sx={{ fontWeight: 800 }}>{order.paymentStatus}</Typography>
                                        </Box>
                                        <Box sx={{ p: 2, border: '1px dashed #ccc', borderRadius: 3, flex: 1 }}>
                                            <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700 }}>PAYMENT METHOD</Typography>
                                            <Typography variant="body1" sx={{ fontWeight: 800 }}>{order.paymentMethod}</Typography>
                                        </Box>
                                    </Box>
                                </Grid>
                                
                                <Grid item xs={12} sm={6}>
                                    <Box sx={{ p: 3, bgcolor: '#fff9ef', borderRadius: 4, border: `2px dashed ${BRAND.secondary}40` }}>
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1.5 }}>
                                            <Typography color="text.secondary" sx={{ fontWeight: 600 }}>Subtotal</Typography>
                                            <Typography sx={{ fontWeight: 700 }}>₹{order.subtotal.toFixed(2)}</Typography>
                                        </Box>
                                        
                                        {order.discountAmount > 0 && (
                                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1.5, color: '#15803d' }}>
                                                <Typography sx={{ fontWeight: 600 }}>Discount ({order.couponCode})</Typography>
                                                <Typography sx={{ fontWeight: 800 }}>- ₹{order.discountAmount.toFixed(2)}</Typography>
                                            </Box>
                                        )}

                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                                            <Typography color="text.secondary" sx={{ fontWeight: 600 }}>GST (18%)</Typography>
                                            <Typography sx={{ fontWeight: 700 }}>₹{order.gstAmount.toFixed(2)}</Typography>
                                        </Box>
                                        
                                        <Divider sx={{ my: 2, borderStyle: 'dashed' }} />
                                        
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <Typography variant="h6" sx={{ fontWeight: 900 }}>Grand Total</Typography>
                                            <Typography variant="h5" sx={{ fontWeight: 900, color: BRAND.primary }}>
                                                ₹{order.totalPrice.toFixed(2)}
                                            </Typography>
                                        </Box>
                                    </Box>
                                </Grid>
                            </Grid>
                        </Paper>
                    </Box>
                </Fade>
            </Container>
        </Box>
    );
};

export default OrderDetailsPage;