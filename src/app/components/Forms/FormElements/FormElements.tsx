import PageMeta from "../../../features/Dashboard/PageMeta";
import PageBreadcrumb from "../../common/PageBreadCrumb";
import CheckboxComponents from "../form/form-elements/CheckboxComponents";
import DefaultInputs from "../form/form-elements/DefaultInputs";
import DropzoneComponent from "../form/form-elements/DropZone";
import FileInputExample from "../form/form-elements/FileInputExample";
import InputGroup from "../form/form-elements/InputGroup";
import InputStates from "../form/form-elements/InputStates";
import RadioButtons from "../form/form-elements/RadioButtons";
import SelectInputs from "../form/form-elements/SelectInputs";
import TextAreaInput from "../form/form-elements/TextAreaInput";
import ToggleSwitch from "../form/form-elements/ToggleSwitch";

export default function FormElements() {
  return (
    <div>
      <PageMeta
        title="React.js Form Elements Dashboard |  React.js Admin Dashboard Template"
        description="This is React.js Form Elements  Dashboard page for React.js Tailwind CSS Admin Dashboard Template"
      />
      <PageBreadcrumb pageTitle="Form Elements" />
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <div className="space-y-6">
          <DefaultInputs />
          <SelectInputs />
          <TextAreaInput />
          <InputStates />
        </div>
        <div className="space-y-6">
          <InputGroup />
          <FileInputExample />
          <CheckboxComponents />
          <RadioButtons />
          <ToggleSwitch />
          <DropzoneComponent />
        </div>
      </div>
    </div>
  );
}
