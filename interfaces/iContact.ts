export interface iHandleChangeInput {
  target: { name: string; value: string };
}

export interface iHandleSubmitForm {
  preventDefault: () => void;
}

interface iContact {
  [key: string]: string;
}

export default iContact;
