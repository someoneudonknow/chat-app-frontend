import React, { ReactNode, useEffect, useRef, useState } from "react";

type InfiniteScrollProps = {
  data: Array<any>;
  fetchNext: () => Promise<any>;
  render: (data: any, index: number) => ReactNode;
  loadingEl?: ReactNode | string;
  dockParent?: boolean;
  reversed?: boolean;
  hasMore: boolean;
  style?: React.CSSProperties;
};

const InfiniteScroll: React.FC<InfiniteScrollProps> = ({
  data,
  fetchNext,
  loadingEl,
  reversed,
  render,
  hasMore,
  style,
}) => {
  const bottomRef = useRef<HTMLDivElement | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore) {
          (async () => {
            console.log("run this shit");
            try {
              setIsLoading(true);
              await fetchNext();
            } catch (e) {
              console.error(e);
            } finally {
              setIsLoading(false);
            }
          })();
        }
      },
      { threshold: 0.5 }
    );

    if (bottomRef.current) {
      observer.observe(bottomRef.current);
    }

    return () => {
      if (bottomRef.current) {
        observer.unobserve(bottomRef.current);
      }
    };
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
      {data.map((item, i) => {
        return render(item, i);
      })}
      {isLoading && loadingEl}
      {!isLoading && (
        <div style={{ width: "100%", padding: "0.5px" }} ref={bottomRef}></div>
      )}
    </div>
  );
};

export default InfiniteScroll;
