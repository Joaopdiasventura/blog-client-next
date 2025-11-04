"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { Post } from "../models/post";
import { Navbar } from "../components/navbar";
import { findMany } from "../lib/http/api/post";
import { PostCard } from "../components/ui/post-card";
import { Skeleton } from "../components/ui/skeleton";

export default function Home() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [page, setPage] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);

  const observerTarget = useRef<HTMLDivElement>(null);
  const isFetchingRef = useRef(false);
  const abortRef = useRef<AbortController | null>(null);

  const appendUnique = (prev: Post[], next: Post[]) => {
    const seen = new Set(prev.map((p) => p.id));
    const merged = [...prev];
    for (const p of next) if (!seen.has(p.id)) merged.push(p);
    return merged;
  };

  const loadPage = useCallback(
    async (pageToLoad: number) => {
      if (!hasMore || isFetchingRef.current) return;
      isFetchingRef.current = true;
      setIsLoading(true);

      abortRef.current?.abort();
      const controller = new AbortController();
      abortRef.current = controller;

      try {
        const { content } = await findMany({
          page: pageToLoad,
        });

        if (!content || content.length == 0) return setHasMore(false);

        setPosts((prev) => appendUnique(prev, content));
      } finally {
        setIsLoading(false);
        isFetchingRef.current = false;
      }
    },
    [hasMore]
  );

  useEffect(() => {
    loadPage(page);
  }, [page, loadPage]);

  useEffect(() => {
    const target = observerTarget.current;
    if (!target) return;

    const io = new IntersectionObserver(
      (entries) => {
        if (
          entries[0].isIntersecting &&
          hasMore &&
          !isLoading &&
          !isFetchingRef.current
        )
          setPage((p) => p + 1);
      },
      { threshold: 0.1 }
    );

    io.observe(target);
    return () => io.disconnect();
  }, [hasMore, isLoading]);

  useEffect(() => {
    if (!posts.length && !isLoading && !isFetchingRef.current) loadPage(0);
  }, [isLoading, loadPage, posts.length]);

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      <Navbar />
      <main className="max-w-3xl mx-auto px-4 py-8">
        <h1 className="mb-8">Posts Recentes</h1>

        <div className="space-y-6">
          {posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}

          {isLoading && (
            <>
              {Array.from({ length: 3 }).map((_, i) => (
                <div
                  key={i}
                  className="bg-background animate-pulse rounded-lg p-6 space-y-4 border"
                >
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <div className="flex items-center gap-3 pt-4">
                    <Skeleton className="h-8 w-8 rounded-full" />
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-24" />
                      <Skeleton className="h-3 w-16" />
                    </div>
                  </div>
                </div>
              ))}
            </>
          )}

          <div ref={observerTarget} className="h-4" />

          {!hasMore && posts.length > 0 && (
            <p className="text-center text-gray-500 dark:text-gray-400 py-8">
              Voceê chegou ao fim dos posts
            </p>
          )}
        </div>
      </main>
    </div>
  );
}
