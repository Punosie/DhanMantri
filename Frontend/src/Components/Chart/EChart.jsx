import ReactEChartsCore from "echarts-for-react/esm/core";
import * as echarts from "echarts/core";
import { CandlestickChart, LineChart } from "echarts/charts";
import { DataZoomComponent, GridComponent, LegendComponent, TooltipComponent } from "echarts/components";
import { CanvasRenderer } from "echarts/renderers";

// Register only what the dashboard draws instead of the full ECharts bundle
echarts.use([LineChart, CandlestickChart, GridComponent, TooltipComponent, LegendComponent, DataZoomComponent, CanvasRenderer]);

const EChart = (props) => <ReactEChartsCore echarts={echarts} notMerge lazyUpdate {...props} />;

export default EChart;
