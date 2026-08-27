'use client';

import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import './Pagination.css';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
}

export default function Pagination({ currentPage, totalPages }: PaginationProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  if (totalPages <= 1) return null;

  const createPageUrl = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', page.toString());
    return `${pathname}?${params.toString()}`;
  };

  const getVisiblePages = () => {
    const delta = 1; // number of pages to show before and after current
    const range = [];
    const rangeWithDots = [];
    let l;

    for (let i = 1; i <= totalPages; i++) {
      if (i === 1 || i === totalPages || (i >= currentPage - delta && i <= currentPage + delta)) {
        range.push(i);
      }
    }

    for (const i of range) {
      if (l) {
        if (i - l === 2) {
          rangeWithDots.push(l + 1);
        } else if (i - l !== 1) {
          rangeWithDots.push('...');
        }
      }
      rangeWithDots.push(i);
      l = i;
    }

    return rangeWithDots;
  };

  const prevDisabled = currentPage <= 1;
  const nextDisabled = currentPage >= totalPages;

  return (
    <nav className="pagination" aria-label="Pagination Navigation">
      <div className="pagination-controls">
        {prevDisabled ? (
          <span className="pagination-arrow disabled" aria-disabled="true">
            &larr; PREV<span className="hide-mobile">IOUS</span>
          </span>
        ) : (
          <Link href={createPageUrl(currentPage - 1)} className="pagination-arrow" aria-label="Previous page">
            &larr; PREV<span className="hide-mobile">IOUS</span>
          </Link>
        )}

        <div className="pagination-numbers">
          {getVisiblePages().map((page, index) => {
            if (page === '...') {
              return <span key={`dots-${index}`} className="pagination-dots">...</span>;
            }

            const isCurrent = page === currentPage;
            return (
              <Link
                key={page}
                href={createPageUrl(page as number)}
                className={`pagination-number ${isCurrent ? 'active' : ''}`}
                aria-label={`Page ${page}`}
                aria-current={isCurrent ? 'page' : undefined}
              >
                {page}
              </Link>
            );
          })}
        </div>

        {nextDisabled ? (
          <span className="pagination-arrow disabled" aria-disabled="true">
            NEXT &rarr;
          </span>
        ) : (
          <Link href={createPageUrl(currentPage + 1)} className="pagination-arrow" aria-label="Next page">
            NEXT &rarr;
          </Link>
        )}
      </div>
    </nav>
  );
}
