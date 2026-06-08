/**
 * Site header — brand left, account right (Ant Design Flex + Typography).
 * Client boundary: Ant Design layout/typography requires the registry context.
 */

"use client";

import { Flex, Typography } from "antd";

import { BRAND_TAGLINE, CaretWordmark } from "@/layout/brand";

import { SiteAccountButton } from "./SiteAccountButton";

export const SiteHeader = () => (
  <header className="tp-page-chrome tp-page-header">
    <div className="tp-page-inner">
      <Flex
        align="flex-start"
        gap={16}
        justify="space-between"
        style={{ width: "100%" }}
      >
        <Flex align="flex-start" gap={4} vertical>
          <CaretWordmark />
          <Typography.Text type="secondary">{BRAND_TAGLINE}</Typography.Text>
        </Flex>
        <SiteAccountButton />
      </Flex>
    </div>
  </header>
);
