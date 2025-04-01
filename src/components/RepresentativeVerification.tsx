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
import { BusinessRepresentative } from '../types/underwriting';

interface RepresentativeVerificationProps {
  onSubmit: (representative: BusinessRepresentative[]) => void;
  initialData?: BusinessRepresentative[];
}

const validationSchema = Yup.object().shape({
  representatives: Yup.array().of(
    Yup.object().shape({
      name: Yup.string().required('Name is required'),
      source: Yup.string().required('Source is required'),
      validationUrl: Yup.string().url('Must be a valid URL').required('Validation URL is required'),
    })
  ),
});

const sources = [
  'Application Form',
  'Government-Issued ID',
  'Online Validation',
];

const RepresentativeVerification: React.FC<RepresentativeVerificationProps> = ({
  onSubmit,
  initialData = sources.map(source => ({ name: '', source, validationUrl: '' })),
}) => {
  return (
    <Formik
      initialValues={{ representatives: initialData }}
      validationSchema={validationSchema}
      onSubmit={(values) => onSubmit(values.representatives)}
    >
      {({ values, errors, touched, handleChange, handleBlur }) => (
        <Form>
          <Typography variant="h6" gutterBottom>
            Business Representative Verification
          </Typography>
          <Typography variant="body2" color="textSecondary" paragraph>
            Verify representative information across all sources
          </Typography>

          <TableContainer component={Paper} sx={{ mb: 4 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Source</TableCell>
                  <TableCell>Name</TableCell>
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
                        name={`representatives.${index}.name`}
                        value={values.representatives[index]?.name || ''}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={
                          touched.representatives?.[index]?.name &&
                          Boolean(errors.representatives?.[index]?.name)
                        }
                        helperText={
                          touched.representatives?.[index]?.name &&
                          errors.representatives?.[index]?.name
                        }
                      />
                    </TableCell>
                    <TableCell>
                      <TextField
                        fullWidth
                        size="small"
                        name={`representatives.${index}.validationUrl`}
                        value={values.representatives[index]?.validationUrl || ''}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={
                          touched.representatives?.[index]?.validationUrl &&
                          Boolean(errors.representatives?.[index]?.validationUrl)
                        }
                        helperText={
                          touched.representatives?.[index]?.validationUrl &&
                          errors.representatives?.[index]?.validationUrl
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
              Note: Representative names must match across all sources. Any discrepancies will require
              clarification.
            </Typography>
          </Box>

          <Box sx={{ mt: 4, display: 'flex', justifyContent: 'flex-end' }}>
            <Button type="submit" variant="contained" color="primary">
              Verify Representative
            </Button>
          </Box>
        </Form>
      )}
    </Formik>
  );
};

export default RepresentativeVerification; 