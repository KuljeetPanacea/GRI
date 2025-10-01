import React, { useRef, useState } from 'react';
import { styled } from '@mui/material/styles';
import IconButton from '@mui/material/IconButton';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';

const PaginationContainer = styled('div')({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: '16px 0',
  gap: '16px',
  position:'relative',
  bottom: 0,
});

const PaginationControls = styled('div')({
  display: 'flex',
  alignItems: 'center',
  gap: '4px',
});

const PaginationInfo = styled('div')({
  color: '#6b7280',
  fontSize: '14px',
  fontWeight: 500,
});

const PageButton = styled('button')<{ active?: boolean }>(({ active }) => ({
  minWidth: '32px' ,
  height: '32px',
  padding: '0 6px',
  border: 'none',
  borderRadius: '100%',
  backgroundColor: active ? '#dc2626' : 'transparent',
  color: active ? '#ffffff' : '#374151',
  fontSize: '14px',
  fontWeight: 500,
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  transition: 'all 0.2s ease',
  '&:hover': {
    backgroundColor: active ? '#dc2626' : '#f3f4f6',
  },
  '&:disabled': {
    cursor: 'not-allowed',
    opacity: 0.5,
  },
}));

const NavigationButton = styled(IconButton)({
  padding: '4px',
  color: '#374151',
  '&:disabled': {
    opacity: 0.5,
  },
});

const Ellipsis = styled('span')({
  color: '#374151',
  padding: '0 4px',
});

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  pageSize: number;
  totalItems: number;
  onPageChange: (page: number) => void;
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  pageSize,
  totalItems,
  onPageChange,
}) => {

  currentPage = Number(currentPage);
  
  // Ref to track last click time to prevent rapid clicks
  const lastClickTimeRef = useRef<number>(0);
  const [isThrottled, setIsThrottled] = useState(false);

  // Throttled page change handler to prevent rapid API calls
  const handlePageChange = (page: number) => {
    const now = Date.now();
    const timeSinceLastClick = now - lastClickTimeRef.current;
    
    // Prevent clicks within 300ms of each other
    if (timeSinceLastClick < 300) {
      setIsThrottled(true);
      // Reset throttled state after a short delay
      setTimeout(() => setIsThrottled(false), 100);
      return;
    }
    
    lastClickTimeRef.current = now;
    onPageChange(page);
  };

  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    
    if (totalPages <= 4) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    pages.push(1);

    if (currentPage > 3) {
      pages.push('...');
    }

    let start = Math.max(2, currentPage - 1);
    let end = Math.min(totalPages - 1, currentPage + 1);

    if (currentPage <= 3) {
      end = 4;
    }
    if (currentPage >= totalPages - 2) {
      start = totalPages - 3;
    }

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    if (currentPage < totalPages - 2) {
      pages.push('...');
    }

    if (totalPages > 1) {
      pages.push(totalPages);
    }

    return pages;
  };

  const startItem = (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, totalItems);

  return (
    <PaginationContainer>
      
      <PaginationInfo>
        Showing {startItem}-{endItem} of {totalItems} items
      </PaginationInfo>

      <PaginationControls>
        <NavigationButton
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1 || isThrottled}
        >
          <ChevronLeftIcon />
        </NavigationButton>

        {getPageNumbers().map((pageNum, index) => (
          pageNum === '...' ? (
            <Ellipsis key={`ellipsis-${index}`}>...</Ellipsis>
          ) : (
            <PageButton
              key={pageNum}
              active={currentPage === pageNum}
              onClick={() => handlePageChange(Number(pageNum))}
              disabled={isThrottled}
            >
              {pageNum}
            </PageButton>
          )
        ))}

        <NavigationButton
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages || isThrottled}
        >
          <ChevronRightIcon />
        </NavigationButton>
      </PaginationControls>

    </PaginationContainer>
  );
};

export default Pagination;
