import { Grid } from "antd";

/**
xs	screen < 576px
sm	screen ≥ 576px
md	screen ≥ 768px
lg	screen ≥ 992px
xl	screen ≥ 1200px
xxl	screen ≥ 1600px
*/

const useBreakpoint = () => {
  const bp = Grid.useBreakpoint();
  const bpEntries = Object.entries(bp).filter((s) => !!s[1]);
  const breakpoint = bpEntries.length ? bpEntries[bpEntries.length - 1][0] : "";

  return {
    isMobile: ["xs", "sm"].includes(breakpoint),
    isTablet: ["md"].includes(breakpoint),
    isDesktop: ["lg", "xl", "xxl"].includes(breakpoint),
    breakpoint,
  };
};

export default useBreakpoint;
