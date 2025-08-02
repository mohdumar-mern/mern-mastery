import React, { useState, useEffect } from 'react';
import { useGetSignedUrlQuery } from '../app/api/apiSlice/course/courseApiSlice';
import { Document, Page, pdfjs } from 'react-pdf';
// import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
// import 'react-pdf/dist/esm/Page/TextLayer.css';
import LoadingSpinner from './LoadingSpinner';

// Set PDF.js worker source for react-pdf
pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

function PDFViewer({ publicId, version }) {
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [error, setError] = useState(null);

  // Fetch signed URL for the PDF
  const { data, isLoading, error: fetchError } = useGetSignedUrlQuery(
    { publicId, fileType: 'raw', version },
    { skip: !publicId || !version }
  );

  // Handle fetch errors
  useEffect(() => {
    if (fetchError) {
      setError('Failed to load PDF. Please try again.');
      console.error('PDF fetch error:', fetchError);
    }
  }, [fetchError]);

  // Handle PDF load success
  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
    setPageNumber(1);
    setError(null);
  };

  // Handle PDF load error
  const onDocumentLoadError = (err) => {
    setError('Failed to render PDF. Please check the file.');
    console.error('PDF render error:', err);
  };

  // Navigation handlers
  const goToPrevPage = () => {
    setPageNumber((prev) => Math.max(prev - 1, 1));
  };

  const goToNextPage = () => {
    setPageNumber((prev) => Math.min(prev + 1, numPages));
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (error || !data?.encryptedUrl) {
    return (
      <div className="text-center p-4 text-red-500">
        {error || 'Invalid PDF data. Please try again.'}
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto p-4 bg-white/90 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-semibold text-gray-800">
          Page {pageNumber} of {numPages || '...'}{' '}
        </h3>
        <div className="flex gap-2">
          <button
            onClick={goToPrevPage}
            disabled={pageNumber <= 1}
            className="px-3 py-1 bg-gray-200 text-gray-800 rounded disabled:opacity-50"
          >
            Previous
          </button>
          <button
            onClick={goToNextPage}
            disabled={pageNumber >= numPages}
            className="px-3 py-1 bg-gray-200 text-gray-800 rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
      <div className="relative w-full h-[70vh] overflow-auto border border-gray-300 rounded-lg">
        <Document
          file={data.encryptedUrl} // Signed URL from backend
          onLoadSuccess={onDocumentLoadSuccess}
          onLoadError={onDocumentLoadError}
          loading={<LoadingSpinner />}
        >
          <Page
            pageNumber={pageNumber}
            width={Math.min(800, window.innerWidth - 40)} // Responsive width
            renderTextLayer={true}
            renderAnnotationLayer={true}
            className="shadow-sm"
          />
        </Document>
      </div>
    </div>
  );
}

export default PDFViewer;