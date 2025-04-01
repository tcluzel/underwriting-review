# Underwriting Review Application

A modern web application for managing and conducting underwriting reviews. Built with React, TypeScript, and Material-UI.

## Features

- Document upload and validation
- Business address verification
- Representative verification
- Bank account validation
- Bank statement analysis
- Risk assessment
- Modern, responsive UI

## Prerequisites

- Node.js (v14 or later)
- npm (v6 or later)

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd underwriting-review
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

The application will be available at [http://localhost:3000](http://localhost:3000).

## Project Structure

```
underwriting-review/
├── public/
│   ├── index.html
│   └── manifest.json
├── src/
│   ├── components/
│   │   ├── BusinessAddressValidation.tsx
│   │   ├── RepresentativeVerification.tsx
│   │   ├── BankAccountVerification.tsx
│   │   ├── BankStatementAnalysis.tsx
│   │   ├── RiskAssessment.tsx
│   │   └── DocumentUpload.tsx
│   ├── pages/
│   │   ├── NewReview.tsx
│   │   └── ReviewList.tsx
│   ├── types/
│   │   └── underwriting.ts
│   ├── App.tsx
│   └── index.tsx
└── package.json
```

## Available Scripts

- `npm start` - Runs the app in development mode
- `npm test` - Launches the test runner
- `npm run build` - Builds the app for production
- `npm run eject` - Ejects from Create React App

## Dependencies

- React
- TypeScript
- Material-UI
- React Router
- Formik & Yup
- React Dropzone

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Validation Rules

- No partial updates—each section must be complete before reporting
- All extractions must be completed before analysis
- No assumptions—strict validation required
- Business address validation must be presented in tables
- All validations must include source links 