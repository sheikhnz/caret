/**
 * Minimal page footer — FOOTER_CONFIG via Ant Design Flex + Typography.Link.
 * Client boundary: Ant Design layout/typography requires the registry context.
 */

"use client";

import { Flex } from "antd";

import { FOOTER_CONFIG } from "./footer-config";
import { FooterNavGroup } from "./FooterNavGroup";

export const PgLayoutFooter = () => (
  <footer className="tp-page-chrome tp-page-footer">
    <div className="tp-page-inner">
      <Flex
        align="center"
        gap={16}
        justify="space-between"
        style={{ width: "100%" }}
        wrap="wrap"
      >
        <FooterNavGroup
          ariaLabel="Footer"
          items={FOOTER_CONFIG.start}
          side="start"
        />
        <FooterNavGroup
          ariaLabel="Footer links"
          items={FOOTER_CONFIG.end}
          side="end"
        />
      </Flex>
    </div>
  </footer>
);
