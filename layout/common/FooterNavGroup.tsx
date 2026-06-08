/**
 * Footer nav group — Ant Design Flex + Typography.Link.
 */

import { ForkOutlined } from "@ant-design/icons";
import { Flex, Typography } from "antd";
import Link from "next/link";
import type { ComponentType } from "react";

import type { FooterIconId, FooterItem } from "./footer-config";

const FOOTER_ICON_MAP: Record<
  FooterIconId,
  ComponentType<{ "aria-hidden"?: boolean }>
> = {
  fork: ForkOutlined,
};

type FooterNavGroupProps = {
  ariaLabel: string;
  items: readonly FooterItem[];
  side: "start" | "end";
};

type FooterItemLinkProps = {
  item: FooterItem;
};

const FooterItemLink = ({ item }: FooterItemLinkProps) => {
  const Icon = item.icon ? FOOTER_ICON_MAP[item.icon] : null;

  const label = (
    <Flex align="center" component="span" gap={6}>
      {Icon ? <Icon aria-hidden /> : null}
      <span>{item.label}</span>
    </Flex>
  );

  if (item.external) {
    return (
      <Typography.Link
        aria-label={item.ariaLabel}
        href={item.href}
        rel="noopener noreferrer"
        target="_blank"
        type="secondary"
      >
        {label}
      </Typography.Link>
    );
  }

  return (
    <Link aria-label={item.ariaLabel} href={item.href}>
      <Typography.Text type="secondary">{label}</Typography.Text>
    </Link>
  );
};

export const FooterNavGroup = ({ ariaLabel, items }: FooterNavGroupProps) => {
  if (items.length === 0) {
    return null;
  }

  return (
    <nav aria-label={ariaLabel}>
      <Flex align="center" gap={16} wrap="wrap">
        {items.map((item) => (
          <FooterItemLink item={item} key={item.id} />
        ))}
      </Flex>
    </nav>
  );
};
