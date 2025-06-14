interface EnumInputInterface {
  placeholder?: string;
  emptyLabel?: string;
  callback?: (values: string | string[]) => void;
  defaultValues?: string[];
  selectedAttribute: any;
  condition: any;
  path: number[];
  resetInput?: string;
  multiple?: boolean;
  filterContainerRef: any;
  className?: any;
}

export type { EnumInputInterface };
