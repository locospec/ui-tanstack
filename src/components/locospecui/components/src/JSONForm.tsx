import { useFormsContext } from "@/components/locospecui/context";
import {
  materialCells,
  materialRenderers,
} from "@/components/locospecui/material-renderers";
import LensCalendarControl, {
  lensCalendarControlTester,
} from "@/components/locospecui/material-renderers/controls/LensCalendarControl";
import LensCalendarDateTimeControl, {
  lensCalendarDateTimeControlTester,
} from "@/components/locospecui/material-renderers/controls/LensCalendarDateTimeControl";
import LensDropdownControl, {
  lensDropdownControlTester,
} from "@/components/locospecui/material-renderers/controls/LensDropdownControl";
import LensEnumControl, {
  lensEnumControlTester,
} from "@/components/locospecui/material-renderers/controls/LensEnumControl";
import LensSwitchControl, {
  lensSwitchControlTester,
} from "@/components/locospecui/material-renderers/controls/LensSwitchControl";
import LensTextControl, {
  lensTextControlTester,
} from "@/components/locospecui/material-renderers/controls/LensTextControl";
import { JsonForms } from "@jsonforms/react";
import { createTheme, ThemeProvider } from "@mui/material";
import React from "react";

interface JSONFormsInterface {
  onChangeCallback?: any;
}

const JSONForm: React.FC<JSONFormsInterface> = ({}) => {
  const {
    schema,
    uischema,
    formData,
    formErrors,
    setFormErrors,
    handleFormsValuesChange,
  } = useFormsContext();

  const renderers = [
    ...materialRenderers,
    { tester: lensEnumControlTester, renderer: LensEnumControl },
    { tester: lensTextControlTester, renderer: LensTextControl },
    { tester: lensDropdownControlTester, renderer: LensDropdownControl },
    { tester: lensCalendarControlTester, renderer: LensCalendarControl },
    { tester: lensSwitchControlTester, renderer: LensSwitchControl },
    {
      tester: lensCalendarDateTimeControlTester,
      renderer: LensCalendarDateTimeControl,
    },
  ];
  const theme = createTheme({
    components: {
      MuiGrid: {
        defaultProps: {
          rowSpacing: uischema?.options?.rowSpacing | 0,
        },
      },
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <JsonForms
        schema={schema}
        uischema={uischema}
        data={formData}
        renderers={renderers}
        cells={materialCells}
        validationMode="NoValidation"
        onChange={({ data, errors }: any) => {
          if (data) {
            handleFormsValuesChange(data);
          }
          setFormErrors(errors);
        }}
        additionalErrors={formErrors}
      />
    </ThemeProvider>
  );
};

export default JSONForm;
