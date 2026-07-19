// Eksternal
import { ChangeEvent, FormEvent } from 'react';

export type ContactForm = Record<string, string>;

export type HandleChangeInput = ChangeEvent<HTMLInputElement | HTMLTextAreaElement>;

export type HandleSubmitForm = FormEvent<HTMLFormElement>;
