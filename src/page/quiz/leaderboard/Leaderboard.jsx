import React from 'react';
import {
  Avatar,
  Box,
  Container,
  Grid,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Paper,
  Typography,
} from '@mui/material';

const medalColor = {
  1: '#ffd700',
  2: '#c0c0c0',
  3: '#cd7f32',
};

const TopRank = ({ rank, name, score, src, size = 96 }) => (
  <Box sx={{ display: 'flex', alignItems: 'center', flexDirection: 'column', gap: 1 }}>
    <Box sx={{ position: 'relative' }}>
      <Avatar
        src={src}
        alt={name}
        sx={{
          width: size,
          height: size,
          border: '4px solid',
          borderColor: medalColor[rank] || 'transparent',
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          bottom: -8,
          right: -8,
          width: 32,
          height: 32,
          borderRadius: '50%',
          bgcolor: medalColor[rank] || 'secondary.main',
          color: 'background.default',
          display: 'grid',
          placeItems: 'center',
          fontWeight: 800,
        }}
      >
        {rank}
      </Box>
    </Box>
    <Typography variant="body2" sx={{ fontWeight: 700 }}>{name}</Typography>
    <Typography variant="caption" sx={{ color: 'text.secondary' }}>{score}</Typography>
  </Box>
);

const Row = ({ rank, name, score, src, highlight = false }) => (
  <Paper
    elevation={0}
    sx={{
      p: 1.5,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      bgcolor: highlight ? 'secondary.main' : 'background.paper',
      border: highlight ? '2px solid' : 'none',
      borderColor: highlight ? 'primary.main' : 'transparent',
    }}
  >
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
      <Typography sx={{ width: 24, textAlign: 'center', color: highlight ? 'text.primary' : 'text.secondary', fontWeight: 700 }}>
        {rank}
      </Typography>
      {src ? (
        <Avatar src={src} sx={{ width: 40, height: 40, border: highlight ? '2px solid' : '2px solid transparent', borderColor: 'primary.main' }} />
      ) : (
        <Avatar sx={{ width: 40, height: 40, bgcolor: 'secondary.main', fontWeight: 700 }}>
          {name?.[0] ?? 'U'}
        </Avatar>
      )}
      <Typography sx={{ fontWeight: highlight ? 800 : 600 }}>{name}</Typography>
    </Box>
    <Typography sx={{ fontWeight: 900, color: 'primary.main' }}>{score}</Typography>
  </Paper>
);

