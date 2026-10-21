import { SpeedInsights } from "@vercel/speed-insights/react";

// Real-user page load metrics. To also track visitors, enable Web Analytics in the
// Vercel dashboard (Project → Analytics), then render <Analytics /> from
// "@vercel/analytics/react" here; without that setting its script 404s.
const VercelInsights = () => <SpeedInsights />;

export default VercelInsights;
