import { ReactNode, ReactPortal } from "react";
import { createPortal } from "react-dom";

type PortalWrapperProps = {
  children: ReactNode;
};

const PortalWrapper: React.FC<PortalWrapperProps> = ({
  children,
}): ReactPortal => {
  return createPortal(children, document.body);
};

export default PortalWrapper;
