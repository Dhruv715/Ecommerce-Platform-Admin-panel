import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Box, Typography, Container, Grid, Stack, Divider, IconButton, Paper, Stepper, Step, StepLabel, StepContent, Button } from '@mui/material';
import { BsThreeDots, BsCart, BsCurrencyDollar, BsPeople } from 'react-icons/bs';
// import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import dayjs from 'dayjs';
import isoWeek from 'dayjs/plugin/isoWeek';

dayjs.extend(isoWeek);

function Home() {
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('Token');
        if (!token) {
          setError('Authorization token not provided');
          setLoading(false);
          return;
        }

        const [ordersRes, sellersRes, subCategoriesRes, usersRes, productsRes, categoriesRes] = await Promise.all([
          axios.get('https://ecommerce-platform-kfby.onrender.com/Admin/AllOrders', { headers: { 'auth': token } }),
          axios.get('https://ecommerce-platform-kfby.onrender.com/Admin/AllSellers', { headers: { 'auth': token } }),
          axios.get('https://ecommerce-platform-kfby.onrender.com/Admin/SubCategory', { headers: { 'auth': token } }),
          axios.get('https://ecommerce-platform-kfby.onrender.com/Admin/AllUsers', { headers: { 'auth': token } }),
          axios.get('https://ecommerce-platform-kfby.onrender.com/Admin/AllProduct', { headers: { 'auth': token } }),
          axios.get('https://ecommerce-platform-kfby.onrender.com/Admin/Category', { headers: { 'auth': token } })
        ]);

        setData({
          orders: ordersRes.data.data,
          sellers: sellersRes.data.data,
          subCategories: subCategoriesRes.data.data,
          users: usersRes.data.data,
          products: productsRes.data.data,
          categories: categoriesRes.data.data
        });
        setLoading(false);
      } catch (err) {
        console.error(err);
        setError('An error occurred while fetching data');
        setLoading(false);
      }
    };

    fetchData();
  }, []);

 

  if (loading) {
    return <Typography>Loading...</Typography>;
  }

  if (error) {
    return <Typography>{error}</Typography>;
  }

  const { orders, sellers, users, products } = data;

  const groupByDate = (orders, format) => {
    return orders.reduce((acc, order) => {
      const date = dayjs(order.date).format(format);
      if (!acc[date]) acc[date] = 0;
      acc[date] += order.quantity;
      return acc;
    }, {});
  };

  const dailyOrders = groupByDate(orders, 'YYYY-MM-DD');
  const monthlyOrders = groupByDate(orders, 'YYYY-MM');

  const formatChartData = (data) => Object.keys(data).map(key => ({ name: key, count: data[key] }));

  const dailyOrderCounts = formatChartData(dailyOrders);
  
  const monthlyOrderCounts = formatChartData(monthlyOrders);

  return (
    <Container>
      <Grid container spacing={3}>
        <Grid item md={12} xs={12}>
          <Grid container spacing={3}>
            <Grid item sm={6} xs={12}>
              <Paper sx={{ padding: "20px" }}>
                <Stack direction="row" justifyContent="space-between" alignItems="flex-start" marginBottom="15px">
                  <Box display="flex" alignItems="center">
                    <Typography variant="h6" gutterBottom color="#000">Total Order</Typography>
                   
                  </Box>
                  <IconButton size='small'><BsThreeDots /></IconButton>
                </Stack>
                <Stack direction="row" spacing={2} alignItems="center" marginBottom="5px">
                  <Box padding="15px" backgroundColor="#f6f9ff" borderRadius="50%" lineHeight="0">
                    <BsCurrencyDollar color='#4154f1' size={35} />
                  </Box>
                  <Box>
                    <Typography variant="h5" gutterBottom marginBottom="0px" fontSize="28px" fontWeight="600">
                      {orders.length}
                    </Typography>
                    <Typography variant="overline" sx={{ textTransform: "lowercase", fontSize: "15px" }} display="flex" alignItems="center" marginBottom="0" gap={1} gutterBottom>
                      <Typography color="rgb(25,135,84)" sx={{ fontWeight: 600 }}>12%</Typography>
                      increase
                    </Typography>
                  </Box>
                </Stack>
              </Paper>
            </Grid>
            <Grid item sm={6} xs={12}>
              <Paper sx={{ padding: "20px" }}>
                <Stack direction="row" justifyContent="space-between" alignItems="flex-start" marginBottom="15px">
                  <Box display="flex" alignItems="center">
                    <Typography variant="h6" gutterBottom color="#000">Total Sellers</Typography>
                   
                  </Box>
                  <IconButton size='small'><BsThreeDots /></IconButton>
                </Stack>
                <Stack direction="row" spacing={2} alignItems="center" marginBottom="5px">
                  <Box padding="15px" backgroundColor="#f6f9ff" borderRadius="50%" lineHeight="0">
                    <BsPeople color='#4154f1' size={35} />
                  </Box>
                  <Box>
                    <Typography variant="h5" gutterBottom marginBottom="0px" fontSize="28px" fontWeight="600">
                       {sellers.length} 
                    </Typography>
                    <Typography variant="overline" sx={{ textTransform: "lowercase", fontSize: "15px" }} display="flex" alignItems="center" marginBottom="0" gap={1} gutterBottom>
                      <Typography color="rgb(25,135,84)" sx={{ fontWeight: 600 }}>12%</Typography>
                      increase
                    </Typography>
                  </Box>
                </Stack>
              </Paper>
            </Grid>
            <Grid item sm={6} xs={12}>
              <Paper sx={{ padding: "20px" }}>
                <Stack direction="row" justifyContent="space-between" alignItems="flex-start" marginBottom="15px">
                  <Box display="flex" alignItems="center">
                    <Typography variant="h6" gutterBottom color="#000">Total User</Typography>
                   
                  </Box>
                  <IconButton size='small'><BsThreeDots /></IconButton>
                </Stack>
                <Stack direction="row" spacing={2} alignItems="center" marginBottom="5px">
                  <Box padding="15px" backgroundColor="#f6f9ff" borderRadius="50%" lineHeight="0">
                    <BsPeople color='#4154f1' size={35} />
                  </Box>
                  <Box>
                    <Typography variant="h5" gutterBottom marginBottom="0px" fontSize="28px" fontWeight="600">
                       {users.length} 
                    </Typography>
                    <Typography variant="overline" sx={{ textTransform: "lowercase", fontSize: "15px" }} display="flex" alignItems="center" marginBottom="0" gap={1} gutterBottom>
                      <Typography color="rgb(25,135,84)" sx={{ fontWeight: 600 }}>12%</Typography>
                      increase
                    </Typography>
                  </Box>
                </Stack>
              </Paper>
            </Grid>
            <Grid item sm={6} xs={12}>
              <Paper sx={{ padding: "20px" }}>
                <Stack direction="row" justifyContent="space-between" alignItems="flex-start" marginBottom="15px">
                  <Box display="flex" alignItems="center">
                    <Typography variant="h6" gutterBottom color="#000">Total Product </Typography>
                    
                  </Box>
                  <IconButton size='small'><BsThreeDots /></IconButton>
                </Stack>
                <Stack direction="row" spacing={2} alignItems="center" marginBottom="5px">
                  <Box padding="15px" backgroundColor="#f6f9ff" borderRadius="50%" lineHeight="0">
                    <BsCart color='#4154f1' size={35} />
                  </Box>
                  <Box>
                    <Typography variant="h5" gutterBottom marginBottom="0px" fontSize="28px" fontWeight="600">
                      {products.length} 
                    </Typography>
                    <Typography variant="overline" sx={{ textTransform: "lowercase", fontSize: "15px" }} display="flex" alignItems="center" marginBottom="0" gap={1} gutterBottom>
                      <Typography color="rgb(25,135,84)" sx={{ fontWeight: 600 }}>12%</Typography>
                      increase
                    </Typography>
                  </Box>
                </Stack>
              </Paper>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      {/* <Grid container  style={{margin:'30px 0px'}}>
            <Grid item xs={6}>
              <Paper sx={{ padding: "20px" }}>
                <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                  <Box display="flex" alignItems="center">
                    <Typography variant="h6" gutterBottom color="#000">Orders Reports</Typography>
                    <Divider orientation="vertical" sx={{ height: "16px", width: "1.5px", backgroundColor: "#ababab", marginX: "5px" }} variant="middle" flexItem />
                    <Typography variant="subtitle1" color="#ababab" gutterBottom>Today</Typography>
                  </Box>
                  <IconButton size='small'><BsThreeDots /></IconButton>
                </Stack>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart
                    data={dailyOrderCounts}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="count" stroke="#8884d8" activeDot={{ r: 8 }} />
                  </LineChart>
                </ResponsiveContainer>
              </Paper>
            </Grid>
            <Grid item xs={6}>
              <Paper sx={{ padding: "20px" }}>
                <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                  <Box display="flex" alignItems="center">
                    <Typography variant="h6" gutterBottom color="#000">Orders Report</Typography>
                    <Divider orientation="vertical" sx={{ height: "16px", width: "1.5px", backgroundColor: "#ababab", marginX: "5px" }} variant="middle" flexItem />
                    <Typography variant="subtitle1" color="#ababab" gutterBottom>Month</Typography>
                  </Box>
                  <IconButton size='small'><BsThreeDots /></IconButton>
                </Stack>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart
                    data={monthlyOrderCounts}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="count" stroke="#8884d8" activeDot={{ r: 8 }} />
                  </LineChart>
                </ResponsiveContainer>
              </Paper>
            </Grid>
      </Grid> */}
    </Container>
  );
}

export default Home;
