import React, {
  ReactNode,
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import { debounce } from "../../utils";

export type InfiniteScrollProps<T> = {
  data: Array<T>;
  fetchNext: () => Promise<unknown>;
  render: (data: T, index: number) => ReactNode;
  loadingEl?: ReactNode | string;
  reversed?: boolean;
  hasMore: boolean;
  style?: React.CSSProperties;
  errorEl?: (err: any) => ReactNode;
  debounceTimeout?: number;
  threshold?: number;
  noDataText?: ReactNode | string;
};

export type InfiniteScrollRef = {
  scrollToBottom: () => void;
};

const InfiniteScroll = forwardRef(<T,>(
  {
    data,
    fetchNext,
    loadingEl,
    reversed,
    render,
    hasMore,
    style,
    errorEl,
    debounceTimeout = 0,
    threshold,
    noDataText,
  }: InfiniteScrollProps<T>,
  ref: React.Ref<InfiniteScrollRef>
) => {
  const bottomRef = useRef<HTMLDivElement | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [error, setError] = useState<any>();

  useImperativeHandle(ref, () => {
    return {
      scrollToBottom: () => {
        containerRef.current?.scrollTo(0, containerRef.current.scrollHeight);
      },
    };
  });

  useEffect(() => {
    const bottomEl = bottomRef.current;

    const observer = new IntersectionObserver(
      debounce((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          (async () => {
            try {
              setIsLoading(true);
              await fetchNext();
            } catch (e) {
              setError(e);
              console.error(e);
            } finally {
              setIsLoading(false);
            }
          })();
        }
      }, debounceTimeout),
      { threshold: threshold || 0 }
    );

    if (bottomEl) {
      observer.observe(bottomEl);
    }

    return () => {
      if (bottomEl) {
        observer.unobserve(bottomEl);
      }
    };
    //eslint-disable-next-line
  }, [hasMore, bottomRef, fetchNext, isLoading]);

  return (
    <div
      ref={containerRef}
      style={{
        overflowY: "auto",
        display: "flex",
        flexDirection: reversed ? "column-reverse" : "column",
        justifyContent: "flex-start",
        alignItems: "center",
        height: "100%",
        ...style,
      }}
    >
      {!error &&
        data.length === 0 &&
        (typeof noDataText === "string" ? <p>{noDataText}</p> : noDataText)}
      {error && errorEl && errorEl(error)}
      {!error &&
        data.map((item, i) => {
          return render(item, i);
        })}
      {isLoading && loadingEl}
      {!isLoading && (
        <div
          style={{ width: "100%", padding: "0.5px" }}
          ref={bottomRef}
        ></div>
      )}
    </div>
  );
});

export default InfiniteScroll as <T>(
  props: InfiniteScrollProps<T> & { ref?: React.Ref<InfiniteScrollRef> }
) => JSX.Element;
