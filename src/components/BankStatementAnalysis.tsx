import React, { useState } from 'react';
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
  Alert,
} from '@mui/material';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { BankStatement, Transaction } from '../types/underwriting';

interface BankStatementAnalysisProps {
  onSubmit: (statements: BankStatement[]) => void;
  initialData?: BankStatement[];
}

const validationSchema = Yup.object().shape({
  statements: Yup.array().of(
    Yup.object().shape({
      date: Yup.string().required('Date is required'),
      beginningBalance: Yup.number().required('Beginning balance is required'),
      totalDeposits: Yup.number().required('Total deposits is required'),
      totalWithdrawals: Yup.number().required('Total withdrawals is required'),
      endingBalance: Yup.number().required('Ending balance is required'),
      largeTransactions: Yup.array().of(
        Yup.object().shape({
          date: Yup.string().required('Transaction date is required'),
          amount: Yup.number().required('Amount is required'),
          rollingAverage: Yup.number().required('Rolling average is required'),
        })
      ),
    })
  ),
});

const calculateRollingAverage = (transactions: Transaction[], currentIndex: number): number => {
  const lastSixDays = transactions
    .slice(Math.max(0, currentIndex - 5), currentIndex + 1)
    .reduce((sum, t) => sum + t.amount, 0);
  return lastSixDays / Math.min(6, currentIndex + 1);
};

