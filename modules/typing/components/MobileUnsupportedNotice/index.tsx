/**
 * Shown on mobile / touch-primary devices where the typing playground cannot run.
 */

import { Flex, Typography } from "antd";

import { Card } from "@/ui";

const MOBILE_UNSUPPORTED_TITLE = "Use a non-touch device";
const MOBILE_UNSUPPORTED_DESCRIPTION =
  "Caret is built for physical keyboards on larger screens. Open this page on a laptop or desktop for the typing test.";

export const MobileUnsupportedNotice = () => (
  <div className="tp-mobile-unsupported">
    <Card elevated className="tp-mobile-unsupported-card">
      <Flex align="center" gap={16} vertical>
        <Typography.Title className="tp-mobile-unsupported-title" level={4}>
          {MOBILE_UNSUPPORTED_TITLE}
        </Typography.Title>
        <Typography.Text
          className="tp-mobile-unsupported-description"
          type="secondary"
        >
          {MOBILE_UNSUPPORTED_DESCRIPTION}
        </Typography.Text>
      </Flex>
    </Card>
  </div>
);
