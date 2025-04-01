import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Paper,
  Typography,
  Box,
  Stepper,
  Step,
  StepLabel,
  Button,
  Grid,
} from '@mui/material';
import {
  Document,
  Address,
  UnderwritingReview,
  BusinessRepresentative,
  BankAccount,
  BankStatement,
} from '../types/underwriting';
import DocumentUpload from '../components/DocumentUpload';
import BusinessAddressValidation from '../components/BusinessAddressValidation';
import RepresentativeVerification from '../components/RepresentativeVerification';
import BankAccountVerification from '../components/BankAccountVerification';
import BankStatementAnalysis from '../components/BankStatementAnalysis';
import RiskAssessment from '../components/RiskAssessment';

const requiredDocuments: Document[] = [
  { type: 'application', status: 'missing', required: true },
  { type: 'id', status: 'missing', required: true },
  { type: 'bankStatements', status: 'missing', required: true },
  { type: 'processingStatements', status: 'missing', required: true },
  { type: 'voidedCheck', status: 'missing', required: true },
];

const steps = [
  'Document Upload',
  'Business Address Validation',
  'Representative Verification',
  'Bank Account Verification',
  'Bank Statement Analysis',
  'Risk Assessment',
];

const NewReview: React.FC = () => {
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);
  const [review, setReview] = useState<Partial<UnderwritingReview>>({
    id: Date.now().toString(),
    status: 'pending',
    documents: requiredDocuments,
    addresses: [],
    representative: {
      name: '',
      source: '',
    },
    bankAccounts: [],
    bankStatements: [],
    transactionVolume: {
      reported: 0,
      actual: 0,
      aligned: false,
    },
    riskFlags: {
      chargebacks: false,
      nsf: false,
      irregularDeposits: false,
    },
  });

  const handleDocumentUpload = (type: Document['type'], file: File) => {
    setReview((prev) => ({
      ...prev,
      documents: prev.documents?.map((doc) =>
        doc.type === type ? { ...doc, status: 'received' } : doc
      ),
    }));
  };

  const handleAddressValidation = (addresses: Address[]) => {
    setReview((prev) => ({
      ...prev,
      addresses,
    }));
    handleNext();
  };

  const handleRepresentativeVerification = (representatives: BusinessRepresentative[]) => {
    setReview((prev) => ({
      ...prev,
      representative: representatives[0],
    }));
    handleNext();
  };

  const handleBankAccountVerification = (accounts: BankAccount[]) => {
    setReview((prev) => ({
      ...prev,
      bankAccounts: accounts,
    }));
    handleNext();
  };

  const handleBankStatementAnalysis = (statements: BankStatement[]) => {
    const totalDeposits = statements.reduce((sum, stmt) => sum + stmt.totalDeposits, 0);
    const hasIrregularDeposits = statements.some((stmt) =>
      stmt.largeTransactions.some((t) => t.isHighRisk)
    );

    setReview((prev) => ({
      ...prev,
      bankStatements: statements,
      transactionVolume: {
        ...prev.transactionVolume!,
        actual: totalDeposits,
        aligned: Math.abs(totalDeposits - prev.transactionVolume!.reported) < 5000,
      },
      riskFlags: {
        ...prev.riskFlags!,
        irregularDeposits: hasIrregularDeposits,
      },
    }));
    handleNext();
  };

  const handleRiskAssessment = (status: UnderwritingReview['status']) => {
    setReview((prev) => ({
      ...prev,
      status,
    }));
    navigate('/');
  };

  const handleNext = () => {
    setActiveStep((prev) => prev + 1);
  };

  const handleBack = () => {
    setActiveStep((prev) => prev - 1);
  };

  const canProceed = () => {
    switch (activeStep) {
      case 0:
        return review.documents?.every((doc) => (doc.required ? doc.status === 'received' : true));
      case 1:
        return review.addresses && review.addresses.length > 0;
      case 2:
        return review.representative?.name && review.representative?.source;
      case 3:
        return review.bankAccounts && review.bankAccounts.length > 0;
      case 4:
        return review.bankStatements && review.bankStatements.length > 0;
      default:
        return true;
    }
  };

  const renderStepContent = () => {
    switch (activeStep) {
      case 0:
        return (
          <>
            <Typography variant="h6" gutterBottom>
              Required Documents
            </Typography>
            <Grid container spacing={3}>
              {review.documents?.map((doc) => (
                <Grid item xs={12} key={doc.type}>
                  <DocumentUpload
                    document={doc}
                    onUpload={(file) => handleDocumentUpload(doc.type, file)}
                  />
                </Grid>
              ))}
            </Grid>
          </>
        );
      case 1:
        return (
          <BusinessAddressValidation
            onSubmit={handleAddressValidation}
            initialAddresses={review.addresses}
          />
        );
      case 2:
        return (
          <RepresentativeVerification
            onSubmit={handleRepresentativeVerification}
            initialData={review.representative ? [review.representative] : undefined}
          />
        );
      case 3:
        return (
          <BankAccountVerification
            onSubmit={handleBankAccountVerification}
            initialData={review.bankAccounts}
          />
        );
      case 4:
        return (
          <BankStatementAnalysis
            onSubmit={handleBankStatementAnalysis}
            initialData={review.bankStatements}
          />
        );
      case 5:
        return review as UnderwritingReview ? (
          <RiskAssessment review={review as UnderwritingReview} onSubmit={handleRiskAssessment} />
        ) : null;
      default:
        return null;
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Paper sx={{ p: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          New Underwriting Review
        </Typography>

        <Stepper activeStep={activeStep} sx={{ my: 4 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        <Box sx={{ mt: 4 }}>
          {renderStepContent()}

          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 4 }}>
            <Button
              disabled={activeStep === 0}
              onClick={handleBack}
              sx={{ mr: 1 }}
            >
              Back
            </Button>
            {activeStep !== steps.length - 1 && (
              <Button
                variant="contained"
                onClick={handleNext}
                disabled={!canProceed()}
              >
                Next
              </Button>
            )}
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default NewReview; 