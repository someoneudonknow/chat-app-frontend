import React, {
  ForwardRefExoticComponent,
  ReactNode,
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import { debounce } from "../../utils";

export type InfiniteScrollProps = {
  data: Array<any>;
  fetchNext: () => Promise<any>;
  render: (data: any, index: number) => ReactNode;
  loadingEl?: ReactNode | string;
  dockParent?: boolean;
  reversed?: boolean;
  hasMore: boolean;
  style?: React.CSSProperties;
  errorEl?: (err: any) => ReactNode;
  debounceTimeout?: number;
};

export type InfiniteScrollRef = {
  scrollToBottom: () => void;
};

const InfiniteScroll: ForwardRefExoticComponent<InfiniteScrollProps> =
  forwardRef(
    (
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
      },
      ref
    ) => {
      const bottomRef = useRef<HTMLDivElement | null>(null);
      const [isLoading, setIsLoading] = useState(false);
      const containerRef = useRef<HTMLDivElement | null>(null);
      const [error, setError] = useState<any>();

      useImperativeHandle(ref, () => {
        return {
          scrollToBottom: () => {
            containerRef.current?.scrollTo(
              0,
              containerRef.current.scrollHeight
            );
          },
        };
      });

      useEffect(() => {
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
          { threshold: 0 }
        );

        if (bottomRef.current) {
          observer.observe(bottomRef.current);
        }

        return () => {
          if (bottomRef.current) {
            observer.unobserve(bottomRef.current);
          }
        };
        //eslint-disable-next-line
      }, [hasMore, bottomRef, fetchNext, isLoading]);

      return (
        <div
          ref={containerRef}
          style={{
            overflowY: "scroll",
            display: "flex",
            flexDirection: reversed ? "column-reverse" : "column",
            justifyContent: "flex-start",
            alignItems: "center",
            height: "100%",
            ...style,
          }}
        >
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
    }
  );

export default InfiniteScroll;
