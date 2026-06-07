'use client'

import { useCallback, useEffect, useRef, useState } from 'react'

import LoadingState from '../../components/LoadingState'
import EmptyState from '../../components/EmptyState'
import LoadMoreButton from '../../components/news/LoadMoreButton'
import NewsGrid from '../../components/news/NewsGrid'
import SectionHeader from '../../components/news/SectionHeader'
import { useSpaceArticles } from '../../hooks/useSpaceContent'
import { recordSpaceClick } from '../../lib/visitor'
import type { SpaceContentItem } from '../../lib/types'

const PAGE_SIZE = 20

export default function SpaceNewsPage() {
  const [offset, setOffset] = useState(0)
  const [items, setItems] = useState<SpaceContentItem[]>([])
  const loadingRef = useRef(false)
  const mergedRef = useRef<Set<number>>(new Set())

  const { data, isLoading, isError, isPlaceholderData } = useSpaceArticles(offset, PAGE_SIZE)
  const hasMore = data?.next != null

  // Merge new items when data changes
  useEffect(() => {
    if (!data?.items?.length) return
    const newItems = data.items.filter((item) => !mergedRef.current.has(item.id))
    if (newItems.length > 0) {
      for (const item of newItems) mergedRef.current.add(item.id)
      setItems((prev) => [...prev, ...newItems])
    }
    loadingRef.current = false
  }, [data])

  const handleLoadMore = useCallback(() => {
    if (loadingRef.current || !hasMore) return
    loadingRef.current = true
    setOffset((prev) => prev + PAGE_SIZE)
  }, [hasMore])

  const handleItemClick = useCallback((id: number, type: 'article' | 'blog') => {
    recordSpaceClick(id, type)
  }, [])

  return (
    <main className="page-shell pt-10">
      <section className="page-section">
        {isError ? (
          <div
            className="rounded-xl p-4 text-sm"
            style={{
              background: 'rgba(239,68,68,0.1)',
              border: '1px solid rgba(239,68,68,0.25)',
              color: '#fca5a5',
            }}
          >
            Space news temporarily unavailable.
          </div>
        ) : null}

        {isLoading && items.length === 0 ? (
          <LoadingState label="Receiving space news telemetry…" />
        ) : (
          <>
            {items.length > 0 ? (
              <div className="space-y-5">
                <div>
                  <span className="page-eyebrow">space, hot off the press 📰</span>
                  <SectionHeader
                    title="Latest Articles"
                    subtitle={`Showing ${items.length} articles`}
                  />
                </div>
                <NewsGrid
                  items={items}
                  onItemClick={handleItemClick}
                  contentType="article"
                  isStale={isPlaceholderData}
                />
                <LoadMoreButton
                  onClick={handleLoadMore}
                  isLoading={isLoading && items.length > 0}
                  hasMore={hasMore}
                />
              </div>
            ) : null}

            {!isLoading && items.length === 0 && !isError ? (
              <EmptyState
                title="No space news right now"
                body="Check back soon — the cosmos is always making headlines."
                expression="sleep"
              />
            ) : null}
          </>
        )}
      </section>
    </main>
  )
}
