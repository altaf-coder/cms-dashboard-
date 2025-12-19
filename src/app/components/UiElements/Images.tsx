import ComponentCard from "../../components/common/ComponentCard";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ResponsiveImage from "../../components/ImageGrids/ResponsiveImage/ResponsiveImage";
import ThreeColumnImageGrid from "../../components/ImageGrids/ThreeColumnImageGrid/ThreeColumnImageGrid";
import TwoColumnImageGrid from "../../components/ImageGrids/TwoColumnImageGrid/TwoColumnImageGrid";
import PageMeta from "../../features/Dashboard/PageMeta";

export default function Images() {
  return (
    <>
      <PageMeta
        title="React.js Images Dashboard |  React.js Admin Dashboard Template"
        description="This is React.js Images page for React.js Tailwind CSS Admin Dashboard Template"
      />
      <PageBreadcrumb pageTitle="Images" />
      <div className="space-y-5 sm:space-y-6">
        <ComponentCard title="Responsive image">
          <ResponsiveImage />
        </ComponentCard>
        <ComponentCard title="Image in 2 Grid">
          <TwoColumnImageGrid />
        </ComponentCard>
        <ComponentCard title="Image in 3 Grid">
          <ThreeColumnImageGrid />
        </ComponentCard>
      </div>
    </>
  );
}
