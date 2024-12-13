'use client'

import Link from 'next/link'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from './button'

interface PaginationProps {
  currentPage: number
  totalPages: number
}

export function Pagination({ currentPage, totalPages }: PaginationProps) {
  const maxVisiblePages = 5
  const halfVisiblePages = Math.floor(maxVisiblePages / 2)

  let startPage = Math.max(currentPage - halfVisiblePages, 1)
  let endPage = Math.min(startPage + maxVisiblePages - 1, totalPages)

  if (endPage - startPage + 1 < maxVisiblePages) {
    startPage = Math.max(endPage - maxVisiblePages + 1, 1)
  }

  const pages = Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i)

  return (
    <div className="flex items-center justify-center space-x-2">
      <Button
        variant="outline"
        size="icon"
        disabled={currentPage === 1}
        asChild
      >
        <Link href={`?page=${currentPage - 1}`}>
          <ChevronLeft className="h-4 w-4" />
        </Link>
      </Button>
      {startPage > 1 && (
        <>
          <Button variant="outline" size="icon" asChild>
            <Link href="?page=1">1</Link>
          </Button>
          {startPage > 2 && <span className="px-2">...</span>}
        </>
      )}
      {pages.map((page) => (
        <Button
          key={page}
          variant={currentPage === page ? "default" : "outline"}
          size="icon"
          asChild
        >
          <Link href={`?page=${page}`}>
            {page}
          </Link>
        </Button>
      ))}
      {endPage < totalPages && (
        <>
          {endPage < totalPages - 1 && <span className="px-2">...</span>}
          <Button variant="outline" size="icon" asChild>
            <Link href={`?page=${totalPages}`}>{totalPages}</Link>
          </Button>
        </>
      )}
      <Button
        variant="outline"
        size="icon"
        disabled={currentPage === totalPages}
        asChild
      >
        <Link href={`?page=${currentPage + 1}`}>
          <ChevronRight className="h-4 w-4" />
        </Link>
      </Button>
    </div>
  )
}

