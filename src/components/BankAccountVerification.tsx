import React from 'react';
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  Button,
} from '@mui/material';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { BankAccount } from '../types/underwriting';

interface BankAccountVerificationProps {
  onSubmit: (accounts: BankAccount[]) => void;
  initialData?: BankAccount[];
}

const validationSchema = Yup.object().shape({
  accounts: Yup.array().of(
    Yup.object().shape({
      accountNumber: Yup.string()
        .required('Account number is required')
        .matches(/^\d{4,}$/, 'Must be at least 4 digits'),
      bankName: Yup.string().required('Bank name is required'),
      dba: Yup.string().required('DBA is required'),
      source: Yup.string().required('Source is required'),
    })
  ),
});

const sources = [
  'Voided Check / Bank Letter',
  'Bank Statements',
];

const BankAccountVerification: React.FC<BankAccountVerificationProps> = ({
  onSubmit,
  initialData = sources.map(source => ({
    accountNumber: '',
    bankName: '',
    dba: '',
    source,
  })),
}) => {
  return (
    <Formik
      initialValues={{ accounts: initialData }}
      validationSchema={validationSchema}
      onSubmit={(values) => onSubmit(values.accounts)}
    >
      {({ values, errors, touched, handleChange, handleBlur }) => (
        <Form>
          <Typography variant="h6" gutterBottom>
            Bank Account Verification
          </Typography>
          <Typography variant="body2" color="textSecondary" paragraph>
            Verify bank account details across all sources
          </Typography>

          <TableContainer component={Paper} sx={{ mb: 4 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Source</TableCell>
                  <TableCell>Account Number</TableCell>
                  <TableCell>Bank Name</TableCell>
                  <TableCell>DBA</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {sources.map((source, index) => (
                  <TableRow key={source}>
                    <TableCell>{source}</TableCell>
                    <TableCell>
                      <TextField
                        fullWidth
                        size="small"
                        name={`accounts.${index}.accountNumber`}
                        value={values.accounts[index]?.accountNumber || ''}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={
                          touched.accounts?.[index]?.accountNumber &&
                          Boolean(errors.accounts?.[index]?.accountNumber)
                        }
                        helperText={
                          touched.accounts?.[index]?.accountNumber &&
                          errors.accounts?.[index]?.accountNumber
                        }
                      />
                    </TableCell>
                    <TableCell>
                      <TextField
                        fullWidth
                        size="small"
                        name={`accounts.${index}.bankName`}
                        value={values.accounts[index]?.bankName || ''}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={
                          touched.accounts?.[index]?.bankName &&
                          Boolean(errors.accounts?.[index]?.bankName)
                        }
                        helperText={
                          touched.accounts?.[index]?.bankName &&
                          errors.accounts?.[index]?.bankName
                        }
                      />
                    </TableCell>
                    <TableCell>
                      <TextField
                        fullWidth
                        size="small"
                        name={`accounts.${index}.dba`}
                        value={values.accounts[index]?.dba || ''}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={
                          touched.accounts?.[index]?.dba &&
                          Boolean(errors.accounts?.[index]?.dba)
                        }
                        helperText={
                          touched.accounts?.[index]?.dba &&
                          errors.accounts?.[index]?.dba
                        }
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          <Box sx={{ mt: 2 }}>
            <Typography variant="subtitle2" color="error">
              Note: Account details must match across all sources. Any discrepancies will require
              clarification.
            </Typography>
          </Box>

          <Box sx={{ mt: 4, display: 'flex', justifyContent: 'flex-end' }}>
            <Button type="submit" variant="contained" color="primary">
              Verify Bank Accounts
            </Button>
          </Box>
        </Form>
      )}
    </Formik>
  );
};

export default BankAccountVerification; 