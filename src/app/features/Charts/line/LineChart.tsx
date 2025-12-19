import ComponentCard from "../../../components/common/ComponentCard";
import PageBreadcrumb from "../../../components/common/PageBreadCrumb";
import PageMeta from "../../Dashboard/PageMeta";
import LineChartOne from "./LineChartOne";

export default function LineChart() {
  return (
    <>
      <PageMeta
        title="React.js Chart Dashboard |  React.js Admin Dashboard Template"
        description="This is React.js Chart Dashboard page for React.js Tailwind CSS Admin Dashboard Template"
      />
      <PageBreadcrumb pageTitle="Line Chart" />
      <div className="space-y-6">
        <ComponentCard title="Line Chart 1">
          <LineChartOne />
        </ComponentCard>
      </div>
    </>
  );
}
