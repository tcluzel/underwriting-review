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
import { Address } from '../types/underwriting';

interface BusinessAddressValidationProps {
  onSubmit: (addresses: Address[]) => void;
  initialAddresses?: Address[];
}

const validationSchema = Yup.object().shape({
  addresses: Yup.array().of(
    Yup.object().shape({
      dba: Yup.string().required('DBA is required'),
      address: Yup.string().required('Address is required'),
      source: Yup.string().required('Source is required'),
      validationUrl: Yup.string().url('Must be a valid URL').required('Validation URL is required'),
    })
  ),
});

const initialAddress: Address = {
  dba: '',
  address: '',
  source: '',
  validationUrl: '',
};

const sources = [
  'Application Form',
  'Bank Statements',
  'Voided Check / Bank Letter',
  'Credit Card Processing Statements',
  'Company Website',
  'Secretary of State Records',
];

const BusinessAddressValidation: React.FC<BusinessAddressValidationProps> = ({
  onSubmit,
  initialAddresses = [initialAddress],
}) => {
  return (
    <Formik
      initialValues={{ addresses: initialAddresses }}
      validationSchema={validationSchema}
      onSubmit={(values) => onSubmit(values.addresses)}
    >
      {({ values, errors, touched, handleChange, handleBlur, setFieldValue }) => (
        <Form>
          <Typography variant="h6" gutterBottom>
            Business Address Validation
          </Typography>
          <Typography variant="body2" color="textSecondary" paragraph>
            Extract and compare business addresses from all available sources
          </Typography>

          <TableContainer component={Paper} sx={{ mb: 4 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Source</TableCell>
                  <TableCell>DBA Name</TableCell>
                  <TableCell>Address</TableCell>
                  <TableCell>Validation URL</TableCell>
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
                        name={`addresses.${index}.dba`}
                        value={values.addresses[index]?.dba || ''}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={
                          touched.addresses?.[index]?.dba && Boolean(errors.addresses?.[index]?.dba)
                        }
                        helperText={touched.addresses?.[index]?.dba && errors.addresses?.[index]?.dba}
                      />
                    </TableCell>
                    <TableCell>
                      <TextField
                        fullWidth
                        size="small"
                        name={`addresses.${index}.address`}
                        value={values.addresses[index]?.address || ''}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={
                          touched.addresses?.[index]?.address &&
                          Boolean(errors.addresses?.[index]?.address)
                        }
                        helperText={
                          touched.addresses?.[index]?.address && errors.addresses?.[index]?.address
                        }
                      />
                    </TableCell>
                    <TableCell>
                      <TextField
                        fullWidth
                        size="small"
                        name={`addresses.${index}.validationUrl`}
                        value={values.addresses[index]?.validationUrl || ''}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={
                          touched.addresses?.[index]?.validationUrl &&
                          Boolean(errors.addresses?.[index]?.validationUrl)
                        }
                        helperText={
                          touched.addresses?.[index]?.validationUrl &&
                          errors.addresses?.[index]?.validationUrl
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
              Note: All addresses must match for verification. Any discrepancies will require
              clarification.
            </Typography>
          </Box>

          <Box sx={{ mt: 4, display: 'flex', justifyContent: 'flex-end' }}>
            <Button type="submit" variant="contained" color="primary">
              Validate Addresses
            </Button>
          </Box>
        </Form>
      )}
    </Formik>
  );
};

export default BusinessAddressValidation; 