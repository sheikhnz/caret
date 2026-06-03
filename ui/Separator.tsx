import { Divider } from "antd";

type SeparatorProps = {
  vertical?: boolean;
  className?: string;
};

export const Separator = ({ vertical = false, className }: SeparatorProps) => (
  <Divider type={vertical ? "vertical" : "horizontal"} className={className} />
);