const Leaderboard = () => {
  const [tab, setTab] = React.useState('stats');

  return (
    <Box sx={{ minHeight: '100dvh', bgcolor: 'background.default', display: 'flex', flexDirection: 'column' }}>
      <Container sx={{ pb: 8 }}>
        <Grid container spacing={3} sx={{ mt: 1 }}>
          <Grid item xs={4} sx={{ display: 'flex', justifyContent: 'center' }}>
            <TopRank
              rank={2}
              name="Olivia B."
              score={1200}
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBki7QRszrtWPmfw8kIdieVj7cDUf9tNlocFO7CNVHWKmyLZsFEoc5ERHFnGGyfZM3v3ccVSSop62Bc9m4QkID6E8OtxjJfGUyfXbrx-T7zEwhgFObYWhbJOSyWd9_nwsLsm8ix-4Jml367zWx5Dd-0stCIe3QL-mbJ3cNityzvZefPZDJSdB2PQyOTKEfG5XLhHwLijbRNGchsLq3s_Lm8l6Qm63U3iN3TCUY-GGNr66SwfZlTt9C6l4CEIsYN0ecTKcSoyq4VcP3i"
              size={80}
            />
          </Grid>
          <Grid item xs={4} sx={{ display: 'flex', justifyContent: 'center' }}>
            <toprank
              rank={1}
              name="ethan c."
              score={1250}
              src="https://lh3.googleusercontent.com/aida-public/ab6axucqjzn1nmpzwdbprilhptpcdg2wfpbz3jzxcij3likn9e9vvlfefvvgq838lp-v3rvclsdbxet6y5nzlufqv1ovsyahi_j2f0edd_f3lb4nacc87yzlupvb44hodhxlyijk60vj4mfttxjvi8ysacrjpqbvqwyiiiiqhxa1_9cpai5tp5dlko8muwnq_wtngj9et9niy15s9kadyoagx_leqqk15ywtqjaxbb25mpbwhuqrahmtk2gotp35libr0xpvzhgkv2qttdr4"
              size={96}
            />
          </Grid>
          <Grid item xs={4} sx={{ display: 'flex', justifyContent: 'center' }}>
            <TopRank
              rank={3}
              name="Noah T."
              score={1150}
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBBmhay255x07d_Wk0zx3zc3fWMGYS5x7EWsYdXCWhGm4kfhhUWokizvE-Ktj_RAkDx7PCfsoQYZJtj83HmDvbXTUv7NadJfTLdY7UeIHjgzcK1N48e_Jnj3pPawb0S612WbGyVeP4b43nvguZuYgjQX4BdoV-qa6WoFesYBKlEtJuAVlB35WRa6nKyY8rTeX_UHJ1bUB4LfD6JVGwBzvha7TCRVfZNbJEOUE5pep1JfU5WZbqf9K7KYPIN51dx639RqL1aVR6aszIk"
              size={80}
            />
          </Grid>
        </Grid>

        <Box sx={{ mt: 3, display: 'grid', gap: 1.25 }}>
          <Row rank={4} name="Ava Harper" score={1100} src="https://lh3.googleusercontent.com/aida-public/AB6AXuAg2Dgp__7JU4BlO2WZx_2qHUOrMo4DCfszykWH94_25kM_CPc7Ok8LFCvbMBxIl1NS5DvYiCUR1Wsa0OGmXntKLe4yqRSIlzT5zWqJ54Khmbkk6_1IU-8CMUMNNcMGoTxv7jq0k81ZJuF0haSvVB8ofiDxRP0I4scs_KzzOxV2Mo6U2q3m7ylpd21zJkmB3r2Wuxz7WMSMDue6A6Hw2sg1Bm0-PVN77B_xlalJE8tPcBoSiQ4XIfX2jYy9GSDs9IZvfwQ5LAC_uev9" />
          <Row rank={5} name="Liam Foster" score={1050} src="https://lh3.googleusercontent.com/aida-public/AB6AXuDpoORqlidQ9121eGVbQc5Fkxk211bdr8Gi7NB7b-CFhIw5G78dWCScG7MDajHOAzvmMHfIuxzHVco76rTVg4eit7yTemmMw5DvRAmwA5FaW1KAJMPhgDxTbahDGRjPOLoRfjtsodZvvLGdXqEFCMPJtSUijhLadJH_zzVfAsm0peWn6F5i2DY-JSqpxk2rMhfBXemnuzfGwE-HcBjbrAYW_qDQbpLgenhdbTLA_xMzo2ueZmQ519seFL5qAOA655FT2-EorGPd4HZY" />
          <Row rank={6} name="User 6" score={1000} />
          <Row rank={7} name="You" score={950} src="https://lh3.googleusercontent.com/aida-public/AB6AXuCq1QfcPO4IJO6G-8_9xx6tR0_lLs5C8PzVz2BSWVTnGDemIDrU436I6hoxygCBL0YI6B7h3VMLGo_jGP1Ix_eMwb55hOiqnwyyEifDtwmWeTrWwtXO8Bi49diwaCQPvXdUuPMXAAAoP81YnhL6l4xBLVuMUmZ8eMCpf_WBN7_uRa-kFFmXhqoQAr5Ter7uBR67jDmNhYI5JEIfAC5TeBhBl_wBMVKE0i2Dq0bDQ7rYyrb3KB6_mVmtoK5vfEPlHlz_m14hL-410vm" highlight />
        </Box>
      </Container>
    </Box>
  );
};

export default Leaderboard;
