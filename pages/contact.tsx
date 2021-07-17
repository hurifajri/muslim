// Eksternal
import {
  Box,
  Button,
  Flex,
  FormControl,
  FormHelperText,
  FormLabel,
  Input,
  useToast,
} from '@chakra-ui/react';
import { NextSeo } from 'next-seo';
import { useRef, useState } from 'react';

// Internal
import { useColors } from '@hooks';

const Contact = () => {
  const form = useRef(null);
  const toast = useToast();

  const initialValues = { name: '', email: '', message: '' };
  const [values, setValues] = useState(initialValues);
  const handleChangeInput = event => {
    const { name, value } = event.target;
    const newValues = { ...values };
    newValues[name] = value;
    setValues(newValues);
  };
  console.log(values);

  const [isLoading, setIsLoading] = useState(false);
  const handleSubmitForm = event => {
    event.preventDefault();
    const feedback = new FormData(form.current);
    const url =
      'https://script.google.com/macros/s/AKfycbx-JUKUUL4kQDDhmlzpElo-eY5YDBwkYvgAK3b-EIxFoCV3KZqD2CuvccMouYz4TTi8/exec';

    setIsLoading(true);
    fetch(url, { method: 'POST', body: feedback })
      .finally(() => setIsLoading(false))
      .then(() => {
        setValues(initialValues);
        toast({
          position: 'bottom',
          title: 'Pesan berhasil dikirim.',
          description: 'Jazakumullahu khairo atas kritik dan sarannya.',
          status: 'success',
          duration: 5000,
          isClosable: true,
        });
      })
      .catch(() =>
        toast({
          title: 'Pesan gagal dikirim.',
          description: 'Mohon dicoba beberapa saat lagi.',
          status: 'error',
          duration: 5000,
          isClosable: true,
        })
      );
  };

  // Dark/light mode colors
  const { bgButtonHighlight, textLight } = useColors();

  return (
    <>
      {/* Head */}
      <NextSeo
        title="Muslim • Kritik dan Saran"
        description="Silakan sampaikan kritik dan saran."
      />
      <Box height="100vh">
        <form ref={form} onSubmit={handleSubmitForm}>
          <Flex direction="column" p={5} sx={{ gap: 30 }}>
            <FormControl id="name" isRequired>
              <FormLabel m={0}>Nama</FormLabel>
              <Input
                name="name"
                type="text"
                value={values['name']}
                onChange={handleChangeInput}
                variant="flushed"
              />
            </FormControl>
            <FormControl id="email" isRequired>
              <FormLabel m={0}>Email</FormLabel>
              <Input
                name="email"
                type="email"
                value={values['email']}
                onChange={handleChangeInput}
                variant="flushed"
              />
            </FormControl>
            <FormControl id="message" isRequired>
              <FormLabel m={0}>Pesan</FormLabel>
              <Input
                name="message"
                type="textarea"
                value={values['message']}
                onChange={handleChangeInput}
                variant="flushed"
              />
              <FormHelperText>
                Silakan sampaikan kritik atau saran.
              </FormHelperText>
            </FormControl>
            <Button
              type="submit"
              isLoading={isLoading}
              loadingText="Mengirim"
              color={textLight}
              bg={bgButtonHighlight}
              _hover={{ bg: bgButtonHighlight }}
            >
              Kirim
            </Button>
          </Flex>
        </form>
      </Box>
    </>
  );
};

export default Contact;
