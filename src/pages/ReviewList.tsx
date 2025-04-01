import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Paper,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Box,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { UnderwritingReview } from '../types/underwriting';

// Mock data for demonstration
const mockReviews: UnderwritingReview[] = [
  {
    id: '1',
    status: 'pending',
    documents: [],
    addresses: [],
    representative: {
      name: 'John Doe',
      source: 'LinkedIn',
      validationUrl: 'https://linkedin.com/johndoe',
      status: 'verified',
    },
    bankAccounts: [],
    bankStatements: [],
    transactionVolume: {
      reported: 100000,
      actual: 98000,
      aligned: true,
    },
    riskFlags: {
      chargebacks: false,
      nsf: false,
      irregularDeposits: false,
    },
  },
];

const getStatusColor = (status: UnderwritingReview['status']) => {
  switch (status) {
    case 'approved':
      return 'success';
    case 'rejected':
      return 'error';
    case 'clarification_needed':
      return 'warning';
    default:
      return 'info';
  }
};

const ReviewList: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" component="h1">
          Underwriting Reviews
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => navigate('/new')}
        >
          New Review
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Representative</TableCell>
              <TableCell>Transaction Volume</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Risk Level</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {mockReviews.map((review) => (
              <TableRow
                key={review.id}
                hover
                onClick={() => navigate(`/review/${review.id}`)}
                sx={{ cursor: 'pointer' }}
              >
                <TableCell>{review.id}</TableCell>
                <TableCell>{review.representative.name}</TableCell>
                <TableCell>
                  ${review.transactionVolume.actual.toLocaleString()}
                  {!review.transactionVolume.aligned && (
                    <Chip
                      size="small"
                      color="warning"
                      label="Mismatch"
                      sx={{ ml: 1 }}
                    />
                  )}
                </TableCell>
                <TableCell>
                  <Chip
                    label={review.status.replace('_', ' ')}
                    color={getStatusColor(review.status)}
                  />
                </TableCell>
                <TableCell>
                  {Object.values(review.riskFlags).some(flag => flag) ? (
                    <Chip label="High" color="error" />
                  ) : (
                    <Chip label="Low" color="success" />
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
};

export default ReviewList; 