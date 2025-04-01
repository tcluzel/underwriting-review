import React, { useRef } from 'react';
import {
  Paper,
  Typography,
  Button,
  Box,
  IconButton,
  LinearProgress,
} from '@mui/material';
import {
  CloudUpload as UploadIcon,
  CheckCircle as CheckIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import { Document } from '../types/underwriting';

interface DocumentUploadProps {
  document: Document;
  onUpload: (file: File) => void;
}

const DocumentUpload: React.FC<DocumentUploadProps> = ({ document, onUpload }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onUpload(file);
    }
  };

  const getDocumentTitle = (type: Document['type']): string => {
    switch (type) {
      case 'application':
        return 'Application Form';
      case 'id':
        return 'Government-Issued ID';
      case 'bankStatements':
        return 'Bank Statements (Last 3+ Months)';
      case 'processingStatements':
        return 'Credit Card Processing Statements';
      case 'voidedCheck':
        return 'Voided Check or Bank Letter';
      default:
        return 'Document';
    }
  };

  return (
    <Paper
      sx={{
        p: 2,
        border: '1px dashed',
        borderColor: document.status === 'received' ? 'success.main' : 'grey.300',
        bgcolor: document.status === 'received' ? 'success.light' : 'background.paper',
        position: 'relative',
      }}
    >
      <Box display="flex" alignItems="center" justifyContent="space-between">
        <Box display="flex" alignItems="center">
          {document.status === 'received' ? (
            <CheckIcon color="success" sx={{ mr: 2 }} />
          ) : (
            <UploadIcon color="action" sx={{ mr: 2 }} />
          )}
          <Box>
            <Typography variant="subtitle1">
              {getDocumentTitle(document.type)}
              {document.required && (
                <Typography
                  component="span"
                  color="error"
                  sx={{ ml: 1 }}
                >
                  *
                </Typography>
              )}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              {document.status === 'received'
                ? 'Document uploaded successfully'
                : 'Click to upload document'}
            </Typography>
          </Box>
        </Box>

        <Box>
          {document.status === 'received' ? (
            <IconButton
              size="small"
              color="error"
              onClick={() => {
                // Handle delete
              }}
            >
              <DeleteIcon />
            </IconButton>
          ) : (
            <Button
              variant="outlined"
              size="small"
              onClick={handleClick}
              startIcon={<UploadIcon />}
            >
              Upload
            </Button>
          )}
        </Box>
      </Box>

      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        style={{ display: 'none' }}
        accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
      />
    </Paper>
  );
};

export default DocumentUpload; 