const BankStatementAnalysis: React.FC<BankStatementAnalysisProps> = ({
  onSubmit,
  initialData = [
    {
      date: '',
      beginningBalance: 0,
      totalDeposits: 0,
      totalWithdrawals: 0,
      endingBalance: 0,
      largeTransactions: [],
    },
  ],
}) => {
  const [showRiskAlert, setShowRiskAlert] = useState(false);

  const handleSubmit = (values: { statements: BankStatement[] }) => {
    const hasRisks = values.statements.some((statement) => {
      const hasNegativeBalance = statement.endingBalance < 0;
      const hasLargeTransactions = statement.largeTransactions.some(
        (t) => t.amount > t.rollingAverage * 2
      );
      return hasNegativeBalance || hasLargeTransactions;
    });

    setShowRiskAlert(hasRisks);
    onSubmit(values.statements);
  };

  return (
    <Formik
      initialValues={{ statements: initialData }}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      {({ values, errors, touched, handleChange, handleBlur, setFieldValue }) => (
        <Form>
          <Typography variant="h6" gutterBottom>
            Bank Statement Analysis
          </Typography>
          <Typography variant="body2" color="textSecondary" paragraph>
            Analyze bank statements for risk patterns and transaction trends
          </Typography>

          {showRiskAlert && (
            <Alert severity="warning" sx={{ mb: 3 }}>
              High-risk patterns detected in the bank statements
            </Alert>
          )}

          {values.statements.map((statement, statementIndex) => (
            <Box key={statementIndex} sx={{ mb: 4 }}>
              <Typography variant="subtitle1" gutterBottom>
                Statement Period {statementIndex + 1}
              </Typography>

              <TableContainer component={Paper} sx={{ mb: 2 }}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Date</TableCell>
                      <TableCell>Beginning Balance</TableCell>
                      <TableCell>Total Deposits</TableCell>
                      <TableCell>Total Withdrawals</TableCell>
                      <TableCell>Ending Balance</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    <TableRow>
                      <TableCell>
                        <TextField
                          type="date"
                          fullWidth
                          size="small"
                          name={`statements.${statementIndex}.date`}
                          value={statement.date}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          error={
                            touched.statements?.[statementIndex]?.date &&
                            Boolean(errors.statements?.[statementIndex]?.date)
                          }
                          helperText={
                            touched.statements?.[statementIndex]?.date &&
                            errors.statements?.[statementIndex]?.date
                          }
                        />
                      </TableCell>
                      <TableCell>
                        <TextField
                          type="number"
                          fullWidth
                          size="small"
                          name={`statements.${statementIndex}.beginningBalance`}
                          value={statement.beginningBalance}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          error={
                            touched.statements?.[statementIndex]?.beginningBalance &&
                            Boolean(errors.statements?.[statementIndex]?.beginningBalance)
                          }
                        />
                      </TableCell>
                      <TableCell>
                        <TextField
                          type="number"
                          fullWidth
                          size="small"
                          name={`statements.${statementIndex}.totalDeposits`}
                          value={statement.totalDeposits}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          error={
                            touched.statements?.[statementIndex]?.totalDeposits &&
                            Boolean(errors.statements?.[statementIndex]?.totalDeposits)
                          }
                        />
                      </TableCell>
                      <TableCell>
                        <TextField
                          type="number"
                          fullWidth
                          size="small"
                          name={`statements.${statementIndex}.totalWithdrawals`}
                          value={statement.totalWithdrawals}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          error={
                            touched.statements?.[statementIndex]?.totalWithdrawals &&
                            Boolean(errors.statements?.[statementIndex]?.totalWithdrawals)
                          }
                        />
                      </TableCell>
                      <TableCell>
                        <TextField
                          type="number"
                          fullWidth
                          size="small"
                          name={`statements.${statementIndex}.endingBalance`}
                          value={statement.endingBalance}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          error={
                            touched.statements?.[statementIndex]?.endingBalance &&
                            Boolean(errors.statements?.[statementIndex]?.endingBalance)
                          }
                        />
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>

              <Typography variant="subtitle2" gutterBottom>
                Large Transactions (Over $100,000)
              </Typography>

              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Date</TableCell>
                      <TableCell>Amount</TableCell>
                      <TableCell>6-Day Rolling Average</TableCell>
                      <TableCell>Risk Status</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {statement.largeTransactions.map((transaction, transactionIndex) => (
                      <TableRow
                        key={transactionIndex}
                        sx={{
                          bgcolor: transaction.isHighRisk ? 'error.light' : 'inherit',
                        }}
                      >
                        <TableCell>
                          <TextField
                            type="date"
                            fullWidth
                            size="small"
                            name={`statements.${statementIndex}.largeTransactions.${transactionIndex}.date`}
                            value={transaction.date}
                            onChange={handleChange}
                            onBlur={handleBlur}
                          />
                        </TableCell>
                        <TableCell>
                          <TextField
                            type="number"
                            fullWidth
                            size="small"
                            name={`statements.${statementIndex}.largeTransactions.${transactionIndex}.amount`}
                            value={transaction.amount}
                            onChange={(e) => {
                              handleChange(e);
                              const newAmount = parseFloat(e.target.value);
                              const rollingAvg = calculateRollingAverage(
                                statement.largeTransactions,
                                transactionIndex
                              );
                              setFieldValue(
                                `statements.${statementIndex}.largeTransactions.${transactionIndex}.rollingAverage`,
                                rollingAvg
                              );
                              setFieldValue(
                                `statements.${statementIndex}.largeTransactions.${transactionIndex}.isHighRisk`,
                                newAmount > rollingAvg * 2
                              );
                            }}
                            onBlur={handleBlur}
                          />
                        </TableCell>
                        <TableCell>
                          {transaction.rollingAverage.toFixed(2)}
                        </TableCell>
                        <TableCell>
                          {transaction.isHighRisk ? '🚩 High Risk' : '✅ Normal'}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>

              <Button
                variant="outlined"
                size="small"
                onClick={() => {
                  const newTransaction = {
                    date: '',
                    amount: 0,
                    rollingAverage: 0,
                    isHighRisk: false,
                  };
                  setFieldValue(`statements.${statementIndex}.largeTransactions`, [
                    ...statement.largeTransactions,
                    newTransaction,
                  ]);
                }}
                sx={{ mt: 2 }}
              >
                Add Large Transaction
              </Button>
            </Box>
          ))}

          <Box sx={{ mt: 4, display: 'flex', justifyContent: 'space-between' }}>
            <Button
              variant="outlined"
              onClick={() => {
                setFieldValue('statements', [
                  ...values.statements,
                  {
                    date: '',
                    beginningBalance: 0,
                    totalDeposits: 0,
                    totalWithdrawals: 0,
                    endingBalance: 0,
                    largeTransactions: [],
                  },
                ]);
              }}
            >
              Add Statement Period
            </Button>
            <Button type="submit" variant="contained" color="primary">
              Complete Analysis
            </Button>
          </Box>
        </Form>
      )}
    </Formik>
  );
};

export default BankStatementAnalysis; 