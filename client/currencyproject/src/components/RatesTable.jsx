import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import GlobalStyle from './GlobalStyle';

function RatesTable() {
  const [rates, setRates] = useState([]);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const itemsPerPage = 20;

  useEffect(() => {
    axios.get('http://localhost:5000/rates')
      .then(response => {
        const rates = Object.values(response.data).map(rate => ({
          ...rate,
          name: rate.name.trim()
        }));
        rates.sort((a, b) => a.name.toLowerCase().localeCompare(b.name.toLowerCase()));
        setRates(rates);
      })
      .catch(error => {
        console.error('Error fetching rates:', error);
      });
  }, []);

  const handleChange = (event, value) => {
    setPage(value);
    window.scrollTo(0, 0);
  };

  return (
    <>
    <GlobalStyle />
    <div style={{ display: 'flex', justifyContent: 'center', backgroundColor: '#f2f2f2', minHeight: '100vh' }}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', width: '60%', backgroundColor: '#ffffff', paddingLeft: '20px', paddingRight: '20px' }}>
        <h1 style={{ textAlign: 'center' }}>Currency Exchange Rates</h1>
        <input
          type="text"
          placeholder="Search by currency name"
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{ 
            marginBottom: '20px',
            width: '100%', 
            padding: '10px', 
            borderRadius: '5px', 
            border: '1px solid #999', 
            fontSize: '16px' }}
        />
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ backgroundColor: 'f2f2f2', position: 'sticky', top: 0, backgroundColor: '#fff' }}>
              <th style={{ padding: '10px', textAlign: 'left', width: '20%' }}>Currency Name</th>
              <th style={{ padding: '10px', textAlign: 'left', width: '20%' }}>Code</th>
              <th style={{ padding: '10px', textAlign: 'left', width: '20%' }}>1 EUR =</th>
              <th style={{ padding: '10px', textAlign: 'left', width: '20%' }}>in EUR</th>
              <th style={{ padding: '10px' }}>Last Updated</th>
            </tr>
          </thead>
          <tbody>
            {rates
              .sort((a, b) => a.name.toLowerCase().localeCompare(b.name.toLowerCase()))
              .filter(rate => rate.name.toLowerCase().includes(search.toLowerCase()))
              .slice((page - 1) * itemsPerPage, page * itemsPerPage)
              .map((rate, index) => (
                <tr key={rate.code} style={{ backgroundColor: index % 2 === 0 ? '#f2f2f2' : '#ffffff' }}>
                  <td style={{ padding: '10px', borderTop: '1px solid #999', borderBottom: '1px solid #999' }}>{rate.name}</td>
                  <td style={{ padding: '10px', borderTop: '1px solid #999', borderBottom: '1px solid #999' }}>{rate.code}</td>
                  <td style={{ padding: '10px', borderTop: '1px solid #999', borderBottom: '1px solid #999' }}>{Number(rate.rate).toFixed(2)}</td>
                  <td style={{ padding: '10px', borderTop: '1px solid #999', borderBottom: '1px solid #999' }}>{Number(rate.inverseRate).toFixed(2)}</td>
                  <td style={{ padding: '10px', textAlign: 'center', borderTop: '1px solid #999', borderBottom: '1px solid #999' }}>{new Date(rate.date).toUTCString()}</td>
                </tr>
              ))}
          </tbody>
        </table>
        <Stack spacing={2} style={{ marginTop: '20px', marginBottom: '20px' }}>
          <Pagination count={Math.ceil(rates.length / itemsPerPage)} page={page} onChange={handleChange} />
        </Stack>
      </div>
    </div>
    </>
  );
}

  
  export default RatesTable;
