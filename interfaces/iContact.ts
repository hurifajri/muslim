export interface iHandleChangeInput {
  target: { name: string; value: string };
}

export interface iHandleSubmitForm {
  preventDefault: () => void;
}
